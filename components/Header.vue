<template>
  <div class="shadow-sm shadow-gray-200 backdrop-blur-md dark:shadow-gray-600">
    <div class="flex items-center justify-between px-4 py-2 md:px-8">
      <div class="hidden h-12 items-center gap-2 md:flex">
        <img class="size-8" src="/favicon/react.svg" alt="react-ui-libs" />
        <h1 class="text-xl font-bold">react-ui-libs</h1>
      </div>
      <div class="md:invisible">
        <UButton
          icon="i-material-symbols-format-list-bulleted"
          :square="true"
          variant="outline"
          aria-label="Open filters"
          @click="isMenuOpen = true"
        />
        <USlideover
          @dblclick.prevent=""
          v-model="isMenuOpen"
          side="left"
          :ui="{ width: 'max-w-xs' }"
          class="md:hidden"
        >
          <SlideoverContent>
            <Filters />
          </SlideoverContent>
        </USlideover>
      </div>
      <div class="flex items-center justify-end gap-1 md:gap-2">
        <UButton
          icon="i-mdi-github"
          :square="true"
          variant="ghost"
          :to="appConfig.repoUrl"
          aria-label="View react-ui-libs on GitHub"
          target="_blank"
        />

        <ThemeSelector />

        <UButton
          icon="i-material-symbols-account-circle-outline"
          :square="true"
          :to="appConfig.myWebsiteUrl"
          aria-label="View BINGWU2003 on GitHub"
          target="_blank"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false)

const appConfig = useAppConfig()
</script>
