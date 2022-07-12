import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"

import Card from "../../../components/Card"
import Modal from "../../../components/Modal"
import EmptyData from "../../../components/EmptyData"
import ActionMenu from "../../../components/ActionMenu"
import Pagination from "../../../components/Pagination"
import LoaderComponent from "../../../components/Loader"
import noPictures from "../../../assets/images/no-pictures.png"

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
import PhotoSizeSelectActualOutlinedIcon from "@material-ui/icons/PhotoSizeSelectActualOutlined"
import { deleteStories, getStories } from "../../../services/stories"

export default function BannersTable({ permissions }) {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, limit])

  const getItems = (page) => {
    setLoader(true)
    getStories({ limit, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.stories,
        })
      })
      .finally(() => setLoader(false))
  }

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteStories(deleteModal.id)
      .then(() => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  const ImageContainer = ({ url, alt = "banner image" }) => (
    <div className="w-20 h-20 rounded-md overflow-hidden relative">
      {url ? (
        <img
          className="absolute w-full h-full object-cover"
          src={url}
          alt={alt}
        />
      ) : (
        <PhotoSizeSelectActualOutlinedIcon
          style={{ fontSize: "80px", color: "#bfbfbf" }}
        />
      )}
    </div>
  )

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => <>{(currentPage - 1) * 10 + index + 1}</>,
    },
    {
      title: t("Заголовок"),
      key: "title",
      dataIndex: "title",
    },
    {
      title: t("image"),
      key: "image",
      render: (record) => (
        <div className="flex justify-center">
          <ImageContainer url={record.image} />
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
                history.push(`/home/marketing/stories/${record.id}`),
            },
            permissions.delete && {
              title: t("delete"),
              icon: <DeleteIcon />,
              color: "red",
              action: () => {
                setDeleteModal({
                  id: record.id,
                })
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
          pageCount={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
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
                items.data.length > 0 &&
                items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    onClick={() => {
                      permissions.put &&
                        history.push(`/home/marketing/stories/${item.id}`)
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
