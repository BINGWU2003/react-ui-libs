<template>
  <aside aria-label="Library filters" class="space-y-1">
    <div class="flex items-center justify-between pb-3">
      <div class="flex items-center gap-2">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-geist-muted">
          Filter Libraries
        </h2>
        <span
          v-if="nbTouchedFilters() > 0"
          class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-geist-accent px-1 font-mono text-[10px] font-medium tabular-nums text-geist-accent-fg"
        >
          {{ nbTouchedFilters() }}
        </span>
      </div>
      <button
        v-if="nbTouchedFilters() > 0"
        type="button"
        class="text-xs font-medium text-geist-secondary transition-colors hover:text-geist-fg"
        @click="clearFiltering()"
      >
        Reset
      </button>
    </div>

    <div
      v-for="section in filterSections"
      :key="section.key"
      class="border-t border-geist-border py-3"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between py-0.5 text-left text-[13px] font-medium text-geist-fg transition-colors hover:text-geist-fg/80"
        :aria-expanded="openSections[section.key]"
        @click="openSections[section.key] = !openSections[section.key]"
      >
        <span>{{ section.label }}</span>
        <UIcon
          name="i-ph-caret-down"
          class="size-3.5 text-geist-muted transition-transform duration-150"
          :class="{ '-rotate-90': !openSections[section.key] }"
        />
      </button>

      <div v-show="openSections[section.key]" class="mt-2.5">
        <template v-if="section.key === 'architecture'">
          <div class="space-y-2.5">
            <div class="space-y-0.5">
              <div class="px-2 pb-0.5 font-mono text-[10px] uppercase tracking-wider text-geist-muted">
                Styling
              </div>
              <FilterButton buttonFilterID="FStyled" />
              <FilterButton buttonFilterID="FUnstyled" />
            </div>

            <div class="space-y-0.5">
              <div class="px-2 pb-0.5 font-mono text-[10px] uppercase tracking-wider text-geist-muted">
                Distribution
              </div>
              <FilterButton buttonFilterID="FImported" />
              <FilterButton buttonFilterID="FPasted" />
            </div>

            <div class="space-y-0.5 border-t border-geist-border/70 pt-2">
              <FilterButton buttonFilterID="FTailwind" />
              <FilterButton buttonFilterID="FFree" />
            </div>
          </div>
        </template>

        <template v-else-if="section.key === 'capabilities'">
          <div class="space-y-0.5">
            <FilterButton buttonFilterID="FAccessible" />
            <FilterButton buttonFilterID="FDarkMode" />
            <FilterButton buttonFilterID="FTyped" />
            <FilterButton buttonFilterID="FBuiltinThemes" />
            <FilterButton buttonFilterID="FThemeGenerator" />
            <FilterButton buttonFilterID="FSemanticColors" />
            <FilterButton buttonFilterID="FForm" />
            <FilterButton buttonFilterID="FFigma" />
            <FilterButton buttonFilterID="FRTLSupport" />
            <FilterButton buttonFilterID="FRoadmap" />
          </div>
        </template>

        <template v-else-if="section.key === 'components'">
          <FilterRange rangeFilterID="FNbComponents" />
        </template>

        <template v-else-if="section.key === 'popularity'">
          <div class="space-y-3">
            <FilterRange rangeFilterID="FNbStars" />
            <FilterRange rangeFilterID="FNbDownloads" />
          </div>
        </template>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const filterSections = [
  { key: "architecture", label: "Core Architecture" },
  { key: "capabilities", label: "Capabilities" },
  { key: "components", label: "Component Coverage" },
  { key: "popularity", label: "Popularity" },
] as const

const openSections = reactive<Record<(typeof filterSections)[number]["key"], boolean>>({
  architecture: true,
  capabilities: true,
  components: true,
  popularity: true,
})

const { nbTouchedFilters, clearFiltering } = useFilterStore()
</script>
