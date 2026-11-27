import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { test } from "node:test"
import { libraries } from "../data/libraries.ts"
import { buttonFilters } from "../data/filters.ts"
import { sections } from "../data/sections.ts"
import { getValidMetric, matchesLibraryFilters } from "../utils/libraryMetrics.ts"
import { getSiteUrl } from "../utils/getSiteUrl.ts"
import { getDisplayableNumber } from "../utils/getDisplayableNumber.ts"
import {
  matchesLibrarySearch,
  parseFilterQuery,
  selectCardBadges,
  serializeFilterQuery,
  sortLibraries,
} from "../utils/catalog.ts"

test("the curated catalog has 20 distinct libraries with valid local assets and references", () => {
  assert.equal(libraries.length, 20)
  assert.equal(new Set(libraries.map(({ name }) => name)).size, 20)
  assert.ok(existsSync(new URL("../public/favicon/logo.svg", import.meta.url)))
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

test("search matches library names, dependencies, packages, components, aliases, and capabilities", () => {
  const componentAliases = new Map<string, readonly string[]>(
    sections.flatMap((section) =>
      section.components
        .filter((c) => Boolean(c.aliases?.length))
        .map((c) => [c.name, c.aliases!] as const)
    )
  )
  const filterLabels = new Map(buttonFilters.map((f) => [f.id, f.label]))
  const ctx = { componentAliases, filterLabels }

  const shadcn = libraries.find(({ name }) => name === "shadcn/ui")!
  const withBase = { ...shadcn, onTopOf: "Radix Primitives" }
  assert.ok(matchesLibrarySearch(shadcn, "", ctx))
  assert.ok(matchesLibrarySearch(shadcn, "shadcn", ctx))
  assert.ok(matchesLibrarySearch(shadcn, "paste tailwind", ctx))
  assert.ok(matchesLibrarySearch(withBase, "radix tailwind", ctx))
  assert.ok(matchesLibrarySearch(shadcn, "drawer", ctx))
  assert.ok(matchesLibrarySearch(shadcn, "calendar", ctx))
  assert.equal(matchesLibrarySearch(shadcn, "nonexistent-xyz", ctx), false)
})

test("sorting handles stars, downloads, components, and pushes unknown metrics last", () => {
  const a = { ...libraries[0], name: "A", nbStars: 1000, nbDownloads: undefined }
  const b = { ...libraries[1], name: "B", nbStars: undefined, nbDownloads: 500_000 }
  const c = { ...libraries[2], name: "C", nbStars: 5000, nbDownloads: 100_000 }

  assert.deepEqual(
    sortLibraries([a, b, c], "default").map((l) => l.name),
    ["A", "B", "C"]
  )
  assert.deepEqual(
    sortLibraries([a, b, c], "stars").map((l) => l.name),
    ["C", "A", "B"]
  )
  assert.deepEqual(
    sortLibraries([a, b, c], "downloads").map((l) => l.name),
    ["B", "C", "A"]
  )
  const byComponents = sortLibraries(libraries, "components")
  for (let i = 1; i < byComponents.length; i++) {
    assert.ok(
      byComponents[i - 1].componentMatchings.length >=
        byComponents[i].componentMatchings.length
    )
  }
})

test("card badge selection promotes active filters to the front and reports overflow count", () => {
  const antd = libraries.find(({ name }) => name === "Ant Design")!
  const defaultBadges = selectCardBadges(antd, buttonFilters, [], 4)
  assert.equal(defaultBadges.visible.length, 4)
  assert.equal(defaultBadges.hiddenCount, antd.filterMatchings.length - 4)

  const activeBadges = selectCardBadges(antd, buttonFilters, ["FRTLSupport", "FFigma"], 4)
  assert.equal(activeBadges.visible[0].id, "FFigma")
  assert.equal(activeBadges.visible[1].id, "FRTLSupport")
  assert.ok(activeBadges.activeSet.has("FRTLSupport"))
})

test("URL filter query parsing and serialization round-trip cleanly and sanitize invalid inputs", () => {
  const parsed = parseFilterQuery(
    {
      q: "  radix ",
      sort: "stars",
      features: "FStyled,FUnstyled,FTailwind,INVALID_ID,FTailwind",
      stars: "10000",
      downloads: "500",
      components: "-20",
    },
    buttonFilters
  )

  assert.equal(parsed.search, "radix")
  assert.equal(parsed.sort, "stars")
  // FUnstyled auto-disables FStyled
  assert.deepEqual(parsed.features, ["FUnstyled", "FTailwind"])
  assert.equal(parsed.stars, 10000)
  assert.equal(parsed.downloads, 500)
  assert.equal(parsed.components, 0)

  const serialized = serializeFilterQuery(parsed)
  assert.deepEqual(serialized, {
    q: "radix",
    sort: "stars",
    features: "FUnstyled,FTailwind",
    stars: "10000",
    downloads: "500",
  })

  assert.deepEqual(
    serializeFilterQuery(parseFilterQuery({ sort: "invalid", stars: "abc" }, buttonFilters)),
    {}
  )
})

test("displayable numbers format compact thousands and millions", () => {
  assert.equal(getDisplayableNumber(420), "420")
  assert.equal(getDisplayableNumber(12_340), "12.3k")
  assert.equal(getDisplayableNumber(1_450_000), "1.5M")
})
