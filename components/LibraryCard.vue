<template>
  <article
    role="button"
    tabindex="0"
    :aria-label="`Inspect ${library.name} details and ${nbComponents} components`"
    class="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-geist-border bg-geist-surface shadow-geist-card transition-all duration-150 hover:z-10 hover:-translate-y-0.5 hover:border-geist-border-strong hover:shadow-geist-card-hover focus-within:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-geist-ring focus-visible:ring-offset-2 focus-visible:ring-offset-geist-canvas"
    @click="emit('select', library)"
    @keydown.enter.self="emit('select', library)"
    @keydown.space.self.prevent="emit('select', library)"
  >
    <LibraryCardPromo v-if="library.promo" :promo="library.promo" />

    <div class="flex flex-1 flex-col p-5">
      <!-- Top Row: Logo + Title + External Link -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3.5">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-geist-border bg-geist-canvas p-2 transition-colors group-hover:border-geist-border-strong"
          >
            <LibraryLogo :library="library" class="h-full w-full" />
          </div>

          <div class="min-w-0">
            <h3
              class="truncate text-[15px] font-semibold tracking-tight text-geist-fg"
            >
              {{ library.name }}
            </h3>
            <p
              v-if="library.onTopOf"
              class="mt-0.5 flex items-center gap-1 truncate text-xs text-geist-secondary"
            >
              <UIcon name="i-ph-stack-simple" class="size-3.5 shrink-0 text-geist-muted" />
              <span class="truncate">Built on {{ library.onTopOf }}</span>
            </p>
            <p
              v-else-if="library.package"
              class="mt-0.5 truncate font-mono text-[11px] text-geist-muted"
            >
              {{ library.package }}
            </p>
          </div>
        </div>

        <UTooltip :text="`Visit ${library.name} website`">
          <a
            :href="library.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Visit ${library.name} website`"
            class="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-transparent text-geist-muted transition-colors hover:border-geist-border hover:bg-geist-subtle hover:text-geist-fg"
            @click.stop
          >
            <UIcon name="i-ph-arrow-up-right" class="size-4" />
          </a>
        </UTooltip>
      </div>

      <!-- Curated Core Badges -->
      <div class="mt-4 flex flex-wrap items-center gap-1.5">
        <LibraryCardBadge
          v-for="badge in badgeSelection.visible"
          :key="badge.id"
          :buttonFilter="badge"
          :highlighted="badgeSelection.activeSet.has(badge.id)"
        />
        <span
          v-if="badgeSelection.hiddenCount > 0"
          class="inline-flex items-center rounded-md border border-dashed border-geist-border px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-geist-muted"
        >
          +{{ badgeSelection.hiddenCount }}
        </span>
      </div>
    </div>

    <!-- Bottom Metadata Bar -->
    <div
      class="flex items-center justify-between gap-2 rounded-b-xl border-t border-geist-border bg-geist-canvas/50 px-5 py-3"
    >
      <div class="flex min-w-0 items-center gap-3">
        <UTooltip
          v-if="repoUrl && library.nbStars !== undefined"
          :text="`Repository stars: ${library.repoOwner}/${library.repoName}. Monorepo totals may include other packages.`"
        >
          <a
            :href="repoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-mono text-xs tabular-nums text-geist-secondary transition-colors hover:text-geist-fg"
            @click.stop
          >
            <UIcon name="i-ph-star" class="size-3.5 text-geist-muted" />
            <span>{{ getDisplayableNumber(library.nbStars) }}</span>
          </a>
        </UTooltip>
        <span
          v-else-if="repoUrl && starsPending"
          class="inline-block h-3.5 w-11 animate-pulse rounded bg-geist-subtle"
          aria-hidden="true"
        />

        <UTooltip
          v-if="registryUrl && library.nbDownloads !== undefined"
          :text="`Weekly npm downloads: ${library.package}. ${library.packageNote || 'Other packages are not included.'}`"
        >
          <a
            :href="registryUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-mono text-xs tabular-nums text-geist-secondary transition-colors hover:text-geist-fg"
            @click.stop
          >
            <UIcon name="i-ph-download-simple" class="size-3.5 text-geist-muted" />
            <span>{{ getDisplayableNumber(library.nbDownloads) }}/wk</span>
          </a>
        </UTooltip>
        <span
          v-else-if="registryUrl && downloadsPending"
          class="inline-block h-3.5 w-14 animate-pulse rounded bg-geist-subtle"
          aria-hidden="true"
        />
      </div>

      <span
        class="inline-flex shrink-0 items-center gap-1 font-mono text-xs tabular-nums text-geist-secondary transition-colors group-hover:text-geist-fg"
      >
        <span>{{ nbComponents }} comps</span>
        <UIcon
          name="i-ph-arrow-right"
          class="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { buttonFilters } from "@/data/filters"
import type { Library } from "@/types/libraries.types"
import type { ButtonFilterID } from "@/types/filters.types"

const props = defineProps<{
  library: Library
  activeFilterIds: ButtonFilterID[]
  starsPending?: boolean
  downloadsPending?: boolean
}>()

const emit = defineEmits<{
  select: [library: Library]
}>()

const nbComponents = computed(() => props.library.componentMatchings.length)

const badgeSelection = computed(() =>
  selectCardBadges(props.library, buttonFilters, props.activeFilterIds, 4)
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
</script>
