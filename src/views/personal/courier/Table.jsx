import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import Pagination from "../../../components/Pagination"
import Modal from "../../../components/Modal"
import { deleteCourier, getCouriers } from "../../../services/courier"
import LoaderComponent from "../../../components/Loader"
import SwitchColumns from "../../../components/Filters/SwitchColumns"
import ActionMenu from "../../../components/ActionMenu"
import Card from "../../../components/Card"
import Filters from "../../../components/Filters"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"
import Button from "../../../components/Button"
import { DownloadIcon, ExportIcon } from "../../../constants/icons"
import StatusTag from "../../../components/Tag/StatusTag"
import EmptyData from "../../../components/EmptyData"
import FilterRegionsDropdown from "../../../components/FilterRegionsDropdown"

export default function TableCourier({ permissions }) {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [search, setSearch] = useState("")
  const [columns, setColumns] = useState([])
  const [isOfferCourier, setIsOfferCourier] = useState(false)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState({
    region_ids: [],
  })
  // console.log('asadbek', history)

  // useEffect(() => {
  //   setIsOfferCourier(history?.location?.pathname.includes('offer') ? true : false)
  // }, [history])

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
        key: t("actions"),
        render: (record, _) => (
          <ActionMenu
            id={record.id}
            actions={[
              permissions.put && {
                icon: <EditIcon />,
                color: "blue",
                title: t("change"),
                action: () => {
                  history.push(`/home/courier/list/${record.id}`)
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

  useEffect(() => {
    setIsOfferCourier(history?.location?.pathname.includes("offer"))
    getItems(currentPage, history?.location?.pathname.includes("offer"))
  }, [currentPage, limit, search, filters])

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteCourier(deleteModal.id)
      .then((res) => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div>{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("fullName"),
      key: "fullName",
      render: (record) => (
        <div>{`${record.first_name} ${record.last_name}`}</div>
      ),
    },
    {
      title: t("phone.number"),
      key: "phone",
      render: (record) => <div>{record.phone}</div>,
    },
    {
      title: t("Работает"),
      key: "is_working",
      render: (record) => (
        <div>
          <StatusTag
            innerText={record.is_working ? "Онлайн" : "Офлайн"}
            color={!record.is_working ? "#F2271C" : "#0452C8"}
          />
        </div>
      ),
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => (
        <div>
          <StatusTag
            status={record.is_active}
            color={!record.is_active ? "#F2271C" : "#0452C8"}
          />
        </div>
      ),
    },
  ]
  const { region_ids } = useSelector((state) => state.auth)

  const getItems = (page, type) => {
    setLoader(true)
    getCouriers({
      limit,
      page,
      region_ids:
        filters.region_ids.length > 0
          ? filters.region_ids.map((item) => item.value).join(",")
          : region_ids.join(","),
      search,
      is_free: type ? "not-free" : "",
    })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.couriers,
        })
      })
      .finally(() => setLoader(false))
  }

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

  let debounce = setTimeout(() => {}, 0)

  const onSearch = (e) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      setSearch(e.target.value)
    }, 300)
  }

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={ExportIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
        className="bg-white"
        onClick={() => {
          console.log("clicked")
        }}
      >
        {t("import")}
      </Button>

      <Button
        icon={DownloadIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
        className="bg-white"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button>
    </div>
  )

  return (
    <div>
      {!isOfferCourier && (
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
      )}
      <Card className="m-4" footer={pagination}>
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.data &&
                !loader &&
                items.data.length > 0 &&
                items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    onClick={() => {
                      history.push(`/home/courier/list/${item.id}`)
                    }}
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
          {items.data && items.data.length === 0 && (
            <EmptyData loading={loader} />
          )}
        </TableContainer>
        <LoaderComponent isLoader={loader} />
        <Modal
          open={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDeleteItem}
          loading={deleteLoading}
        />
      </Card>
    </div>
  )
}
