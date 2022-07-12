import React from "react"
import { gradients } from "../../constants/gradients"
import cls from "./Tooltip.module.scss"

export default function TooltipBarChart({ active, payload, filteredColumns }) {
  if (active && payload && payload.length) {
    return (
      <div className={cls.customTooltip}>
        <p className={cls.title}>Заказы ежедневно</p>
        {payload
          .filter((data) => filteredColumns.includes(data.dataKey))
          .map((item, index) => (
            <div className={cls.content} key={index + item.payload.name}>
              <div className={cls.itemTooltip}>
                <span
                  style={{
                    background: `linear-gradient(180deg, ${
                      gradients.find((data) => data.name === item.dataKey).from
                    } 0%, ${
                      gradients.find((data) => data.name === item.dataKey).to
                    } 100%)`,
                  }}
                />{" "}
                <p>{item.name}</p>
              </div>
              <span className={cls.value}>{item.payload[item.dataKey]}</span>
            </div>
          ))}
      </div>
    )
  }
  return null
}
