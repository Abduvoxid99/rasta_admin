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

//components
import Pagination from "../../../components/Pagination"
import Card from "../../../components/Card"
import Modal from "../../../components/Modal"
import LoaderComponent from "../../../components/Loader"
import { deleteRegion, getRegions } from "../../../services/region"
import ActionMenu from "../../../components/ActionMenu"

//icons
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import TableChartIcon from "@material-ui/icons/TableChart"

import "./style.scss"
import EmptyData from "../../../components/EmptyData"

export default function TableGeofence({ permissions }) {
  const [loader, setLoader] = useState(false)
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [limit, setLimit] = useState(10)
  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteRegion(deleteModal.id)
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
      render: (_, index) => <>{(currentPage - 1) * 10 + index + 1}</>,
    },
    {
      title: t("name"),
      key: "name",
      render: (record) => <div>{record.name}</div>,
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
                history.push(
                  `/home/settings/geofence/${record.geozone_id}/${record.id}`
                )
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
    getRegions({ limit, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.regions,
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
                  onClick={() => {
                    history.push(
                      `/home/settings/geofence/${item.geozone_id}/${item.id}`
                    )
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
      {/*<Pagination title={t("general.count")} count={items?.count}*/}
      {/*            onChange={pageNumber => setCurrentPage(pageNumber)} />*/}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />
    </Card>
  )
}
