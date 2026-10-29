import type { Library } from "@/types/libraries.types"
import type { ButtonFilterID } from "@/types/filters.types"

export const getValidMetric = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined

export const matchesLibraryFilters = (
  library: Library,
  selectedFilters: readonly ButtonFilterID[],
  minimums: { stars: number; weeklyDownloads: number; components: number }
): boolean => {
  const features = new Set(library.filterMatchings.map(({ id }) => id))
  const meetsMinimum = (value: number | undefined, minimum: number) =>
    minimum <= 0 || (getValidMetric(value) !== undefined && value! >= minimum)

  return (
    selectedFilters.every((id) => features.has(id)) &&
    meetsMinimum(library.nbStars, minimums.stars) &&
    meetsMinimum(library.nbDownloads, minimums.weeklyDownloads) &&
    library.componentMatchings.length >= minimums.components
  )
}
