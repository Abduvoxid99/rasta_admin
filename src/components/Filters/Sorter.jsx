import { useState, useEffect } from "react"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"

export default function Sorter({
  value,
  onChange = () => {},
  status,
  setStatus,
}) {
  useEffect(() => {
    onChange(status)
  }, [status])

  return (
    <div
      style={{ width: 20, height: 40, color: "#6E8BB7BF" }}
      className="fill-current cursor-pointer flex flex-col items-center justify-between"
    >
      <div
        className={`asc ${status === "asc" ? "text-blue-600" : ""}`}
        onClick={() => setStatus("asc")}
        // style={{ marginTop: "-10px" }}
      >
        {/* <ArrowDropUpIcon fontSize="medium" /> */}
      </div>
      <div
        className={`desc ${status === "desc" ? "text-blue-600" : ""}`}
        // style={{ marginTop: "-9px" }}
        onClick={() => setStatus("desc")}
      >
        {/* <ArrowDropDownIcon fontSize="medium" /> */}
      </div>
    </div>
  )
}
