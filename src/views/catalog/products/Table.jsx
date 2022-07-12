import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

//components
import Tag from "../../../components/Tag/"
import Pagination from "../../../components/Pagination"
import { deleteNew, getNews } from "../../../services/news"
import Card from "../../../components/Card"
import Modal from "../../../components/Modal"
import ActionMenu from "../../../components/ActionMenu"

//icons
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import LoaderComponent from "../../../components/Loader"
import TableChartIcon from "@material-ui/icons/TableChart"
import EmptyData from "../../../components/EmptyData"
import { deleteNewProduct, getNewProducts } from "../../../services/newProducts"

export default function ProductsCollectionTable({ permissions }) {
  const { t } = useTranslation()
  const history = useHistory()
  const lang = useSelector((state) => state.lang.current)
  const [loader, setLoader] = useState(true)
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
    getNewProducts({ limit, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.new_pro_get_all?.map((el) => {
            const shippers = []
            el.products?.forEach((el) => {
              if (!shippers.includes(el.shipper_name))
                shippers.push(el.shipper_name)
            })

            return {
              ...el,
              shippers,
            }
          }),
        })
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoader(false))
  }

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteNewProduct(deleteModal.id)
      .then((res) => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
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
            <TableRow className="bg-gray-100">
              <TableCell>№</TableCell>
              <TableCell>{t("name")}</TableCell>
              {/* <TableCell>{t("description")}</TableCell> */}
              <TableCell>{t("restaurants")}</TableCell>
              <TableCell>
                <TableChartIcon className="text-primary" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.data &&
              items.data.length > 0 &&
              items.data.map(({ name, description, shippers, id }, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 1 ? "bg-gray-50" : ""}
                  onClick={() => {
                    permissions.put &&
                      history.push(`/home/marketing/products-collection/${id}`)
                  }}
                >
                  <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>

                  <TableCell>{name[lang] ? name[lang] : "----"}</TableCell>
                  {/* <TableCell>
                    {description[lang] ? description[lang] : "----"}
                  </TableCell> */}

                  <TableCell>
                    {shippers.map((shipper) => (
                      <div>
                        <Tag
                          className="text-info w-2/4 mt-2 shadow-sm"
                          children={shipper}
                          key={index}
                        />
                      </div>
                    ))}
                  </TableCell>

                  <TableCell align="center">
                    {/*<IconButton*/}
                    {/*  className="ml-2 mr-2 "*/}
                    {/*  icon={<Edit />}*/}
                    {/*  onClick={() => history.push(`/home/catalog/news/${id}`)}*/}
                    {/*/>*/}
                    {/*<IconButton onClick={() => setDeleteModal({ id: id })} icon={<Delete />} color="red" />*/}
                    <ActionMenu
                      id={id}
                      actions={[
                        permissions.put && {
                          icon: <EditIcon />,
                          color: "blue",
                          title: t("change"),
                          action: () => {
                            history.push(`/home/marketing/news/${id}`)
                          },
                        },
                        permissions.delete && {
                          icon: <DeleteIcon />,
                          color: "red",
                          title: t("delete"),
                          action: () => {
                            setDeleteModal({ id: id })
                          },
                        },
                      ]}
                    />
                  </TableCell>
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
