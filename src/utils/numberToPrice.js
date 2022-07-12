export const numberToPrice = (number, currency) => {
  return `${number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${
    currency || "сум"
  }`
}
