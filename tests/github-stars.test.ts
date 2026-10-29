import assert from "node:assert/strict"
import { test } from "node:test"
import { fetchRepositoryStars, getStarsFromRepositoryPage } from "../utils/githubStars.ts"
import { matchesLibraryFilters } from "../utils/libraryMetrics.ts"
import { libraries } from "../data/libraries.ts"

test("repository pages provide exact stars rather than their rounded visible label", () => {
  assert.equal(
    getStarsFromRepositoryPage(
      '<script type="application/json">{"repository":{"stargazerCount":99289,"watcherCount":1315}}</script><span>99.3k</span>'
    ),
    99289
  )
  assert.equal(
    getStarsFromRepositoryPage(
      '<span title="99,289" id="repo-stars-counter-star">99.3k</span>'
    ),
    99289
  )
  assert.equal(getStarsFromRepositoryPage('{"stargazerCount":0}'), 0)
  for (const html of [
    "<span>99.3k</span>",
    '{"stargazerCount":null}',
    '{"stargazerCount":-1}',
    '{"stargazerCount":1.5}',
    '<span id="repo-stars-counter-star">99.3k</span>',
  ]) {
    assert.equal(getStarsFromRepositoryPage(html), undefined)
  }
})

test("a valid GitHub API response needs no fallback, including zero stars", async () => {
  for (const stars of [0, 99289]) {
    const calls: string[] = []
    const request: typeof fetch = async (url) => {
      calls.push(String(url))
      return Response.json({ stargazers_count: stars })
    }
    assert.equal(await fetchRepositoryStars("mui/material-ui", request), stars)
    assert.deepEqual(calls, ["https://api.github.com/repos/mui/material-ui"])
  }
})

test("API rate limits, invalid data, and network errors fall back to GitHub's repository page", async () => {
  for (const failure of ["limit", "invalid", "network"]) {
    const calls: string[] = []
    const request: typeof fetch = async (url) => {
      calls.push(String(url))
      if (String(url).startsWith("https://api.github.com/")) {
        if (failure === "network") throw new TypeError("fetch failed")
        if (failure === "invalid") return Response.json({ stargazers_count: null })
        return Response.json({ message: "API rate limit exceeded" }, { status: 403 })
      }
      return new Response('{"stargazerCount":99289,"watcherCount":1315}')
    }
    const stars = await fetchRepositoryStars("mui/material-ui", request)
    assert.equal(stars, 99289)
    assert.deepEqual(calls, [
      "https://api.github.com/repos/mui/material-ui",
      "https://github.com/mui/material-ui",
    ])

    const library = { ...libraries[1], nbStars: stars }
    for (const minimum of [1000, 10000, stars]) {
      assert.ok(
        matchesLibraryFilters(library, [], {
          stars: minimum,
          weeklyDownloads: 0,
          components: 0,
        })
      )
    }
    assert.equal(
      matchesLibraryFilters(library, [], {
        stars: stars + 1,
        weeklyDownloads: 0,
        components: 0,
      }),
      false
    )
  }
})

test("failed or unparseable repository pages remain unavailable instead of becoming zero", async () => {
  for (const response of [
    new Response('{"stargazerCount":1234}', { status: 503 }),
    new Response("<html>GitHub is temporarily unavailable</html>"),
  ]) {
    const request: typeof fetch = async (url) =>
      String(url).startsWith("https://api.github.com/")
        ? Response.json({ message: "API rate limit exceeded" }, { status: 403 })
        : response
    await assert.rejects(fetchRepositoryStars("mui/material-ui", request))
  }
})
