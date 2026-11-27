<template>
  <div class="min-w-0 flex-1 space-y-5">
    <!-- Top Discovery Toolbar -->
    <div class="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <div class="flex flex-1 items-center gap-2">
        <!-- Mobile Filter Trigger -->
        <button
          type="button"
          class="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-geist-border bg-geist-surface px-3 text-xs font-medium text-geist-fg transition-colors hover:border-geist-border-strong hover:bg-geist-subtle lg:hidden"
          @click="emit('openMobileFilters')"
        >
          <UIcon name="i-ph-sliders-horizontal" class="size-4 text-geist-secondary" />
          <span>Filters</span>
          <span
            v-if="nbTouchedFilters() > 0"
            class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-geist-accent px-1 font-mono text-[10px] tabular-nums text-geist-accent-fg"
          >
            {{ nbTouchedFilters() }}
          </span>
        </button>

        <!-- Search Input -->
        <div class="relative flex-1">
          <UIcon
            name="i-ph-magnifying-glass"
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-geist-muted"
          />
          <input
            ref="searchInputRef"
            :value="searchQuery"
            type="search"
            placeholder="Search libraries, dependencies, or components..."
            aria-label="Search React UI libraries"
            class="h-10 w-full rounded-lg border border-geist-border bg-geist-surface pl-9 pr-14 text-sm text-geist-fg placeholder:text-geist-muted transition-colors hover:border-geist-border-strong focus:border-geist-fg/50"
            @input="onSearchInput"
          />
          <button
            v-if="searchQuery"
            type="button"
            aria-label="Clear search"
            class="absolute right-2.5 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded text-geist-muted transition-colors hover:bg-geist-subtle hover:text-geist-fg"
            @click="setSearchQuery('')"
          >
            <UIcon name="i-ph-x" class="size-3.5" />
          </button>
          <kbd
            v-else
            class="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-geist-border bg-geist-canvas px-1.5 py-0.5 font-mono text-[11px] text-geist-muted sm:inline-flex"
          >
            /
          </kbd>
        </div>
      </div>

      <!-- Sort Selector -->
      <div class="relative shrink-0">
        <label for="catalog-sort" class="sr-only">Sort libraries</label>
        <select
          id="catalog-sort"
          :value="sortBy"
          class="h-10 w-full cursor-pointer appearance-none rounded-lg border border-geist-border bg-geist-surface pl-3 pr-9 text-xs font-medium text-geist-fg transition-colors hover:border-geist-border-strong sm:w-44"
          @change="onSortChange"
        >
          <option
            v-for="option in SORT_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            Sort: {{ option.label }}
          </option>
        </select>
        <UIcon
          name="i-ph-caret-up-down"
          class="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-geist-muted"
        />
      </div>
    </div>

    <!-- Result Count & Active Filter Chips -->
    <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
      <p class="font-mono tabular-nums text-geist-secondary" role="status" aria-live="polite">
        Showing <span class="font-medium text-geist-fg">{{ displayedLibraries.length }}</span> of
        {{ libraries.length }} libraries
      </p>

      <div v-if="activeChips.length > 0" class="flex flex-wrap items-center gap-1.5">
        <button
          v-for="chip in activeChips"
          :key="chip.key"
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-geist-border bg-geist-surface px-2.5 py-1 text-[11px] font-medium text-geist-fg transition-colors hover:border-geist-border-strong hover:bg-geist-subtle"
          @click="chip.onRemove()"
        >
          <span>{{ chip.label }}</span>
          <UIcon name="i-ph-x" class="size-3 text-geist-muted" />
        </button>

        <button
          type="button"
          class="px-1.5 py-1 text-[11px] font-medium text-geist-secondary transition-colors hover:text-geist-fg"
          @click="clearFiltering()"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Card Grid -->
    <div
      v-if="displayedLibraries.length > 0"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <LibraryCard
        v-for="library in displayedLibraries"
        :key="library.name"
        :library="library"
        :activeFilterIds="activeButtonFilterIds"
        :starsPending="starsStatus === 'pending'"
        :downloadsPending="downloadsStatus === 'pending'"
        @select="openLibraryDetail"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-geist-border-strong bg-geist-surface px-6 py-16 text-center"
    >
      <div
        class="flex size-10 items-center justify-center rounded-full border border-geist-border bg-geist-canvas text-geist-muted"
      >
        <UIcon name="i-ph-magnifying-glass" class="size-4" />
      </div>
      <h3 class="mt-4 text-sm font-semibold text-geist-fg">No matching libraries</h3>
      <p class="mt-1 max-w-sm text-xs leading-relaxed text-geist-secondary">
        Try removing a few capability filters, lowering popularity thresholds, or searching with a
        broader keyword.
      </p>
      <button
        type="button"
        class="mt-5 inline-flex h-8 items-center gap-1.5 rounded-lg bg-geist-accent px-3.5 text-xs font-medium text-geist-accent-fg transition-opacity hover:opacity-90"
        @click="clearFiltering()"
      >
        Reset all filters
      </button>
    </div>

    <!-- Shared Library Detail Slideover -->
    <USlideover
      v-model="isDetailOpen"
      side="right"
      :ui="{ width: 'w-screen max-w-full sm:max-w-xl md:max-w-2xl' }"
    >
      <SlideoverContent v-if="selectedLibrary">
        <LibraryCardComponentPanel
          :library="selectedLibrary"
          @close="isDetailOpen = false"
        />
      </SlideoverContent>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import { libraries } from "@/data/libraries"
import { buttonFilters } from "@/data/filters"
import { sections } from "@/data/sections"
import type { Library } from "@/types/libraries.types"
import type { ButtonFilterID } from "@/types/filters.types"
import { SORT_OPTIONS, type SortOption } from "@/utils/catalog"

const emit = defineEmits<{
  openMobileFilters: []
}>()

const {
  rangeFiltering,
  searchQuery,
  sortBy,
  setSearchQuery,
  setSortBy,
  touchedButtonFilterIDs,
  removeButtonFilter,
  resetRangeFilter,
  nbTouchedFilters,
  clearFiltering,
} = useFilterStore()

const { data: stars, status: starsStatus } = useLibraryStars()
const { data: downloads, status: downloadsStatus } = useLibraryDownloads()

const searchInputRef = ref<HTMLInputElement | null>(null)
const selectedLibraryName = ref<string | null>(null)
const isDetailOpen = ref(false)

const componentAliases = new Map<string, readonly string[]>(
  sections.flatMap((section) =>
    section.components
      .filter((c) => Boolean(c.aliases?.length))
      .map((c) => [c.name, c.aliases!] as const)
  )
)

const filterLabels = new Map<ButtonFilterID, string>(
  buttonFilters.map((f) => [f.id, f.label])
)

const enrichedLibraries = computed<Library[]>(() =>
  libraries.map((library) => ({
    ...library,
    nbStars: getValidMetric(stars.value?.[`${library.repoOwner}/${library.repoName}`]),
    nbDownloads: library.package
      ? getValidMetric(downloads.value?.[library.package])
      : undefined,
  }))
)

const activeButtonFilterIds = computed(() => touchedButtonFilterIDs())

const displayedLibraries = computed<Library[]>(() => {
  const minimums = {
    stars: rangeFiltering.value.FNbStars.qty,
    weeklyDownloads: rangeFiltering.value.FNbDownloads.qty * 1000,
    components: rangeFiltering.value.FNbComponents.qty,
  }

  const filtered = enrichedLibraries.value.filter(
    (library) =>
      matchesLibraryFilters(library, activeButtonFilterIds.value, minimums) &&
      matchesLibrarySearch(library, searchQuery.value, {
        componentAliases,
        filterLabels,
      })
  )

  return sortLibraries(filtered, sortBy.value)
})

const selectedLibrary = computed(() =>
  selectedLibraryName.value
    ? enrichedLibraries.value.find((lib) => lib.name === selectedLibraryName.value) ?? null
    : null
)

const openLibraryDetail = (library: Library) => {
  selectedLibraryName.value = library.name
  isDetailOpen.value = true
}

const activeChips = computed(() => {
  const chips: Array<{ key: string; label: string; onRemove: () => void }> = []

  if (searchQuery.value.trim()) {
    chips.push({
      key: "search",
      label: `"${searchQuery.value.trim()}"`,
      onRemove: () => setSearchQuery(""),
    })
  }

  for (const id of activeButtonFilterIds.value) {
    const label = filterLabels.get(id) ?? id
    chips.push({
      key: id,
      label,
      onRemove: () => removeButtonFilter(id),
    })
  }

  if (rangeFiltering.value.FNbComponents.qty > 0) {
    chips.push({
      key: "FNbComponents",
      label: `Components ≥ ${rangeFiltering.value.FNbComponents.qty}`,
      onRemove: () => resetRangeFilter("FNbComponents"),
    })
  }

  if (rangeFiltering.value.FNbStars.qty > 0) {
    chips.push({
      key: "FNbStars",
      label: `Stars ≥ ${getDisplayableNumber(rangeFiltering.value.FNbStars.qty)}`,
      onRemove: () => resetRangeFilter("FNbStars"),
    })
  }

  if (rangeFiltering.value.FNbDownloads.qty > 0) {
    chips.push({
      key: "FNbDownloads",
      label: `npm ≥ ${getDisplayableNumber(rangeFiltering.value.FNbDownloads.qty * 1000)}/wk`,
      onRemove: () => resetRangeFilter("FNbDownloads"),
    })
  }

  return chips
})

const onSearchInput = (event: Event) => {
  setSearchQuery((event.target as HTMLInputElement).value)
}

const onSortChange = (event: Event) => {
  setSortBy((event.target as HTMLSelectElement).value as SortOption)
}

// Focus search on `/` or `Cmd/Ctrl + K`
const handleGlobalKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null
  const isTyping =
    target?.tagName === "INPUT" ||
    target?.tagName === "TEXTAREA" ||
    target?.tagName === "SELECT" ||
    target?.isContentEditable

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault()
    searchInputRef.value?.focus()
    searchInputRef.value?.select()
    return
  }

  if (event.key === "/" && !isTyping && !isDetailOpen.value) {
    event.preventDefault()
    searchInputRef.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleGlobalKeydown)
})
</script>
