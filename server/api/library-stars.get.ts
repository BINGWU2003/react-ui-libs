import { libraries } from "../../data/libraries"
import { fetchRepositoryStars } from "../../utils/githubStars"

// Cache and deduplicate each repository across visitors. Keep successful values
// during background refreshes; failed requests never replace them with zero.
const getCachedStars = defineCachedFunction(fetchRepositoryStars, {
  name: "repository-stars",
  maxAge: 60 * 60,
  swr: true,
  getKey: (repository: string) => repository,
})

export default defineEventHandler(async () => {
  const repositories = [
    ...new Set(
      libraries
        .filter(({ repoOwner, repoName }) => repoOwner && repoName)
        .map(({ repoOwner, repoName }) => `${repoOwner}/${repoName}`)
    ),
  ]
  const entries = await Promise.all(
    repositories.map(async (repository) => {
      try {
        return [repository, await getCachedStars(repository)] as const
      } catch {
        return [repository, null] as const
      }
    })
  )

  if (entries.every(([, stars]) => stars === null)) {
    throw createError({ statusCode: 502, statusMessage: "GitHub stars unavailable" })
  }

  return Object.fromEntries(entries)
})
