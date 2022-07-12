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

import Pagination from "../../components/Pagination"
import { deleteTextBanner, getTextBanners } from "../../services/banner"
import Modal from "../../components/Modal"
import LoaderComponent from "../../components/Loader"
import ActionMenu from "../../components/ActionMenu"
import Card from "../../components/Card"

//icons
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import TableChartIcon from "@material-ui/icons/TableChart"
import EmptyData from "../../components/EmptyData"

export default function TableBanner({ permissions }) {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const lang = useSelector((state) => state.lang.current)
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [limit, setLimit] = useState(10)
  const { region_ids } = useSelector((state) => state.auth)

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteTextBanner({ banner_id: deleteModal.id })
      .then((res) => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, limit])

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => <>{(currentPage - 1) * 10 + index + 1}</>,
    },
    {
      title: t("title"),
      key: "title",
      render: (record) => <div>{record.name[lang]}</div>,
    },
    {
      title: t("region"),
      key: "region",
      render: (record) => <div>{record.region_name}</div>,
    },
    {
      title: t("restaurant"),
      key: "restaurant",
      render: (record) => (
        <div>{record?.shippers?.map((el) => el.shipper_name).join(", ")}</div>
      ),
    },
    {
      title: t("type"),
      key: "type",
      render: (record) => <div>{record.type}</div>,
    },
    {
      title: <TableChartIcon className="text-primary" />,
      key: "actions",
      render: (record, _) => (
        <ActionMenu
          id={record.id}
          actions={[
            permissions.put && {
              icon: <EditIcon />,
              color: "blue",
              title: t("change"),
              action: () => {
                history.push(`/home/marketing/text-banner/${record.id}`)
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

  const getItems = (page) => {
    setLoader(true)
    getTextBanners({ limit, page })
      .then((res) => {
        console.log(res)
        setItems({
          count: res.count,
          data: res.banners,
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
  return (
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
              items.data.length > 0 &&
              items.data.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  onClick={() => {
                    permissions.put &&
                      history.push(`/home/marketing/text-banner/${item.id}`)
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
  )
}
