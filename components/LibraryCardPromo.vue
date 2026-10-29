<template>
  <div>
    <a
      class="bg-primary-500 dark:bg-primary-400 flex h-7 items-center justify-between rounded-t-md px-2 text-sm font-bold text-white dark:text-black"
      :href="promo.url"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div></div>
      <div class="flex items-center justify-center gap-x-1.5">
        <UIcon class="text-lg" v-if="promo.icon" :name="promo.icon"></UIcon>
        <div>{{ promo.text }}</div>
      </div>
      <UIcon class="text-lg" name="ph:arrow-right-bold"></UIcon>
    </a>
  </div>
</template>

<script setup lang="ts">
import type { Promo } from "@/types/libraries.types"

defineProps<{ promo: Promo }>()
</script>
