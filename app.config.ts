export default defineAppConfig({
  ui: {
    strategy: "merge",
    primary: "emerald",
    gray: "slate",
    icons: {
      dynamic: true,
    },
    tooltip: {
      // removes fixed height and truncate
      base: "h-auto overflow-visible text-overflow-clip whitespace-normal",
      popper: { placement: "top" },
    },
  },
  repoUrl: "https://github.com/BINGWU2003/react-ui-libs",
  myWebsiteUrl: "https://github.com/BINGWU2003",
})
