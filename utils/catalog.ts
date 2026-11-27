import type { Library } from "../types/libraries.types.ts"
import type { ButtonFilter, ButtonFilterID } from "../types/filters.types.ts"
import { getValidMetric } from "./libraryMetrics.ts"

export type SortOption = "default" | "stars" | "downloads" | "components"

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: "default", label: "Featured" },
  { value: "stars", label: "GitHub Stars" },
  { value: "downloads", label: "Weekly Downloads" },
  { value: "components", label: "Most Components" },
]

export type FilterQueryState = {
  search: string
  sort: SortOption
  features: ButtonFilterID[]
  stars: number
  downloads: number
  components: number
}

const VALID_SORTS = new Set<SortOption>(["default", "stars", "downloads", "components"])

// Prioritizes high-signal architectural attributes on the card front.
const CARD_BADGE_PRIORITY: ReadonlyArray<ButtonFilterID> = [
  "FStyled",
  "FUnstyled",
  "FImported",
  "FPasted",
  "FTailwind",
  "FAccessible",
  "FDarkMode",
  "FFree",
  "FTyped",
  "FBuiltinThemes",
  "FThemeGenerator",
  "FSemanticColors",
  "FForm",
  "FFigma",
  "FRTLSupport",
  "FRoadmap",
]

const BADGE_PRIORITY_MAP = new Map<ButtonFilterID, number>(
  CARD_BADGE_PRIORITY.map((id, idx) => [id, idx])
)

export type SearchContext = {
  componentAliases?: ReadonlyMap<string, readonly string[]>
  filterLabels?: ReadonlyMap<ButtonFilterID, string>
}

export const matchesLibrarySearch = (
  library: Library,
  rawQuery: string,
  context: SearchContext = {}
): boolean => {
  const tokens = rawQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  if (tokens.length === 0) return true

  const haystackParts: string[] = [library.name]
  if (library.onTopOf) haystackParts.push(library.onTopOf)
  if (library.package) haystackParts.push(library.package)

  for (const component of library.componentMatchings) {
    haystackParts.push(component)
    const aliases = context.componentAliases?.get(component)
    if (aliases) {
      haystackParts.push(...aliases)
    }
  }

  for (const { id } of library.filterMatchings) {
    const label = context.filterLabels?.get(id)
    if (label) haystackParts.push(label)
  }

  const haystack = haystackParts.join(" ").toLowerCase()
  return tokens.every((token) => haystack.includes(token))
}

const compareDescOptional = (a: number | undefined, b: number | undefined): number => {
  const validA = getValidMetric(a)
  const validB = getValidMetric(b)
  if (validA === undefined && validB === undefined) return 0
  if (validA === undefined) return 1
  if (validB === undefined) return -1
  return validB - validA
}

export const sortLibraries = (
  libraries: readonly Library[],
  sortBy: SortOption
): Library[] => {
  if (sortBy === "default") return [...libraries]

  return libraries
    .map((library, index) => ({ library, index }))
    .sort((a, b) => {
      let diff = 0
      if (sortBy === "stars") {
        diff = compareDescOptional(a.library.nbStars, b.library.nbStars)
      } else if (sortBy === "downloads") {
        diff = compareDescOptional(a.library.nbDownloads, b.library.nbDownloads)
      } else if (sortBy === "components") {
        diff = b.library.componentMatchings.length - a.library.componentMatchings.length
        if (diff === 0) {
          diff = compareDescOptional(a.library.nbStars, b.library.nbStars)
        }
      }
      return diff !== 0 ? diff : a.index - b.index
    })
    .map(({ library }) => library)
}

export const selectCardBadges = (
  library: Pick<Library, "filterMatchings">,
  allFilters: readonly ButtonFilter[],
  activeFilterIds: readonly ButtonFilterID[],
  maxVisible = 4
): {
  visible: ButtonFilter[]
  hiddenCount: number
  activeSet: Set<ButtonFilterID>
} => {
  const filterById = new Map(allFilters.map((f) => [f.id, f]))
  const activeSet = new Set<ButtonFilterID>(activeFilterIds)

  const matched = library.filterMatchings
    .map(({ id }) => filterById.get(id))
    .filter((f): f is ButtonFilter => Boolean(f))

  matched.sort((a, b) => {
    const aActive = activeSet.has(a.id) ? 0 : 1
    const bActive = activeSet.has(b.id) ? 0 : 1
    if (aActive !== bActive) return aActive - bActive

    const aPriority = BADGE_PRIORITY_MAP.get(a.id) ?? 999
    const bPriority = BADGE_PRIORITY_MAP.get(b.id) ?? 999
    if (aPriority !== bPriority) return aPriority - bPriority
    return a.index - b.index
  })

  const matchedActiveCount = matched.filter((f) => activeSet.has(f.id)).length
  const limit = Math.min(Math.max(maxVisible, matchedActiveCount), 6)
  const visible = matched.slice(0, limit)
  const hiddenCount = Math.max(0, matched.length - visible.length)

  return { visible, hiddenCount, activeSet }
}

const getFirstParam = (
  value: string | (string | null)[] | null | undefined
): string => {
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

const parsePositiveInt = (raw: string, max: number): number => {
  if (!raw) return 0
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return 0
  return Math.min(parsed, max)
}

export const parseFilterQuery = (
  query: Record<string, string | (string | null)[] | null | undefined>,
  allFilters: readonly ButtonFilter[],
  limits: { stars: number; downloads: number; components: number } = {
    stars: 200000,
    downloads: 50000,
    components: 100,
  }
): FilterQueryState => {
  const search = getFirstParam(query.q).trim()
  const rawSort = getFirstParam(query.sort) as SortOption
  const sort: SortOption = VALID_SORTS.has(rawSort) ? rawSort : "default"

  const filterById = new Map(allFilters.map((f) => [f.id, f]))
  const rawFeatures = getFirstParam(query.features)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const features: ButtonFilterID[] = []
  for (const id of rawFeatures) {
    const def = filterById.get(id as ButtonFilterID)
    if (!def) continue
    if (features.includes(def.id)) continue
    if (def.autoDisable) {
      const idx = features.indexOf(def.autoDisable)
      if (idx !== -1) features.splice(idx, 1)
    }
    features.push(def.id)
  }

  return {
    search,
    sort,
    features,
    stars: parsePositiveInt(getFirstParam(query.stars), limits.stars),
    downloads: parsePositiveInt(getFirstParam(query.downloads), limits.downloads),
    components: parsePositiveInt(getFirstParam(query.components), limits.components),
  }
}

export const serializeFilterQuery = (
  state: FilterQueryState
): Record<string, string> => {
  const result: Record<string, string> = {}
  const trimmedSearch = state.search.trim()
  if (trimmedSearch) result.q = trimmedSearch
  if (state.sort !== "default") result.sort = state.sort
  if (state.features.length > 0) result.features = state.features.join(",")
  if (state.stars > 0) result.stars = String(state.stars)
  if (state.downloads > 0) result.downloads = String(state.downloads)
  if (state.components > 0) result.components = String(state.components)
  return result
}
