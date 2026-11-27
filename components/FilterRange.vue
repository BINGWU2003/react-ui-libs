<template>
  <div class="space-y-2 py-1">
    <div class="flex items-center justify-between gap-2">
      <UTooltip :text="rangeFilter.help" :content="{ side: 'right', sideOffset: 8 }">
        <span
          class="inline-flex cursor-default items-center gap-1.5 text-[13px] text-geist-secondary"
        >
          <UIcon :name="rangeFilter.icon" class="size-3.5 text-geist-muted" />
          <span>{{ shortTitle }}</span>
        </span>
      </UTooltip>

      <div class="flex items-center gap-1">
        <span
          class="font-mono text-xs tabular-nums"
          :class="currentValue > 0 ? 'font-medium text-geist-fg' : 'text-geist-muted'"
        >
          {{ formattedValue }}
        </span>
        <button
          v-if="currentValue > 0"
          type="button"
          :aria-label="`Reset ${shortTitle} filter`"
          class="inline-flex size-4 items-center justify-center rounded text-geist-muted transition-colors hover:bg-geist-subtle hover:text-geist-fg"
          @click="changeRangeFiltering(rangeFilterID, 0)"
        >
          <UIcon name="i-ph-x" class="size-3" />
        </button>
      </div>
    </div>

    <input
      type="range"
      :value="currentValue"
      :min="0"
      :max="rangeFilter.rangeMax"
      :step="rangeFilter.rangeStep"
      :disabled="starsDisabled"
      :aria-label="accessibleLabel"
      class="geist-range block h-4 w-full"
      :style="trackStyle"
      @input="onRangeInput"
    />

    <div class="flex flex-wrap gap-1">
      <button
        v-for="preset in presets"
        :key="preset.value"
        type="button"
        :disabled="starsDisabled"
        class="rounded-md border px-1.5 py-0.5 font-mono text-[11px] tabular-nums transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45"
        :class="
          currentValue === preset.value
            ? 'border-geist-accent bg-geist-accent text-geist-accent-fg'
            : 'border-geist-border bg-geist-surface text-geist-secondary hover:border-geist-border-strong hover:text-geist-fg'
        "
        @click="selectPreset(preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>

    <div v-if="starsMessage" class="text-[11px] leading-relaxed text-geist-muted" role="status">
      {{ starsMessage }}
      <button
        v-if="starsFailed || missingStars"
        type="button"
        class="ml-1 font-medium text-geist-fg underline underline-offset-2 hover:opacity-80"
        :disabled="stars?.status.value === 'pending'"
        @click="refreshStars()"
      >
        {{ stars?.status.value === "pending" ? "Retrying…" : "Retry" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { rangeFilters } from "@/data/filters"
import type { RangeFilter, RangeFilterID } from "@/types/filters.types"

const props = defineProps<{ rangeFilterID: RangeFilterID }>()
const rangeFilter = findBy<RangeFilter>("id", props.rangeFilterID, rangeFilters)!
const { rangeFiltering, changeRangeFiltering } = useFilterStore()

const metaByID: Record<
  RangeFilterID,
  {
    title: string
    presets: ReadonlyArray<{ label: string; value: number }>
  }
> = {
  FNbStars: {
    title: "GitHub Stars",
    presets: [
      { label: "Any", value: 0 },
      { label: "10k+", value: 10000 },
      { label: "30k+", value: 30000 },
      { label: "50k+", value: 50000 },
    ],
  },
  FNbDownloads: {
    title: "Weekly npm",
    presets: [
      { label: "Any", value: 0 },
      { label: "100k+", value: 100 },
      { label: "500k+", value: 500 },
      { label: "1M+", value: 1000 },
    ],
  },
  FNbComponents: {
    title: "Components",
    presets: [
      { label: "Any", value: 0 },
      { label: "20+", value: 20 },
      { label: "40+", value: 40 },
      { label: "50+", value: 50 },
    ],
  },
}

const shortTitle = metaByID[props.rangeFilterID].title
const presets = metaByID[props.rangeFilterID].presets

const currentValue = computed(() => rangeFiltering.value[rangeFilter.id].qty)

const formattedValue = computed(() => {
  const qty = currentValue.value
  if (qty <= 0) return "Any"
  if (props.rangeFilterID === "FNbDownloads") {
    return `≥ ${getDisplayableNumber(qty * 1000)}/wk`
  }
  if (props.rangeFilterID === "FNbStars") {
    return `≥ ${getDisplayableNumber(qty)}`
  }
  return `≥ ${qty}`
})

const accessibleLabel = computed(() => {
  const quantity = currentValue.value
  return props.rangeFilterID === "FNbDownloads"
    ? `At least ${quantity * 1000} npm downloads per week`
    : `${rangeFilter.leadingLabel} ${quantity} ${rangeFilter.trailingLabel}`
})

const trackStyle = computed(() => {
  const pct = Math.min(100, Math.max(0, (currentValue.value / rangeFilter.rangeMax) * 100))
  return {
    background: `linear-gradient(to right, var(--ds-fg-primary) 0%, var(--ds-fg-primary) ${pct}%, transparent ${pct}%)`,
    backgroundSize: "100% 3px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }
})

const onRangeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  changeRangeFiltering(props.rangeFilterID, Number(target.value))
}

const selectPreset = (value: number) => {
  const next = currentValue.value === value && value !== 0 ? 0 : value
  changeRangeFiltering(props.rangeFilterID, next)
}

const stars = props.rangeFilterID === "FNbStars" ? useLibraryStars() : undefined
const missingStars = computed(
  () => Object.values(stars?.data.value ?? {}).filter((value) => value === null).length
)
const starsFailed = computed(() => stars?.status.value === "error")
const starsDisabled = computed(() => !!stars && (!stars.data.value || starsFailed.value))
const starsMessage = computed(() => {
  if (!stars) return ""
  if (starsFailed.value) return "GitHub stars unavailable."
  if (!stars.data.value) return "Loading GitHub stars…"
  if (missingStars.value) {
    return `${missingStars.value} repo(s) without stars excluded when active.`
  }
  return ""
})
const refreshStars = () => stars?.refresh()
</script>
