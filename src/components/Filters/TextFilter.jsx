import { useEffect, useState } from "react"
import FilterDropdown from "./FilterDropdown"
import Sorter from "./Sorter"

const Icon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.54168 4.71634C3.62501 4.82467 8.32501 10.8247 8.32501 10.8247V15.833C8.32501 16.2913 8.70001 16.6663 9.16668 16.6663H10.8417C11.3 16.6663 11.6833 16.2913 11.6833 15.833V10.8163C11.6833 10.8163 16.2583 4.96634 16.475 4.69967C16.6917 4.43301 16.6667 4.16634 16.6667 4.16634C16.6667 3.70801 16.2917 3.33301 15.825 3.33301H4.17501C3.66668 3.33301 3.33334 3.73301 3.33334 4.16634C3.33334 4.33301 3.38334 4.53301 3.54168 4.71634Z"
      fill="#9AAFCD"
    />
  </svg>
)

const TextFilter = ({
  title,
  filterOptions,
  onFilter,
  sorter,
  onSort,
  filterComponent,
  style,
  sortValue,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const [status, setStatus] = useState(null)
  return (
    <>
      <div
        className="flex justify-between items-center"
        style={style}
        onClick={(e) => {
          if (filterOptions) setAnchorEl(e.currentTarget)
          if (sorter) {
            if (status) {
              if (status === "asc") {
                setStatus("desc")
              } else {
                setStatus("asc")
              }
            } else {
              setStatus("asc")
            }
          }
        }}
      >
        <div className="flex items-center gap-2.5 justify-between w-full whitespace-nowrap">
          {title}
          {sorter && (
            <Sorter onChange={onSort} setStatus={setStatus} status={status} />
          )}
          {filterOptions && <div className="cursor-pointer ml-2">{Icon}</div>}
        </div>
      </div>
      {filterOptions && (
        <FilterDropdown
          filterComponent={filterComponent}
          options={filterOptions}
          onFilter={onFilter}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          {...props}
        />
      )}
    </>
  )
}

export default TextFilter
