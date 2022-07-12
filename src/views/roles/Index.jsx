import { useEffect, useState } from "react"
import Table from "@material-ui/core/Table"
import TableRow from "@material-ui/core/TableRow"
import Card from "../../components/Card"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import Header from "../../components/Header"
import { useHistory } from "react-router-dom"
import TableContainer from "@material-ui/core/TableContainer"
import { useTranslation } from "react-i18next"
import EditIcon from "@material-ui/icons/Edit"
import Pagination from "../../components/Pagination"
import Button from "../../components/Button"
import AddIcon from "@material-ui/icons/Add"
import { deleteUserRole, getUserRoles } from "../../services/userRoles"
import Modal from "../../components/Modal"
import LoaderComponent from "../../components/Loader"
import usePermissions from "../../utils/usePermissions"
import EmptyData from "../../components/EmptyData"
import DeleteIcon from "@material-ui/icons/Delete"
import ActionMenu from "../../components/ActionMenu"

export default function OrganizationsList() {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const permissions = usePermissions("operator-role-list")
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, limit])

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteUserRole(deleteModal.id)
      .then((_) => {
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
      key: "name",
      render: (record) => <div>{record.name}</div>,
    },
    {
      title: "",
      key: "actions",
      render: (record, _) => (
        <div className="flex gap-2">
          <ActionMenu
            id={record.id}
            actions={[
              permissions.put && {
                title: t("edit"),
                color: "blue",
                icon: <EditIcon />,
                action: () =>
                  history.push(`/home/settings/role/list/${record.id}`),
              },
              permissions.delete && {
                title: t("delete"),
                color: "red",
                icon: <DeleteIcon />,
                action: () => setDeleteModal({ id: record.id }),
              },
            ]}
          />
        </div>
      ),
    },
  ]

  const getItems = (page) => {
    setLoader(true)
    getUserRoles({ limit, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.user_roles,
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
    <div>
      <Header
        title={t("roles")}
        endAdornment={[
          permissions.post && (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() => history.push("/home/settings/role/list/create")}
            >
              {t("add")}
            </Button>
          ),
        ]}
      />

      <Card className="m-4" footer={pagination}>
        {permissions.get && (
          <TableContainer className="rounded-lg border border-lightgray-1">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {initialColumns.map((elm) => (
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
                      onClick={() =>
                        permissions.put &&
                        history.push(`/home/settings/role/list/${item.id}`)
                      }
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    >
                      {initialColumns.map((col) => (
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
        )}
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
