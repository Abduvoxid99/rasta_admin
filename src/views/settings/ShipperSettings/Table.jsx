import React, { useEffect, useRef, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { useHistory } from "react-router"
import { useTranslation } from "react-i18next"

//components and functions
import Modal from "../../../components/Modal"
import Pagination from "../../../components/Pagination"
import Card from "../../../components/Card"
import LoaderComponent from "../../../components/Loader"
import Button from "../../../components/Button"
import ActionMenu from "../../../components/ActionMenu"

import axios from "../../../utils/axios"

//icons
import DeleteIcon from "@material-ui/icons/Delete"
import Filters from "../../../components/Filters"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"
import EditIcon from "@material-ui/icons/Edit"
import SwitchColumns from "../../../components/Filters/SwitchColumns"
import { ExportIcon } from "../../../constants/icons"
import { useSelector } from "react-redux"
import StatusTag from "../../../components/Tag/StatusTag"
import EmptyData from "../../../components/EmptyData"
import { importExcelShippers } from "../../../services/importExcel"
import FilterRegionsDropdown from "../../../components/FilterRegionsDropdown"

const ApplicationTable = ({ permissions }) => {
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const inputFile = useRef(null)
  const [loader, setLoader] = useState(true)
  const [deleteModal, setDeleteModal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState("")
  const history = useHistory()
  const [columns, setColumns] = useState([])
  const [filters, setFilters] = useState({
    region_ids: [],
  })
  const [limit, setLimit] = useState(10)
  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
          />
        ),
        key: "actions",
        render: (record, index) => (
          <ActionMenu
            id={record.id}
            actions={[
              permissions.put && {
                icon: <EditIcon />,
                color: "blue",
                title: t("change"),
                action: () => {
                  editRow(record.id)
                },
              },
              permissions.delete && {
                icon: <DeleteIcon />,
                color: "red",
                title: t("delete"),
                action: () => {
                  setDeleteModal({ id: record.id })
                },
              },
            ]}
          />
        ),
      },
    ]
    setColumns(_columns)
  }, [currentPage])

  let debounce = setTimeout(() => {}, 0)

  const onSearch = (e) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      setSearch(e.target.value)
    }, 300)
  }

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, search, limit, filters])

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }
  const { region_ids } = useSelector((state) => state.auth)
  const getItems = (page) => {
    setLoader(true)
    clearItems()
    axios
      .get("/shippers", {
        params: {
          limit,
          page,
          search,
          region_ids:
            filters.region_ids.length > 0
              ? filters.region_ids.map((item) => item.value).join(",")
              : region_ids.join(","),
        },
      })
      .then((res) => {
        setItems(res)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoader(false))
  }

  const editRow = (id) => {
    history.push(`/home/company/shipper-company/${id}?tab=company`)
  }

  const handleDelete = () => {
    setDeleteLoading(true)
    axios
      .delete("/shippers/" + deleteModal.id)
      .then((_) => {
        setDeleteModal(false)
        getItems(currentPage)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setDeleteLoading(false))
  }

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      title: t("name"),
      key: "name",
      render: (record) => <div>{record.name}</div>,
    },
    {
      title: t("description"),
      key: "description",
      render: (record) => (
        <div className="truncate w-96">{record.description}</div>
      ),
    },
    {
      title: t("regions"),
      key: "Regions",
      render: (record) => (
        <div>{record?.Regions?.map((item) => item.name).join(" ,")}</div>
      ),
    },
    {
      title: t("status"),
      key: "company.type",
      render: (record) => (
        <div>
          <StatusTag
            status={record.is_active}
            color={!record.is_active ? "#F2271C" : "#0E73F6"}
          />
        </div>
      ),
    },
  ]

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={ExportIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => inputFile.current.click()}
      >
        {t("import")}
      </Button>

      {/* <Button
        icon={DownloadIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button> */}
    </div>
  )

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
      pageCount={limit}
      onChangeLimit={(limitNumber) => setLimit(limitNumber)}
      limit={limit}
    />
  )

  return (
    <div>
      <Filters extra={extraFilter}>
        <div className="flex gap-4 items-center">
          <Input
            onChange={onSearch}
            width={280}
            placeholder={t("search")}
            size="middle"
            addonBefore={
              <SearchIcon style={{ color: "var(--color-primary)" }} />
            }
          />
          <FilterRegionsDropdown setFilters={setFilters} filters={filters} />
        </div>
      </Filters>
      <div className="p-4">
        <input
          type="file"
          id="file"
          ref={inputFile}
          style={{ display: "none" }}
          accept=".xlsx, .xls, .csv"
          onChange={(e) => importExcelShippers(e)}
        />
        <Card footer={pagination}>
          <TableContainer className="rounded-lg border border-lightgray-1">
            <Table aria-label="simple table">
              <TableHead>
                {columns.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableHead>
              <TableBody>
                {items.shippers &&
                  items.shippers.length > 0 &&
                  items.shippers.map((item, index) => (
                    <TableRow
                      onClick={() => permissions.put && editRow(item.id)}
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                      key={item.id}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {col.render ? col.render(item, index) : "----"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {items.shippers && items.shippers.length === 0 && (
              <EmptyData loading={loader} />
            )}
          </TableContainer>
          <LoaderComponent isLoader={loader} />
          <Modal
            open={deleteModal}
            onClose={() => setDeleteModal(null)}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
        </Card>
      </div>
    </div>
  )
}

export default ApplicationTable
