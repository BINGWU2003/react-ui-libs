import { type ButtonFilterID, type RangeFilterID } from "@/types/filters.types"
import { buttonFilters } from "@/data/filters"
import { sections } from "@/data/sections"
import type { FilterQueryState, SortOption } from "@/utils/catalog"

const createInitialButtonFiltering = (): {
  [K in ButtonFilterID]: { selected: boolean }
} => ({
  FStyled: { selected: false },
  FUnstyled: { selected: false },
  FImported: { selected: false },
  FPasted: { selected: false },
  FTailwind: { selected: false },
  FAccessible: { selected: false },
  FFigma: { selected: false },
  FDarkMode: { selected: false },
  FFree: { selected: false },
  FRoadmap: { selected: false },
  FRTLSupport: { selected: false },
  FTyped: { selected: false },
  FBuiltinThemes: { selected: false },
  FThemeGenerator: { selected: false },
  FSemanticColors: { selected: false },
  FForm: { selected: false },
})

const createInitialRangeFiltering = (): { [K in RangeFilterID]: { qty: number } } => ({
  FNbStars: { qty: 0 },
  FNbDownloads: { qty: 0 },
  FNbComponents: { qty: 0 },
})

export const useFilterStore = () => {
  const buttonFiltering = useState("buttonFilterStore", createInitialButtonFiltering)
  const rangeFiltering = useState("rangeFilterStore", createInitialRangeFiltering)
  const searchQuery = useState<string>("searchQueryStore", () => "")
  const sortBy = useState<SortOption>("sortByStore", () => "default")

  const invertButtonFiltering = (filterID: ButtonFilterID) => {
    const oldSelected = buttonFiltering.value[filterID].selected
    buttonFiltering.value[filterID].selected = !oldSelected

    const autoDisable = <ButtonFilterID | undefined>(
      findBy("id", filterID, buttonFilters)?.autoDisable
    )
    if (oldSelected === false && autoDisable) {
      buttonFiltering.value[autoDisable].selected = false
    }
  }

  const removeButtonFilter = (filterID: ButtonFilterID) => {
    buttonFiltering.value[filterID].selected = false
  }

  const changeRangeFiltering = (rangeFilterID: RangeFilterID, qty: number) => {
    rangeFiltering.value[rangeFilterID].qty = qty
  }

  const resetRangeFilter = (rangeFilterID: RangeFilterID) => {
    rangeFiltering.value[rangeFilterID].qty = 0
  }

  const setSearchQuery = (value: string) => {
    searchQuery.value = value
  }

  const setSortBy = (value: SortOption) => {
    sortBy.value = value
  }

  const touchedButtonFilterIDs = () =>
    <ButtonFilterID[]>(
      Object.entries(buttonFiltering.value)
        .filter(([_, value]) => value.selected === true)
        .map(([key, _]) => key)
    )

  const touchedRangeFilterIDs = () =>
    <RangeFilterID[]>(
      Object.entries(rangeFiltering.value)
        .filter(([_, value]) => value.qty > 0)
        .map(([key, _]) => key)
    )

  const nbTouchedFilters = () =>
    touchedButtonFilterIDs().length + touchedRangeFilterIDs().length

  const hasActiveCriteria = () =>
    nbTouchedFilters() > 0 || searchQuery.value.trim().length > 0

  const clearFiltering = () => {
    for (const filterID of <ButtonFilterID[]>Object.keys(buttonFiltering.value)) {
      buttonFiltering.value[filterID].selected = false
    }

    for (const rangeFilterID of <RangeFilterID[]>Object.keys(rangeFiltering.value)) {
      rangeFiltering.value[rangeFilterID].qty = 0
    }

    searchQuery.value = ""
  }

  const applyQueryState = (state: FilterQueryState) => {
    for (const filterID of <ButtonFilterID[]>Object.keys(buttonFiltering.value)) {
      buttonFiltering.value[filterID].selected = state.features.includes(filterID)
    }
    rangeFiltering.value.FNbStars.qty = state.stars
    rangeFiltering.value.FNbDownloads.qty = state.downloads
    rangeFiltering.value.FNbComponents.qty = state.components
    searchQuery.value = state.search
    sortBy.value = state.sort
  }

  const getQueryState = (): FilterQueryState => ({
    search: searchQuery.value,
    sort: sortBy.value,
    features: touchedButtonFilterIDs(),
    stars: rangeFiltering.value.FNbStars.qty,
    downloads: rangeFiltering.value.FNbDownloads.qty,
    components: rangeFiltering.value.FNbComponents.qty,
  })

  return {
    buttonFiltering,
    rangeFiltering,
    searchQuery,
    sortBy,
    invertButtonFiltering,
    removeButtonFilter,
    changeRangeFiltering,
    resetRangeFilter,
    setSearchQuery,
    setSortBy,
    touchedButtonFilterIDs,
    touchedRangeFilterIDs,
    nbTouchedFilters,
    hasActiveCriteria,
    clearFiltering,
    applyQueryState,
    getQueryState,
  }
}

export const useNbComponentsStore = () => {
  const componentCount = sections.reduce((count, section) => {
    return count + section.components.length
  }, 0)
  return useState("nbComponentsStore", () => componentCount)
}

export const useShowMissingStore = () => {
  const showMissing = useState("showMissingStore", () => true)

  const invertMissing = () => {
    showMissing.value = !showMissing.value
  }

  return {
    showMissing,
    invertMissing,
  }
}
