<template>
  <UTooltip :text="buttonFilter.help">
    <span
      class="inline-flex cursor-default items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-tight transition-colors"
      :class="
        highlighted
          ? 'border-geist-accent bg-geist-accent text-geist-accent-fg'
          : 'border-geist-border bg-geist-subtle/70 text-geist-secondary'
      "
    >
      <UIcon :name="buttonFilter.icon" class="size-3 shrink-0" />
      <span class="truncate">{{ buttonFilter.label }}</span>
    </span>
  </UTooltip>
</template>

<script setup lang="ts">
import type { ButtonFilter } from "@/types/filters.types"

defineProps<{
  buttonFilter: ButtonFilter
  highlighted?: boolean
}>()
</script>
