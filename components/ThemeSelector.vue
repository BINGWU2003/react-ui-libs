<template>
  <ClientOnly>
    <UButton
      v-if="!colorMode.unknown"
      square
      variant="ghost"
      :icon="icon"
      @click="toggleTheme"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === "dark")
const icon = toRef(() => (isDark.value ? "i-ph-moon" : "i-ph-sun"))

const toggleTheme = (): void => {
  colorMode.preference = isDark.value ? "light" : "dark"
}
</script>
