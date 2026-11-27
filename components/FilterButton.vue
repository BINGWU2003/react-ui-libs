<template>
  <UTooltip :text="buttonFilter.help" :popper="{ placement: 'right' }" class="block w-full">
    <button
      type="button"
      role="checkbox"
      :aria-checked="isSelected"
      class="group flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors duration-150"
      :class="
        isSelected
          ? 'bg-geist-subtle text-geist-fg'
          : 'text-geist-secondary hover:bg-geist-subtle/70 hover:text-geist-fg'
      "
      @click="invertButtonFiltering(buttonFilter.id)"
    >
      <span class="flex min-w-0 items-center gap-2.5">
        <span
          class="flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-150"
          :class="
            isSelected
              ? 'border-geist-accent bg-geist-accent text-geist-accent-fg'
              : 'border-geist-border-strong bg-geist-surface group-hover:border-geist-fg/50'
          "
        >
          <UIcon
            v-if="isSelected"
            name="i-heroicons-check-16-solid"
            class="size-3"
          />
        </span>
        <span class="truncate" :class="isSelected ? 'font-medium' : 'font-normal'">
          {{ buttonFilter.label }}
        </span>
      </span>
      <span
        class="shrink-0 font-mono text-[11px] tabular-nums transition-colors"
        :class="isSelected ? 'text-geist-fg' : 'text-geist-muted'"
      >
        {{ totalCount }}
      </span>
    </button>
  </UTooltip>
</template>

<script setup lang="ts">
import { buttonFilters } from "@/data/filters"
import { libraries } from "@/data/libraries"
import type { ButtonFilterID } from "@/types/filters.types"

const props = defineProps<{ buttonFilterID: ButtonFilterID }>()
const buttonFilter = findBy("id", props.buttonFilterID, buttonFilters)!
const { buttonFiltering, invertButtonFiltering } = useFilterStore()

const isSelected = computed(() => buttonFiltering.value[buttonFilter.id].selected)

const totalCount = libraries.filter((lib) =>
  lib.filterMatchings.some(({ id }) => id === props.buttonFilterID)
).length
</script>
