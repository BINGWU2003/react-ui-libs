<template>
  <ClientOnly>
    <div
      class="inline-flex items-center rounded-full border border-geist-border bg-geist-surface p-0.5"
      role="radiogroup"
      aria-label="Color theme"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="radio"
        :aria-checked="colorMode.preference === option.value"
        :aria-label="option.label"
        :title="option.label"
        class="inline-flex size-6 items-center justify-center rounded-full transition-colors duration-150"
        :class="
          colorMode.preference === option.value
            ? 'bg-geist-subtle text-geist-fg ring-1 ring-inset ring-geist-border'
            : 'text-geist-muted hover:text-geist-fg'
        "
        @click="colorMode.preference = option.value"
      >
        <UIcon :name="option.icon" class="size-3.5" />
      </button>
    </div>
    <template #fallback>
      <div
        class="h-7 w-[78px] rounded-full border border-geist-border bg-geist-surface"
        aria-hidden="true"
      />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const options = [
  { value: "light", label: "Light theme", icon: "i-ph-sun" },
  { value: "system", label: "System theme", icon: "i-ph-monitor" },
  { value: "dark", label: "Dark theme", icon: "i-ph-moon" },
] as const
</script>
