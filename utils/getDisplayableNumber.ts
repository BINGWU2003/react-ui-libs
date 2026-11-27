export const getDisplayableNumber = (number: number): string => {
  if (number >= 1_000_000) {
    return `${Math.round(number / 100_000) / 10}M`
  }
  if (number >= 1_000) {
    return `${Math.round(number / 100) / 10}k`
  }
  return `${number}`
}
