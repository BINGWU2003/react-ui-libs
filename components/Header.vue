<template>
  <div class="border-b border-shadcn-border bg-shadcn-background/95 backdrop-blur-md">
    <div class="flex items-center justify-between px-4 py-2 md:px-8">
      <div class="hidden h-12 items-center gap-2 md:flex">
        <!-- Phosphor Icons: cube-transparent-duotone (MIT). See public/favicon/README.md. -->
        <svg
          class="size-8 shrink-0 text-shadcn-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M216,96V216H96L40,160V40H160Z" opacity="0.2" />
          <path
            d="M221.66,90.34h0l-56-56A8,8,0,0,0,160,32H40a8,8,0,0,0-8,8V160a8,8,0,0,0,2.3,5.61l56,56h0A8,8,0,0,0,96,224H216a8,8,0,0,0,8-8V96A8,8,0,0,0,221.66,90.34ZM168,59.31,196.69,88H168ZM88,196.69,59.31,168H88ZM88,152H48V59.31l40,40ZM59.31,48H152V88H99.31ZM152,104v48H104V104ZM104,208V168h52.69l40,40Zm104-11.31-40-40V104h40Z"
          />
        </svg>
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
