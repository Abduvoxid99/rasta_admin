import React from "react"
import noData from "../../assets/images/empty-box.png"

function EmptyData({ loading, width = "auto" }) {
  if (loading) return null

  return (
    <div
      className="flex justify-center h-24 items-center border-t w-full"
      style={{ width }}
    >
      <img src={noData} alt="empty data" className="w-10 h-10 object-cover" />
    </div>
  )
}

export default EmptyData
