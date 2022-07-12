import React, { useState } from "react"
import { statusTabList } from "../../../../constants/statuses"
import OrderTable from "../../Table"
import moment from "moment"

const UserOrdersTable = ({ userId, setTabValue }) => {
  const [filters, setFilters] = useState({
    customer_id: undefined,
    branch_ids: undefined,
    courier_id: undefined,
    external_order_id: undefined,
    start_date: moment().add(-1, "d").format("YYYY-MM-DD"),
    end_date: moment().add(1, "d").format("YYYY-MM-DD"),
    payment_type: undefined,
  })

  return (
    <OrderTable
      tabValue={statusTabList[statusTabList.length - 1].id}
      filters={filters}
      userId={userId}
      setTabValue={setTabValue}
    />
  )
}

export default UserOrdersTable
