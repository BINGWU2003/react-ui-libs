<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- Sticky Drawer Header -->
    <div class="shrink-0 border-b border-geist-border bg-geist-surface px-5 py-4 sm:px-6">
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3.5">
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-geist-border bg-geist-canvas p-2"
          >
            <LibraryLogo :library="library" class="h-full w-full" />
          </div>
          <div class="min-w-0">
            <h2 class="truncate text-lg font-semibold tracking-tight text-geist-fg sm:text-xl">
              {{ library.name }}
            </h2>
            <p
              v-if="library.onTopOf"
              class="mt-0.5 flex items-center gap-1 text-xs text-geist-secondary"
            >
              <UIcon name="i-ph-stack-simple" class="size-3.5 text-geist-muted" />
              <span>Built on {{ library.onTopOf }}</span>
            </p>
            <p v-else-if="library.package" class="mt-0.5 font-mono text-xs text-geist-muted">
              {{ library.package }}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close library details"
          class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-geist-border bg-geist-canvas text-geist-secondary transition-colors hover:border-geist-border-strong hover:text-geist-fg"
          @click="emit('close')"
        >
          <UIcon name="i-ph-x" class="size-4" />
        </button>
      </div>

      <!-- Quick Action Buttons -->
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <a
          :href="library.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg bg-geist-accent px-3 text-xs font-medium text-geist-accent-fg transition-opacity hover:opacity-90"
        >
          <span>Visit Website</span>
          <UIcon name="i-ph-arrow-up-right" class="size-3.5" />
        </a>

        <a
          v-if="repoUrl"
          :href="repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-geist-border bg-geist-canvas px-2.5 text-xs font-medium text-geist-fg transition-colors hover:border-geist-border-strong hover:bg-geist-subtle"
        >
          <UIcon name="i-mdi-github" class="size-3.5 text-geist-secondary" />
          <span>GitHub</span>
          <span
            v-if="library.nbStars !== undefined"
            class="border-l border-geist-border pl-1.5 font-mono tabular-nums text-geist-secondary"
          >
            {{ getDisplayableNumber(library.nbStars) }}
          </span>
        </a>

        <a
          v-if="registryUrl"
          :href="registryUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-geist-border bg-geist-canvas px-2.5 text-xs font-medium text-geist-fg transition-colors hover:border-geist-border-strong hover:bg-geist-subtle"
        >
          <UIcon name="i-ph-package" class="size-3.5 text-geist-secondary" />
          <span>npm</span>
          <span
            v-if="library.nbDownloads !== undefined"
            class="border-l border-geist-border pl-1.5 font-mono tabular-nums text-geist-secondary"
          >
            {{ getDisplayableNumber(library.nbDownloads) }}/wk
          </span>
        </a>

        <button
          v-if="library.package"
          type="button"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-geist-border bg-geist-canvas px-2.5 font-mono text-xs text-geist-secondary transition-colors hover:border-geist-border-strong hover:text-geist-fg"
          :aria-label="`Copy package name ${library.package}`"
          @click="copyPackage"
        >
          <UIcon
            :name="copied ? 'i-ph-check' : 'i-ph-copy'"
            class="size-3.5"
            :class="copied ? 'text-geist-fg' : 'text-geist-muted'"
          />
          <span>{{ copied ? "Copied" : library.package }}</span>
        </button>
      </div>

      <p v-if="library.packageNote" class="mt-2 text-[11px] text-geist-muted">
        {{ library.packageNote }}
      </p>
    </div>

    <!-- Scrollable Drawer Body -->
    <div class="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
      <!-- Capabilities / Features Overview -->
      <section class="pb-6">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-geist-muted">
            Capabilities
          </h3>
          <span class="font-mono text-xs tabular-nums text-geist-muted">
            {{ matchedFilters.length }} matched
          </span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <LibraryCardBadge
            v-for="filter in matchedFilters"
            :key="filter.id"
            :buttonFilter="filter"
          />
        </div>
      </section>

      <!-- Component Coverage Section -->
      <section class="border-t border-geist-border pt-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-geist-muted">
            Component Coverage
          </h3>
          <div class="flex items-center gap-2 font-mono text-xs tabular-nums">
            <span class="font-medium text-geist-fg">
              {{ library.componentMatchings.length }} / {{ totalCatalogComponents }}
            </span>
            <span class="text-geist-muted">({{ coveragePercent }}%)</span>
          </div>
        </div>

        <!-- Coverage Bar -->
        <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-geist-subtle">
          <div
            class="h-full rounded-full bg-geist-accent transition-all duration-300"
            :style="{ width: `${coveragePercent}%` }"
          />
        </div>

        <!-- Component Search & Show Missing Toggle -->
        <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="relative flex-1">
            <UIcon
              name="i-ph-magnifying-glass"
              class="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-geist-muted"
            />
            <input
              v-model="componentQuery"
              type="search"
              placeholder="Filter components or aliases..."
              aria-label="Filter components in this library"
              class="h-8 w-full rounded-lg border border-geist-border bg-geist-canvas pl-8 pr-7 text-xs text-geist-fg placeholder:text-geist-muted focus:border-geist-border-strong"
            />
            <button
              v-if="componentQuery"
              type="button"
              aria-label="Clear component search"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-geist-muted hover:text-geist-fg"
              @click="componentQuery = ''"
            >
              <UIcon name="i-ph-x" class="size-3.5" />
            </button>
          </div>

          <div class="inline-flex shrink-0 items-center select-none">
            <USwitch
              v-model="showMissing"
              size="xs"
              checked-icon="i-heroicons-check-20-solid"
              unchecked-icon="i-heroicons-x-mark-20-solid"
              label="Show missing"
              :ui="{ label: 'text-xs font-normal text-geist-secondary cursor-pointer' }"
            />
          </div>
        </div>

        <!-- Component Matrix -->
        <div v-if="visibleSections.length > 0" class="mt-5 space-y-5">
          <div v-for="section in visibleSections" :key="section.name">
            <div class="mb-2.5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon :name="section.icon" class="size-4 text-geist-muted" />
                <h4 class="text-xs font-semibold text-geist-fg">{{ section.name }}</h4>
              </div>
              <span class="font-mono text-[11px] tabular-nums text-geist-muted">
                {{ section.foundCount }}/{{ section.totalCount }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              <UTooltip
                v-for="component in section.components"
                :key="component.name"
                :content="{ side: 'top', sideOffset: 6 }"
              >
                <template #content>
                  <div class="space-y-1">
                    <div>{{ component.help }}</div>
                    <div v-if="component.aliases" class="opacity-80">
                      Aliases: {{ component.aliases.join(", ") }}
                    </div>
                  </div>
                </template>
                <div
                  class="flex min-w-0 cursor-default items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition-colors"
                  :class="
                    isFound(component)
                      ? 'border-geist-border bg-geist-canvas text-geist-fg'
                      : 'border-transparent bg-geist-subtle/40 text-geist-muted'
                  "
                >
                  <UIcon
                    :name="
                      isFound(component)
                        ? 'i-heroicons-check-circle-20-solid'
                        : 'i-ph-minus-circle'
                    "
                    class="size-3.5 shrink-0"
                    :class="isFound(component) ? 'text-geist-fg' : 'text-geist-muted/60'"
                  />
                  <span class="truncate">{{ component.name }}</span>
                </div>
              </UTooltip>
            </div>
          </div>
        </div>

        <div
          v-else
          class="mt-6 rounded-lg border border-dashed border-geist-border px-4 py-8 text-center text-xs text-geist-muted"
        >
          No components match "{{ componentQuery }}".
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buttonFilters } from "@/data/filters"
import { sections } from "@/data/sections"
import type { Library } from "@/types/libraries.types"
import type { CatalogComponent } from "@/types/components.types"
import type { ButtonFilter } from "@/types/filters.types"

const props = defineProps<{ library: Library }>()
const emit = defineEmits<{ close: [] }>()

const { showMissing } = useShowMissingStore()
const totalCatalogComponents = useNbComponentsStore()
const componentQuery = ref("")
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.library.name,
  () => {
    componentQuery.value = ""
    copied.value = false
  }
)

onBeforeUnmount(() => {
  if (copyTimer) clearTimeout(copyTimer)
})

const isFound = (component: CatalogComponent): boolean =>
  props.library.componentMatchings.includes(component.name)

const coveragePercent = computed(() =>
  Math.round((props.library.componentMatchings.length / totalCatalogComponents.value) * 100)
)

const matchedFilters = computed((): ButtonFilter[] =>
  props.library.filterMatchings
    .map(({ id }) => findBy<ButtonFilter>("id", id, buttonFilters))
    .filter((f): f is ButtonFilter => Boolean(f))
    .sort((a, b) => a.index - b.index)
)

const repoUrl = computed(() =>
  props.library.repoOwner && props.library.repoName
    ? `https://github.com/${props.library.repoOwner}/${props.library.repoName}`
    : undefined
)

const registryUrl = computed(() =>
  props.library.package
    ? `https://www.npmjs.com/package/${props.library.package}`
    : undefined
)

const visibleSections = computed(() => {
  const q = componentQuery.value.trim().toLowerCase()
  return sections
    .map((section) => {
      const foundCount = section.components.filter((c) => isFound(c)).length
      const filtered = section.components.filter((component) => {
        if (!showMissing.value && !isFound(component)) return false
        if (!q) return true
        if (component.name.toLowerCase().includes(q)) return true
        return Boolean(component.aliases?.some((a) => a.toLowerCase().includes(q)))
      })
      return {
        ...section,
        foundCount,
        totalCount: section.components.length,
        components: filtered,
      }
    })
    .filter((section) => section.components.length > 0)
})

const copyPackage = async () => {
  if (!props.library.package || !import.meta.client) return
  try {
    await navigator.clipboard.writeText(props.library.package)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch {
    copied.value = false
  }
}
</script>
