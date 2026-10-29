export const useLibraryStars = () =>
  useFetch<Record<string, number | null>>("/api/library-stars", {
    key: "library-stars",
    lazy: true,
    server: false,
  })
