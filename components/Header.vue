<template>
  <header
    class="sticky top-0 z-30 h-16 border-b border-geist-border bg-geist-canvas/85 backdrop-blur-md"
  >
    <div
      class="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
    >
      <a
        href="#top"
        class="group inline-flex items-center gap-2.5 rounded-md text-geist-fg transition-opacity hover:opacity-90"
        @click.prevent="scrollToTop"
      >
        <BrandLogo class="size-6 shrink-0 text-geist-fg" />
        <span class="text-geist-border-strong select-none text-lg font-light">/</span>
        <span class="text-sm font-semibold tracking-tight sm:text-[15px]">
          react-ui-libs
        </span>
        <span
          class="hidden rounded-full border border-geist-border bg-geist-surface px-2 py-0.5 font-mono text-[11px] font-medium text-geist-secondary sm:inline-flex"
        >
          Catalog
        </span>
      </a>

      <div class="flex items-center gap-2 sm:gap-2.5">
        <a
          :href="appConfig.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View react-ui-libs on GitHub"
          class="inline-flex h-7 items-center gap-1.5 rounded-full border border-geist-border bg-geist-surface px-2.5 text-xs font-medium text-geist-secondary transition-colors hover:border-geist-border-strong hover:text-geist-fg"
        >
          <UIcon name="i-mdi-github" class="size-3.5 shrink-0" />
          <span class="hidden sm:inline">GitHub</span>
        </a>

        <ThemeSelector />

        <a
          :href="appConfig.myWebsiteUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View BINGWU2003 on GitHub"
          title="Author on GitHub"
          class="inline-flex size-7 items-center justify-center rounded-full border border-geist-border bg-geist-surface text-geist-secondary transition-colors hover:border-geist-border-strong hover:text-geist-fg"
        >
          <UIcon name="i-ph-user" class="size-3.5" />
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}
</script>
