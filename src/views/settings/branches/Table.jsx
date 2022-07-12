import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"

//components
import Card from "../../../components/Card"
import Pagination from "../../../components/Pagination"
import Modal from "../../../components/Modal"
import LoaderComponent from "../../../components/Loader"
import Service, { deleteBranch } from "../../../services/branch"

//icons
import ActionMenu from "../../../components/ActionMenu"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import TableChartIcon from "@material-ui/icons/TableChart"
import usePermissions from "../../../utils/usePermissions"
import StatusTag from "../../../components/Tag/StatusTag"
import { useSelector } from "react-redux"

const ApplicationTable = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const history = useHistory()
  const params = useParams()
  const { region_ids } = useSelector((state) => state.auth)
  const [deleteModal, setDeleteModal] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const branchPermission = usePermissions("shipper-company-branch")
  const [limit, setLimit] = useState(10)
  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteBranch(deleteModal.id, params.id)
      .then((res) => {
        getItems(currentPage, params.id)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  useEffect(() => {
    getItems(currentPage, params.id)
  }, [currentPage, params.id, limit])

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }

  const getItems = async (page, id) => {
    setLoader(true)
    clearItems()
    try {
      setItems({
        ...(await Service.getBranch(
          { page, limit, region_ids: region_ids.join(",") },
          id
        )),
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
  }

  const navigationRoute = (id) =>
    history.push(`/home/company/shipper-company/${params.id}/branches/${id}`)

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
    <div className="p-4">
      <Card footer={pagination}>
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>{t("branches")}</TableCell>
                <TableCell>{t("phone.number")}</TableCell>
                <TableCell>{t("status")}</TableCell>
                <TableCell>
                  <TableChartIcon className="text-primary" />
                </TableCell>
              </TableRow>
            </TableHead>
            {items.branches && items.branches.length ? (
              <TableBody>
                {items.branches.map(({ id, name, is_active, phone }, index) => (
                  <TableRow
                    onClick={() => branchPermission.put && navigationRoute(id)}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    key={id}
                  >
                    <TableCell>
                      <p>{(currentPage - 1) * 10 + index + 1}</p>
                    </TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{phone}</TableCell>
                    <TableCell>
                      <StatusTag
                        status={is_active}
                        color={!is_active ? "#F2271C" : "#0E73F6"}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="float-right">
                        <ActionMenu
                          id={id}
                          actions={[
                            branchPermission.put && {
                              icon: <EditIcon />,
                              color: "blue",
                              title: t("change"),
                              action: () => {
                                navigationRoute(id)
                              },
                            },
                            branchPermission.delete && {
                              icon: <DeleteIcon />,
                              color: "red",
                              title: t("delete"),
                              action: () => {
                                setDeleteModal({ id: id })
                              },
                            },
                          ]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <></>
            )}
          </Table>
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

export default ApplicationTable
