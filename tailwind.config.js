module.exports = {
  content: [
    // existing paths: https://github.com/nuxt-modules/tailwindcss/blob/main/src/resolvers.ts#L25
    "./data/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        shadcn: {
          "background": "rgb(var(--shadcn-background) / <alpha-value>)",
          "foreground": "rgb(var(--shadcn-foreground) / <alpha-value>)",
          "card": "rgb(var(--shadcn-card) / <alpha-value>)",
          "primary": "rgb(var(--shadcn-primary) / <alpha-value>)",
          "primary-foreground": "rgb(var(--shadcn-primary-foreground) / <alpha-value>)",
          "muted": "rgb(var(--shadcn-muted) / <alpha-value>)",
          "muted-foreground": "rgb(var(--shadcn-muted-foreground) / <alpha-value>)",
          "accent": "rgb(var(--shadcn-accent) / <alpha-value>)",
          "border": "rgb(var(--shadcn-border) / <alpha-value>)",
          "ring": "rgb(var(--shadcn-ring) / <alpha-value>)",
        },
      },
    },
    fontFamily: {
      roobert: "Roobert, sans-serif",
    },
  },
  future: {
    // https://github.com/tailwindlabs/tailwindcss/discussions/1739
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("@tailwindcss/typography")],
}
