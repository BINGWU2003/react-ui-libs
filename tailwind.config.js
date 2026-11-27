module.exports = {
  content: [
    // existing paths: https://github.com/nuxt-modules/tailwindcss/blob/main/src/resolvers.ts#L25
    "./data/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        geist: {
          "canvas": "rgb(var(--ds-bg-canvas) / <alpha-value>)",
          "surface": "rgb(var(--ds-bg-surface) / <alpha-value>)",
          "subtle": "rgb(var(--ds-bg-subtle) / <alpha-value>)",
          "hover": "rgb(var(--ds-bg-hover) / <alpha-value>)",
          "fg": "rgb(var(--ds-fg-primary) / <alpha-value>)",
          "secondary": "rgb(var(--ds-fg-secondary) / <alpha-value>)",
          "muted": "rgb(var(--ds-fg-muted) / <alpha-value>)",
          "border": "rgb(var(--ds-border) / <alpha-value>)",
          "border-strong": "rgb(var(--ds-border-strong) / <alpha-value>)",
          "accent": "rgb(var(--ds-accent) / <alpha-value>)",
          "accent-fg": "rgb(var(--ds-accent-fg) / <alpha-value>)",
          "ring": "rgb(var(--ds-ring) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          '"Geist Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "geist-card": "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        "geist-card-hover": "0 4px 16px -2px rgb(0 0 0 / 0.08)",
      },
    },
  },
  future: {
    // https://github.com/tailwindlabs/tailwindcss/discussions/1739
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("@tailwindcss/typography")],
}
