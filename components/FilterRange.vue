<template>
  <div class="w-56">
    <UTooltip :text="rangeFilter.help">
      <div class="primary-text flex h-10 w-56 items-center rounded-md">
        <UIcon :name="rangeFilter.icon" class="ml-2 h-5 w-5 shrink-0" />
        <div class="mx-2 min-w-0 flex-1">
          <div class="whitespace-nowrap text-sm font-medium">
            {{ rangeFilter.leadingLabel }}
            {{ displayQuantity }}
            {{ rangeFilter.trailingLabel }}
          </div>
          <div class="flex h-4 items-center">
            <URange
              @change="
                changeRangeFiltering(rangeFilterID, rangeFiltering[rangeFilter.id].qty)
              "
              v-model="rangeFiltering[rangeFilter.id].qty"
              :min="0"
              :max="rangeFilter.rangeMax"
              :step="rangeFilter.rangeStep"
              :disabled="starsDisabled"
              :aria-label="accessibleLabel"
              size="sm"
            />
          </div>
        </div>
      </div>
    </UTooltip>
    <div v-if="starsMessage" class="primary-text-muted px-2 text-xs" role="status">
      {{ starsMessage }}
      <UButton
        v-if="starsFailed || missingStars"
        label="Retry"
        color="gray"
        variant="link"
        size="xs"
        :padded="false"
        :loading="stars?.status.value === 'pending'"
        @click="refreshStars()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { rangeFilters } from "@/data/filters"
import type { RangeFilter, RangeFilterID } from "@/types/filters.types"

const props = defineProps<{ rangeFilterID: RangeFilterID }>()
const rangeFilter = findBy<RangeFilter>("id", props.rangeFilterID, rangeFilters)!
const { rangeFiltering, changeRangeFiltering } = useFilterStore()

const downloadsFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 3,
})
const displayQuantity = computed(() => {
  const quantity = rangeFiltering.value[rangeFilter.id].qty
  return props.rangeFilterID === "FNbDownloads"
    ? downloadsFormatter.format(quantity * 1000)
    : quantity
})
const accessibleLabel = computed(() => {
  const quantity = rangeFiltering.value[rangeFilter.id].qty
  return props.rangeFilterID === "FNbDownloads"
    ? `At least ${quantity * 1000} npm downloads per week`
    : `${rangeFilter.leadingLabel} ${quantity} ${rangeFilter.trailingLabel}`
})

const stars = props.rangeFilterID === "FNbStars" ? useLibraryStars() : undefined
const missingStars = computed(
  () => Object.values(stars?.data.value ?? {}).filter((value) => value === null).length
)
const starsFailed = computed(() => stars?.status.value === "error")
const starsDisabled = computed(() => !!stars && (!stars.data.value || starsFailed.value))
const starsMessage = computed(() => {
  if (!stars) return ""
  if (starsFailed.value) return "GitHub stars unavailable. Please retry."
  if (!stars.data.value) return "Loading GitHub stars…"
  if (missingStars.value) {
    return `${missingStars.value} repositories have unavailable stars and are excluded when filtering.`
  }
  return ""
})
const refreshStars = () => stars?.refresh()
</script>
