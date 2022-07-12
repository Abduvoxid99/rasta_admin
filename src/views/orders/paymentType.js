import Cash from "../../assets/icons/cash.png"
import Card from "../../assets/icons/debit-cards.png"

export const getPaymentImg = (type) => {
  switch (type) {
    case "payme":
      return Card
    case "cash":
      return Cash
    default:
      return Cash
  }
}