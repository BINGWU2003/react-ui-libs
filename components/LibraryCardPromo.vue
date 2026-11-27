<template>
  <a
    class="group/promo flex items-center justify-between gap-2 rounded-t-[11px] border-b border-geist-border bg-geist-subtle/80 px-4 py-1.5 text-xs font-medium text-geist-fg transition-colors hover:bg-geist-hover"
    :href="promo.url"
    target="_blank"
    rel="noopener noreferrer"
    @click.stop
  >
    <span class="flex min-w-0 items-center gap-1.5">
      <UIcon v-if="promo.icon" :name="promo.icon" class="size-3.5 shrink-0 text-geist-secondary" />
      <span class="truncate">{{ promo.text }}</span>
    </span>
    <UIcon
      name="i-ph-arrow-up-right"
      class="size-3.5 shrink-0 text-geist-muted transition-transform duration-150 group-hover/promo:-translate-y-0.5 group-hover/promo:translate-x-0.5 group-hover/promo:text-geist-fg"
    />
  </a>
</template>

<script setup lang="ts">
import type { Promo } from "@/types/libraries.types"

defineProps<{ promo: Promo }>()
</script>
