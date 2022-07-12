import React, { memo, useEffect, useMemo, useState } from "react"
import Tag from "../../components/Tag"
import AccessTimeIcon from "@material-ui/icons/AccessTime"
import moment from "moment"
import { orderTimer } from "../../utils/orderTimer"

const OrderTime = memo(({ elm }) => {
  const [nowDate, setNowDate] = useState(moment())

  useEffect(() => {
    let intervalId = setInterval(() => {
      setNowDate(moment())
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const orderTime = useMemo(
    () => orderTimer(elm.created_at, elm.finished_at, nowDate),
    [elm, nowDate]
  )

  return (
    <Tag
      color={
        +orderTime.split(":")[1] > 45 || +orderTime.split(":")[0] > 0
          ? "red"
          : +orderTime.split(":")[0] > 0 || +orderTime.split(":")[1] > 30
          ? "yellow"
          : "green"
      }
      size="large"
      shape="subtle"
    >
      <span
        className={`${
          +orderTime.split(":")[1] > 45 || +orderTime.split(":")[0] > 0
            ? "text-red-600"
            : +orderTime.split(":")[0] > 0 || +orderTime.split(":")[1] > 30
            ? "text-yellow-600"
            : "text-green-600"
        }  flex items-center whitespace-nowrap`}
      >
        <AccessTimeIcon fontSize="small" className="mr-2" />
        {orderTime}
      </span>
    </Tag>
  )
})

export default OrderTime
