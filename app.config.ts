const focusRing =
  "focus-visible:ring-2 focus-visible:ring-geist-ring focus-visible:ring-offset-2 focus-visible:ring-offset-geist-canvas"

export default defineAppConfig({
  ui: {
    strategy: "merge",
    primary: "neutral",
    gray: "neutral",
    icons: {
      dynamic: true,
    },
    button: {
      base: focusRing,
      color: {
        primary: {
          solid:
            "bg-geist-accent text-geist-accent-fg hover:opacity-90 disabled:opacity-50",
          outline:
            "ring-1 ring-inset ring-geist-border bg-geist-surface text-geist-fg hover:bg-geist-subtle hover:ring-geist-border-strong",
          soft: "bg-geist-subtle text-geist-fg hover:bg-geist-hover",
          ghost: "text-geist-fg hover:bg-geist-subtle",
          link: "text-geist-fg underline-offset-4 hover:underline",
        },
        gray: {
          ghost: `text-geist-secondary hover:text-geist-fg hover:bg-geist-subtle ${focusRing}`,
        },
      },
    },
    toggle: {
      ring: focusRing,
      active: "bg-geist-accent dark:bg-geist-accent",
      inactive: "bg-geist-border dark:bg-geist-border",
      container: {
        base: "bg-geist-surface dark:bg-geist-surface",
      },
      icon: {
        on: "text-geist-accent dark:text-geist-accent",
        off: "text-geist-muted dark:text-geist-muted",
        loading: "animate-spin text-geist-accent dark:text-geist-accent",
      },
    },
    tooltip: {
      container: "z-50 group pointer-events-none",
      base: "[@media(pointer:coarse)]:hidden h-auto max-w-xs overflow-visible text-overflow-clip whitespace-normal px-2.5 py-1.5 text-xs leading-relaxed",
      background: "bg-geist-accent dark:bg-geist-accent",
      color: "text-geist-accent-fg dark:text-geist-accent-fg",
      ring: "ring-1 ring-geist-border dark:ring-geist-border",
      shadow: "shadow-lg",
      arrow: {
        background: "before:bg-geist-accent dark:before:bg-geist-accent",
        ring: "before:ring-0 dark:before:ring-0",
      },
      popper: { placement: "top", offsetDistance: 8, strategy: "fixed" },
    },
    slideover: {
      background: "bg-geist-surface dark:bg-geist-surface",
      overlay: {
        background: "bg-black/45 dark:bg-black/70 backdrop-blur-[2px]",
      },
    },
  },
  repoUrl: "https://github.com/BINGWU2003/react-ui-libs",
  myWebsiteUrl: "https://github.com/BINGWU2003",
})
