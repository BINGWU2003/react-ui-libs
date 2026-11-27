import { libraries } from "@/data/libraries"

type NpmDownloadsResponse = {
  downloads?: unknown
}

export const useLibraryDownloads = () =>
  useAsyncData<Record<string, number | null>>(
    "library-downloads",
    async () => {
      const packages = Array.from(
        new Set(libraries.map((lib) => lib.package).filter((pkg): pkg is string => Boolean(pkg)))
      )

      const entries = await Promise.all(
        packages.map(async (pkg): Promise<[string, number | null]> => {
          try {
            const response = await $fetch<NpmDownloadsResponse>(
              `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`
            )
            const valid = getValidMetric(response?.downloads)
            return [pkg, valid ?? null]
          } catch {
            return [pkg, null]
          }
        })
      )

      return Object.fromEntries(entries)
    },
    {
      lazy: true,
      server: false,
    }
  )
