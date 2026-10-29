<template>
  <div>
    <div class="sticky top-0 z-20">
      <Header />
    </div>
    <UContainer class="pb-6">
      <div class="mt-6 text-center sm:my-12">
        <p class="text-3xl font-semibold tracking-tight sm:text-4xl">
          Pick the right UI Library
        </p>
        <p class="text-lg sm:text-xl">
          for your
          <NuxtLink
            to="https://react.dev/"
            target="_blank"
            class="primary-text font-semibold"
          >
            React
          </NuxtLink>
          or
          <NuxtLink
            to="https://nextjs.org/"
            target="_blank"
            class="primary-text font-semibold"
          >
            Next.js
          </NuxtLink>
          Project.
        </p>
      </div>

      <div class="mt-6 flex flex-grow justify-center gap-4 sm:mt-8">
        <!-- filters -->
        <div class="-mt-2 hidden w-72 shrink-0 p-3 md:block">
          <Filters />
        </div>

        <LibraryCards />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const title = "react-ui-libs"
const description =
  "Compare popular React UI libraries by styling, accessibility, components, and more. Pick the right UI library for your React or Next.js project."
const siteUrl = getSiteUrl(useRuntimeConfig().public.siteUrl)

useHead({
  title,
  htmlAttrs: { lang: "en" },
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon/cube-transparent.svg",
    },
    ...(siteUrl ? [{ rel: "canonical", href: `${siteUrl}/` }] : []),
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
