<template>
  <div id="top" class="flex min-h-screen flex-col bg-geist-canvas text-geist-fg">
    <Header />

    <!-- Compact Left-Aligned Vercel Hero -->
    <section class="relative overflow-hidden border-b border-geist-border bg-geist-surface/60">
      <div class="geist-hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div
          class="inline-flex items-center gap-2 rounded-full border border-geist-border bg-geist-surface px-3 py-1 font-mono text-[11px] text-geist-secondary"
        >
          <span class="size-1.5 rounded-full bg-geist-accent" aria-hidden="true" />
          <span>{{ libraries.length }} libraries</span>
          <span class="text-geist-border-strong">·</span>
          <span>{{ totalCatalogComponents }} tracked components</span>
        </div>

        <h1
          class="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-geist-fg sm:text-4xl lg:text-[42px] lg:leading-[1.12]"
        >
          Find the right UI library for React.
        </h1>

        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-geist-secondary sm:text-base">
          Compare styling architecture, accessibility, component coverage, GitHub stars, and
          weekly npm downloads for your
          <NuxtLink
            to="https://react.dev/"
            target="_blank"
            class="font-medium text-geist-fg underline decoration-geist-border-strong underline-offset-4 transition-colors hover:decoration-geist-fg"
          >
            React
          </NuxtLink>
          or
          <NuxtLink
            to="https://nextjs.org/"
            target="_blank"
            class="font-medium text-geist-fg underline decoration-geist-border-strong underline-offset-4 transition-colors hover:decoration-geist-fg"
          >
            Next.js
          </NuxtLink>
          project.
        </p>
      </div>
    </section>

    <!-- Main Filter Sidebar + Cards Grid -->
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex items-start gap-8">
        <div
          class="geist-scrollbar sticky top-24 z-20 hidden max-h-[calc(100vh-7rem)] w-64 shrink-0 overflow-y-auto pr-3 lg:block"
        >
          <Filters />
        </div>

        <LibraryCards @open-mobile-filters="isMobileFiltersOpen = true" />
      </div>
    </main>

    <!-- Mobile Filter Drawer -->
    <USlideover
      v-model:open="isMobileFiltersOpen"
      side="left"
      title="Filters"
      description="Filter React UI libraries by architecture, capabilities, components, and popularity"
      :ui="{ content: 'w-screen max-w-xs' }"
    >
      <template #content>
        <SlideoverContent>
          <div
            class="flex items-center justify-between border-b border-geist-border px-5 py-4"
          >
            <span class="text-sm font-semibold tracking-tight text-geist-fg">Filters</span>
            <button
              type="button"
              aria-label="Close filters"
              class="inline-flex size-7 items-center justify-center rounded-md border border-geist-border bg-geist-canvas text-geist-secondary hover:text-geist-fg"
              @click="isMobileFiltersOpen = false"
            >
              <UIcon name="i-ph-x" class="size-4" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto px-5 py-4">
            <Filters />
          </div>
        </SlideoverContent>
      </template>
    </USlideover>

    <!-- Minimal Vercel Footer -->
    <footer class="mt-12 border-t border-geist-border bg-geist-surface/40">
      <div
        class="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-geist-muted sm:flex-row sm:items-center sm:px-6 lg:px-8"
      >
        <div class="flex items-center gap-2">
          <BrandLogo class="size-4 text-geist-fg" />
          <span class="font-medium text-geist-secondary">react-ui-libs</span>
          <span>·</span>
          <span>Curated React UI library comparison directory.</span>
        </div>
        <a
          :href="repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-geist-secondary transition-colors hover:text-geist-fg"
        >
          <UIcon name="i-mdi-github" class="size-3.5" />
          <span>Contribute on GitHub</span>
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { libraries } from "@/data/libraries"
import { buttonFilters } from "@/data/filters"

const title = "react-ui-libs"
const description =
  "Compare popular React UI libraries by styling, accessibility, components, and more. Pick the right UI library for your React or Next.js project."
const siteUrl = getSiteUrl(useRuntimeConfig().public.siteUrl)
const { repoUrl } = useAppConfig()
const totalCatalogComponents = useNbComponentsStore()
const isMobileFiltersOpen = ref(false)

const route = useRoute()
const router = useRouter()
const { applyQueryState, getQueryState } = useFilterStore()

// Hydrate initial filter state from URL query parameters
applyQueryState(parseFilterQuery(route.query, buttonFilters))

// Keep URL query in sync without polluting browser history
const serializedQuery = computed(() => serializeFilterQuery(getQueryState()))

watch(serializedQuery, (nextQuery) => {
  if (!import.meta.client) return
  const currentKeys = Object.keys(route.query).sort()
  const nextKeys = Object.keys(nextQuery).sort()
  const same =
    currentKeys.length === nextKeys.length &&
    currentKeys.every((key, i) => key === nextKeys[i] && route.query[key] === nextQuery[key])

  if (!same) {
    router.replace({ query: nextQuery })
  }
})

useHead({
  title,
  htmlAttrs: { lang: "en" },
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon/logo.svg",
    },
    ...(siteUrl ? [{ rel: "canonical" as const, href: `${siteUrl}/` }] : []),
  ],
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: "website",
  ogSiteName: title,
  twitterTitle: title,
  twitterDescription: description,
  ...(siteUrl
    ? {
        ogUrl: `${siteUrl}/`,
        ogImage: `${siteUrl}/img/social.png`,
        ogImageWidth: 1200,
        ogImageHeight: 630,
        ogImageAlt: "react-ui-libs — Pick the right UI library for your React project",
        twitterCard: "summary_large_image" as const,
        twitterImage: `${siteUrl}/img/social.png`,
      }
    : {}),
})
</script>
