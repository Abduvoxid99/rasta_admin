import React, { useState, useEffect } from "react"
import CSelect from "../Select"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import ArrowForward from "@material-ui/icons/ArrowForward"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import { Popover } from "@material-ui/core"
import MuiPagination from "@material-ui/lab/Pagination"

// const DOTS = "..."

function Pagination({
  children,
  className,
  size = "large",
  type = "simple",
  count = 0,
  pageBound = 5,
  pageCount = 10,
  currentPage = 1,
  onChange = function () {},
  title = "Elementlar soni",
  marginTop = 0,
  onChangeLimit,
  limit = 10,
  ...rest
}) {
  const [isActivePage, setIsActivePage] = useState(currentPage)
  const [upperPageBound, setUpperPageBound] = useState(pageBound)
  const [lowerPageBound, setLowerPageBound] = useState(0)

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClickPopup = (event) => {
    setAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    setIsActivePage(currentPage)
  }, [currentPage])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  return (
    <div
      className="flex w-full align-center justify-between"
      style={{ marginTop }}
    >
      {/* <sta>{`${title}: ${count}`}</p> */}
      <div
        className="py-1.5 px-4 text-sm border rounded-md flex items-center text-primary cursor-pointer"
        onClick={handleClickPopup}
      >
        <InsertDriveFileIcon fontSize="small" className="mr-2" />
        <span className="text-black-1 font-medium">Показать по {limit}</span>
        <KeyboardArrowDownIcon className="ml-2" />
      </div>

      <MuiPagination
        count={Math.ceil(count / limit)}
        shape="rounded"
        className="flex"
        page={isActivePage}
        onChange={(_, value) => {
          setIsActivePage(value)
          onChange(value)
        }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div
          className="w-40 px-3 py-2 hover:bg-gray-50 cursor-pointer text-base font-medium"
          onClick={() => {
            onChangeLimit(10)
            onChange(1)
            handleClose()
            setIsActivePage(1)
          }}
        >
          10
        </div>
        <div
          className="w-40 px-3 py-2 hover:bg-gray-50 cursor-pointer text-base font-medium"
          onClick={() => {
            onChangeLimit(30)
            setIsActivePage(1)
            onChange(1)
            handleClose()
          }}
        >
          30
        </div>
        <div
          className="w-40 px-3 py-2 hover:bg-gray-50 cursor-pointer text-base font-medium"
          onClick={() => {
            onChangeLimit(50)
            onChange(1)
            setIsActivePage(1)
            handleClose()
          }}
        >
          50
        </div>
      </Popover>
    </div>
  )
}

export default Pagination
