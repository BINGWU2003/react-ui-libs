export default defineAppConfig({
  ui: {
    colors: {
      primary: "neutral",
      neutral: "neutral",
    },
    tooltip: {
      slots: {
        content:
          "z-[60] max-w-xs h-auto flex items-center gap-1 bg-geist-accent text-geist-accent-fg shadow-lg rounded-md ring-1 ring-geist-border px-2.5 py-1.5 text-xs leading-relaxed select-none pointer-events-none",
        text: "whitespace-normal break-words",
        arrow: "fill-geist-accent",
      },
    },
    slideover: {
      slots: {
        overlay: "fixed inset-0 z-50 bg-black/45 dark:bg-black/70 backdrop-blur-[2px]",
        content:
          "fixed z-50 bg-geist-surface divide-y divide-geist-border flex flex-col focus:outline-none",
      },
    },
    switch: {
      slots: {
        base: "data-[state=checked]:bg-geist-accent data-[state=unchecked]:bg-geist-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-geist-ring",
        thumb: "bg-geist-surface",
      },
    },
  },
  repoUrl: "https://github.com/BINGWU2003/react-ui-libs",
  myWebsiteUrl: "https://github.com/BINGWU2003",
})
