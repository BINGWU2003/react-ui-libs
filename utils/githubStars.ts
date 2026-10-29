import { getValidMetric } from "./libraryMetrics.ts"

export const getStarsFromRepositoryPage = (html: string): number | undefined => {
  // GitHub's repository page embeds the exact count; the visible label is rounded.
  const embedded = html.match(/"stargazerCount"\s*:\s*(\d+)\s*[,}]/)?.[1]
  const counter = html.match(/<[^>]*\bid=["']repo-stars-counter-star["'][^>]*>/)?.[0]
  const title = counter?.match(/\btitle=["']([\d,]+)["']/)?.[1]
  const count = embedded ?? title?.replaceAll(",", "")
  return count === undefined ? undefined : getValidMetric(Number(count))
}

export const fetchRepositoryStars = async (
  repository: string,
  request: typeof fetch = fetch
): Promise<number> => {
  const headers = { "User-Agent": "react-ui-libs" }

  try {
    const response = await request(`https://api.github.com/repos/${repository}`, {
      headers,
      signal: AbortSignal.timeout(5000),
    })
    if (response.ok) {
      const data = await response.json()
      const stars = getValidMetric(data?.stargazers_count)
      if (stars !== undefined) return stars
    }
  } catch {
    // A failed or rate-limited API must not make every active star filter empty.
  }

  const response = await request(`https://github.com/${repository}`, {
    headers,
    signal: AbortSignal.timeout(8000),
  })
  if (response.ok) {
    const stars = getStarsFromRepositoryPage(await response.text())
    if (stars !== undefined) return stars
  }

  throw new Error(`Repository stars unavailable: ${repository}`)
}
