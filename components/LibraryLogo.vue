<template>
  <span class="block">
    <!-- Keep both variants in SSR markup so the theme is correct before hydration. -->
    <img
      :src="`/img/${library.logo}`"
      :alt="`${library.name} logo`"
      class="h-full w-full object-contain drop-shadow-lg"
      :class="{ 'dark:hidden': library.logoDark }"
    />
    <img
      v-if="library.logoDark"
      :src="`/img/${library.logoDark}`"
      :alt="`${library.name} logo`"
      class="hidden h-full w-full object-contain drop-shadow-lg dark:block"
    />
  </span>
</template>

<script setup lang="ts">
import type { Library } from "@/types/libraries.types"

defineProps<{ library: Pick<Library, "name" | "logo" | "logoDark"> }>()
</script>
