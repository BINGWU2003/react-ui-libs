const focusRing =
  "focus-visible:ring-2 focus-visible:ring-shadcn-ring dark:focus-visible:ring-shadcn-ring focus-visible:ring-offset-2 focus-visible:ring-offset-shadcn-background dark:focus-visible:ring-offset-shadcn-background"

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
            "shadow-sm bg-shadcn-primary text-shadcn-primary-foreground hover:bg-shadcn-primary/90 disabled:bg-shadcn-primary aria-disabled:bg-shadcn-primary",
          outline:
            "ring-1 ring-inset ring-shadcn-border bg-shadcn-background text-shadcn-foreground hover:bg-shadcn-accent disabled:bg-shadcn-background aria-disabled:bg-shadcn-background",
          soft: "bg-shadcn-muted text-shadcn-foreground hover:bg-shadcn-accent/80 disabled:bg-shadcn-muted aria-disabled:bg-shadcn-muted",
          ghost:
            "text-shadcn-foreground hover:bg-shadcn-accent disabled:bg-transparent aria-disabled:bg-transparent",
          link: "text-shadcn-primary underline-offset-4 hover:underline",
        },
        gray: {
          ghost: `text-shadcn-muted-foreground dark:text-shadcn-muted-foreground hover:text-shadcn-foreground dark:hover:text-shadcn-foreground hover:bg-shadcn-accent dark:hover:bg-shadcn-accent ${focusRing}`,
        },
      },
    },
    range: {
      ring: focusRing,
      progress: {
        background: "bg-shadcn-primary dark:bg-shadcn-primary",
      },
      thumb: {
        color: "text-shadcn-primary dark:text-shadcn-primary",
        background:
          "[&::-webkit-slider-thumb]:bg-shadcn-background [&::-webkit-slider-thumb]:dark:bg-shadcn-background [&::-moz-range-thumb]:bg-shadcn-background",
        ring: "[&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-current [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-shadcn-primary",
      },
      track: {
        background:
          "[&::-webkit-slider-runnable-track]:bg-shadcn-muted [&::-moz-range-track]:bg-shadcn-muted [&::-webkit-slider-runnable-track]:dark:bg-shadcn-muted [&::-moz-range-track]:dark:bg-shadcn-muted",
      },
    },
    toggle: {
      ring: focusRing,
      active: "bg-shadcn-primary dark:bg-shadcn-primary",
      inactive: "bg-shadcn-muted dark:bg-shadcn-muted",
      container: {
        base: "bg-shadcn-background dark:bg-shadcn-background",
      },
      icon: {
        on: "text-shadcn-primary dark:text-shadcn-primary",
        off: "text-shadcn-muted-foreground dark:text-shadcn-muted-foreground",
        loading: "animate-spin text-shadcn-primary dark:text-shadcn-primary",
      },
    },
    tooltip: {
      // removes fixed height and truncate
      base: "h-auto overflow-visible text-overflow-clip whitespace-normal",
      background: "bg-shadcn-primary dark:bg-shadcn-primary",
      color: "text-shadcn-primary-foreground dark:text-shadcn-primary-foreground",
      ring: "ring-0 dark:ring-0",
      arrow: {
        background: "before:bg-shadcn-primary dark:before:bg-shadcn-primary",
        ring: "before:ring-0 dark:before:ring-0",
      },
      popper: { placement: "top" },
    },
    slideover: {
      background: "bg-shadcn-background dark:bg-shadcn-background",
      overlay: {
        background: "bg-black/50 dark:bg-black/50",
      },
    },
  },
  repoUrl: "https://github.com/BINGWU2003/react-ui-libs",
  myWebsiteUrl: "https://github.com/BINGWU2003",
})
