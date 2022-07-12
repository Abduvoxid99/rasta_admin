import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
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
import LoaderComponent from "../../../components/Loader"
import ActionMenu from "../../../components/ActionMenu"
import Card from "../../../components/Card"
import Filters from "../../../components/Filters"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"
import Button from "../../../components/Button"
import GetAppIcon from "@material-ui/icons/GetApp"
import StatusTag from "../../../components/Tag/StatusTag"
import { deletePromotion, getPromotions } from "../../../services/promotion"
import EmptyData from "../../../components/EmptyData"
import { useSelector } from "react-redux"

export default function TableStocks({ permissions }) {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [search, setSearch] = useState("")
  const [columns, setColumns] = useState([])
  const [limit, setLimit] = useState(10)
  const { region_ids } = useSelector((state) => state.auth)
  useEffect(() => {
    setColumns(initialColumns)
  }, [])

  useEffect(() => {
    getItems(currentPage, search)
  }, [currentPage, search, limit])

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deletePromotion(deleteModal.id)
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
      render: (_, index) => <div>{(currentPage - 1) * 10 + index + 1}</div>,
    },
    {
      title: t("name"),
      key: "name.ru",
      dataIndex: "name.ru",
      render: (record) => <>{record.name.ru}</>,
    },
    {
      title: t("start.stock"),
      key: "start_date",
      dataIndex: "start_date",
    },
    {
      title: t("finish.stock"),
      key: "end_date",
      dataIndex: "end_date",
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => (
        <div>
          <StatusTag
            status={record.is_active}
            color={!record.is_active ? "#F2271C" : "#0E73F6"}
          />
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <ActionMenu
          id={record.id}
          actions={[
            permissions.put && {
              title: t("edit"),
              icon: <EditIcon />,
              color: "blue",
              action: () =>
                history.push(`/home/marketing/stocks/create/${record.id}`),
            },
            permissions.delete && {
              title: t("delete"),
              icon: <DeleteIcon />,
              color: "red",
              action: () =>
                setDeleteModal({
                  id: record.id,
                }),
            },
          ]}
        />
      ),
    },
  ]

  const getItems = (page, search) => {
    setLoader(true)
    getPromotions({
      limit,
      page,
      search,
      region_ids: region_ids.join(","),
      is_promo: false,
    })
      .then((res) => {
        console.log(res)
        setItems({
          count: res.count,
          data: res.promotions,
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
      {/* <Button
        icon={FIlterIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
        size="medium"
        className="bg-white"
        onClick={() => {
          console.log("clicked")
        }}
      >
        Фильтр
      </Button> */}

      <Button
        icon={GetAppIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
        size="medium"
        className="bg-white"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button>
    </div>
  )

  return (
    <div>
      <Filters extra={extraFilter}>
        <Input
          onChange={onSearch}
          width={280}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon style={{ color: "var(--color-primary)" }} />}
        />
      </Filters>
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
                items.data.length &&
                items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    onClick={() => {
                      permissions.put &&
                        history.push(`/home/marketing/stocks/create/${item.id}`)
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render
                          ? col.render(item, index)
                          : item[col.dataIndex]}
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
