<template>
  <div class="grid flex-grow grid-cols-1 content-start gap-6 lg:grid-cols-2">
    <LibraryCard
      v-for="library in librariesWithStars"
      :key="library.name"
      :initialLibrary="library"
    />
  </div>
</template>

<script setup lang="ts">
import { libraries } from "@/data/libraries"

const { data: stars } = useLibraryStars()
const librariesWithStars = computed(() =>
  libraries.map((library) => ({
    ...library,
    nbStars: getValidMetric(stars.value?.[`${library.repoOwner}/${library.repoName}`]),
  }))
)
</script>
