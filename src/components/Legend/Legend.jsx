import React from "react"
import { gradients } from "../../constants/gradients"
import cls from "./Legend.module.scss"

export default function BarChartLegend(props) {
  const { keys, filterColumns, filteredColumns } = props

  return (
    <div className={cls.customLegend}>
      <div className={cls.legendItem}>
        <div className={cls.legends}>
          {keys.map((entry, index) => (
            <span
              key={`item-${index}`}
              className={`${cls.item} ${
                !filteredColumns.includes(entry.datakey) ? "line-through" : ""
              }`}
              onClick={() => filterColumns(entry.datakey)}
            >
              <span
                className={`${cls.circle} ${
                  !filteredColumns.includes(entry.datakey) ? cls.active : ""
                }`}
                style={{
                  background: `linear-gradient(180deg, ${
                    gradients.find((data) => data.name === entry.datakey).from
                  } 0%, ${
                    gradients.find((data) => data.name === entry.datakey).to
                  } 100%)`,
                }}
              />
              {entry.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
