import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { test } from "node:test"
import { libraries } from "../data/libraries.ts"
import { buttonFilters } from "../data/filters.ts"
import { sections } from "../data/sections.ts"
import { getValidMetric, matchesLibraryFilters } from "../utils/libraryMetrics.ts"
import { getSiteUrl } from "../utils/getSiteUrl.ts"

test("the curated catalog has 18 distinct libraries with valid local assets and references", () => {
  assert.equal(libraries.length, 18)
  assert.equal(new Set(libraries.map(({ name }) => name)).size, 18)
  const filters = new Set(buttonFilters.map(({ id }) => id))
  const components = new Set(
    sections.flatMap(({ components }) => components.map(({ name }) => name))
  )
  for (const library of libraries) {
    assert.equal(new URL(library.url).protocol, "https:", library.name)
    assert.ok(library.componentMatchings.length > 0, library.name)
    assert.equal(
      new Set(library.componentMatchings).size,
      library.componentMatchings.length,
      library.name
    )
    assert.equal(
      new Set(library.filterMatchings.map(({ id }) => id)).size,
      library.filterMatchings.length,
      library.name
    )
    for (const component of library.componentMatchings)
      assert.ok(components.has(component), `${library.name}: ${component}`)
    for (const { id } of library.filterMatchings)
      assert.ok(filters.has(id), `${library.name}: ${id}`)
    for (const logo of [library.logo, library.logoDark].filter(Boolean)) {
      assert.ok(
        existsSync(new URL(`../public/img/${logo}`, import.meta.url)),
        `${library.name}: ${logo}`
      )
    }
    assert.equal(Boolean(library.repoOwner), Boolean(library.repoName), library.name)
  }
})

test("source distribution uses the shadcn CLI metric", () => {
  const shadcn = libraries.find(({ name }) => name === "shadcn/ui")!
  assert.equal(shadcn.package, "shadcn")
  assert.match(shadcn.packageNote!, /CLI/)
  assert.ok(shadcn.filterMatchings.some(({ id }) => id === "FPasted"))
  assert.ok(
    matchesLibraryFilters({ ...shadcn, nbDownloads: 10000 }, ["FPasted"], {
      stars: 0,
      weeklyDownloads: 10000,
      components: 0,
    })
  )
})

test("API failures and malformed metric values remain unknown, while zero is valid", () => {
  for (const value of [
    undefined,
    null,
    "123",
    -1,
    NaN,
    Infinity,
    { message: "API rate limit exceeded" },
  ]) {
    assert.equal(getValidMetric(value), undefined)
  }
  assert.equal(getValidMetric(0), 0)
  assert.equal(getValidMetric(1234), 1234)
})

test("unknown metrics pass inactive filters and fail the corresponding active filters", () => {
  const library = { ...libraries[0], nbStars: undefined, nbDownloads: undefined }
  assert.ok(
    matchesLibraryFilters(library, [], { stars: 0, weeklyDownloads: 0, components: 0 })
  )
  assert.equal(
    matchesLibraryFilters(library, [], {
      stars: 1000,
      weeklyDownloads: 0,
      components: 0,
    }),
    false
  )
  assert.equal(
    matchesLibraryFilters(library, [], {
      stars: 0,
      weeklyDownloads: 5000,
      components: 0,
    }),
    false
  )
  assert.ok(
    matchesLibraryFilters({ ...library, nbStars: 1200 }, [], {
      stars: 1000,
      weeklyDownloads: 0,
      components: 0,
    })
  )
})

test("feature and quantity filters combine with AND and include exact minimums", () => {
  const library = { ...libraries[0], nbStars: 1000, nbDownloads: 5000 }
  const minimums = {
    stars: 1000,
    weeklyDownloads: 5000,
    components: library.componentMatchings.length,
  }
  assert.ok(matchesLibraryFilters(library, ["FStyled", "FImported"], minimums))
  assert.equal(matchesLibraryFilters(library, ["FUnstyled"], minimums), false)
  assert.equal(matchesLibraryFilters(library, [], { ...minimums, stars: 1001 }), false)
  assert.equal(
    matchesLibraryFilters(library, [], { ...minimums, weeklyDownloads: 5001 }),
    false
  )
  assert.equal(
    matchesLibraryFilters(library, [], {
      ...minimums,
      components: minimums.components + 1,
    }),
    false
  )
  assert.ok(
    matchesLibraryFilters({ ...library, nbStars: 0, nbDownloads: 0 }, [], {
      stars: 0,
      weeklyDownloads: 0,
      components: 0,
    })
  )
})

test("absolute SEO metadata requires an HTTP(S) site URL", () => {
  assert.equal(
    getSiteUrl("https://react-ui-libs.vercel.app/"),
    "https://react-ui-libs.vercel.app"
  )
  assert.equal(getSiteUrl("http://localhost:3000/"), "http://localhost:3000")
  for (const value of ["", "not a URL", "/relative", "javascript:alert(1)"])
    assert.equal(getSiteUrl(value), undefined)
})
