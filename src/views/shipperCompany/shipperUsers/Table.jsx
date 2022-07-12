import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import Pagination from "../../../components/Pagination"
import Modal from "../../../components/Modal"
import { deleteShipperUser, getShipperUsers } from "../../../services/shipper"
import Filters from "../../../components/Filters"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import ActionMenu from "../../../components/ActionMenu"
import LoaderComponent from "../../../components/Loader"
import SwitchColumns from "../../../components/Filters/SwitchColumns"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import { DownloadIcon, ExportIcon } from "../../../constants/icons"
import { useSelector } from "react-redux"
import EmptyData from "../../../components/EmptyData"

export default function TableOperator({ permissions }) {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const { id } = useParams()
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [search, setSearch] = useState("")
  const [limit, setLimit] = useState(10)
  const [columns, setColumns] = useState([])
  let debounce = setTimeout(() => {}, 0)

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, search, limit])

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
                  history.push(`/home/company/shipper-users/create/${id}/${record.id}`)
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
  }, [])

  const onSearch = (e) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      setSearch(e.target.value)
    }, 300)
  }

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteShipperUser(deleteModal.id)
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
      render: (record) => <div>{record.name}</div>,
    },
    {
      title: t("phone"),
      key: "phone",
      render: (record) => <div>{record.phone}</div>,
    },
  ]
  const { region_ids } = useSelector((state) => state.auth)
  const getItems = (page) => {
    setLoader(true)
    getShipperUsers({ limit, with_shipper_admin: true, shipper_id: id,  page, search, region_ids: region_ids.join(",") })
      .then((res) => {
        console.log(res)
        setItems({
          count: res.count,
          data: res.shipper_users,
        })
      })
      .finally(() => setLoader(false))
  }

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={ExportIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          console.log("clicked")
        }}
      >
        {t("import")}
      </Button>

      <Button
        icon={DownloadIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button>
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
              {items.data && items.data.length ? (
                items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    onClick={() =>
                      history.push(`/home/company/shipper-users/create/${id}/${item.id}`)
                    }
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(item, index) : "----"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <></>
              )}
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
