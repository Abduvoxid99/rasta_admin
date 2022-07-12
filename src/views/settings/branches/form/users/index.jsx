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
import Pagination from "../../../../../components/Pagination"
import Card from "../../../../../components/Card"
import Modal from "../../../../../components/Modal"
import LoaderComponent from "../../../../../components/Loader"

//icons
import EditIcon from "@material-ui/icons/Edit"

import "./style.scss"
import {
  branchUsers,
  deleteBranchUser,
} from "../../../../../services/branchUsers"
import ActionMenu from "../../../../../components/ActionMenu"
import DeleteIcon from "@material-ui/icons/Delete"

export default function Users({ shipper_id, branch_id, permissions }) {
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
    deleteBranchUser(deleteModal.id)
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
      render: (record, index) => (
        <div>{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("first.name"),
      key: "name",
      render: (record) => <div>{record.name}</div>,
    },
    {
      title: t("phone.number"),
      key: "phone",
      render: (record) => <div>{record.phone}</div>,
    },
    {
      title: <div className="float-right"> {t("actions")}</div>,
      key: "actions",
      render: (record, _) => (
        <div className="float-right">
          <ActionMenu
            id={record.id}
            actions={[
              permissions.put && {
                icon: <EditIcon />,
                color: "blue",
                title: t("change"),
                action: () => {
                  history.push(
                    `/home/company/shipper-company/${shipper_id}/branches/${branch_id}/users/${record.id}`
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
        </div>
      ),
    },
  ]

  const getItems = (page) => {
    setLoader(true)
    branchUsers({ limit, page, shipper_id })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.branch_users,
        })
      })
      .finally(() => setLoader(false))
  }

  return (
    <div className="p-4">
      <Card>
        <TableContainer className="rounded-md border border-lightgray-1 mb-4">
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
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    key={item.id}
                    onClick={() => {
                      history.push(
                        `/home/company/shipper-company/${shipper_id}/branches/${branch_id}/users/${item.id}`
                      )
                    }}
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
        </TableContainer>

        <LoaderComponent isLoader={loader} />
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
        />
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
