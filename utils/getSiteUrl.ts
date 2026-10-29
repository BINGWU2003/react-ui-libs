export const getSiteUrl = (value: string): string | undefined => {
  try {
    const url = new URL(value)
    return ["http:", "https:"].includes(url.protocol) ? url.origin : undefined
  } catch {
    return undefined
  }
}
