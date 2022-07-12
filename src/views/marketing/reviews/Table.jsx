import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import ThumbUpIcon from "@material-ui/icons/ThumbUp"
import Card from "../../../components/Card"
import Modal from "../../../components/Modal"
import EmptyData from "../../../components/EmptyData"
import ActionMenu from "../../../components/ActionMenu"
import Pagination from "../../../components/Pagination"
import LoaderComponent from "../../../components/Loader"
import {} from "../../../services"
import StatusTag from "../../../components/Tag/StatusTag"

// Material-ui
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { deleteReviews, getReviews } from "../../../services/reviews"

export default function ReviewsTable() {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)

  useEffect(() => {}, [])

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage])

  const getItems = (page) => {
    setLoader(true)
    getReviews({ limit: 10, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.reviews,
        })
      })
      .finally(() => setLoader(false))
  }

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteReviews(deleteModal.id)
      .then((res) => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <div>{(currentPage - 1) * 10 + index + 1}</div>,
    },
    {
      title: t("name"),
      key: "message.ru",
      render: (record, index) => <div>{record.message.ru}</div>,
    },
    {
      title: t("Тип"),
      key: "type",
      render: (record) => (
        <>
          <ThumbUpIcon
            style={{
              color: record.type === "like" ? "#408106" : "#f04732",
              transform: record.type === "like" ? "" : "rotate(-180deg)",
            }}
          />
        </>
      ),
    },
    // {
    //   title: t("status"),
    //   key: "actice",
    //   render: (record) => (
    //     <StatusTag
    //       status={record.active}
    //       color={!record.active ? "#F2271C" : "#0452C8"}
    //     />
    //   ),
    // },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <ActionMenu
          id={record.id}
          actions={[
            {
              title: t("edit"),
              icon: <EditIcon />,
              color: "blue",
              action: () =>
                history.push(`/home/marketing/reviews/${record.id}`),
            },
            {
              title: t("delete"),
              icon: <DeleteIcon />,
              color: "red",
              action: () => {
                setDeleteModal({ id: record.id })
              },
            },
          ]}
        />
      ),
    },
  ]

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      }
    >
      {!loader && (
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
                    onClick={() =>
                      history.push(`/home/marketing/reviews/${item.id}`)
                    }
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
      )}

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
