import React, { useEffect, useState } from "react"
import Form from "../../../components/Form/Index"
import Modal from "../../../components/Modal"
import Button from "../../../components/Button"
import AddIcon from "@material-ui/icons/Add"
import * as yup from "yup"
import EditIcon from "@material-ui/icons/Edit"
import { Input } from "alisa-ui"
import DeleteIcon from "@material-ui/icons/Delete"
import Pagination from "../../../components/Pagination"
import { numberToPrice } from "../../../utils/numberToPrice"
import { useFormik } from "formik"
import { useTranslation } from "react-i18next"
import {
  deleteFare,
  getFares,
  postFare,
  updateFare,
} from "../../../services/fares"
import { useHistory } from "react-router-dom"
import LoaderComponent from "../../../components/Loader"
import Select from "../../../components/Select"
import Card from "../../../components/Card"
import EmptyData from "../../../components/EmptyData"
import ActionMenu from "../../../components/ActionMenu"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { isNumber } from "../../../utils/inputHelpers"

export default function FaresTable({
  createModal,
  setCreateModal,
  permissions,
}) {
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [saveLoading, setSaveLoading] = useState(null)
  const [limit, setLimit] = useState()
  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, limit])

  const getItems = (page) => {
    setLoader(true)
    getFares({ limit, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.fares,
        })
      })
      .finally(() => setLoader(false))
  }
  const findType = [
    {
      label: `${t("fixed")}`,
      value: "fixed",
    },
    {
      label: `${t("not.fixed")}`,
      value: "not-fixed",
    },
  ]

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteFare(deleteModal.id)
      .then((res) => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  const onSubmit = (values) => {
    const data = {
      ...values,
      type: values?.type?.value,
    }
    data?.type === "fixed" && delete data.base_distance
    data?.type === "fixed" && delete data.price_per_km

    setSaveLoading(true)
    const selectedAction = createModal.id
      ? updateFare(createModal.id, data)
      : postFare(data)
    selectedAction
      .then((res) => {
        getItems(currentPage)
      })
      .finally(() => {
        setSaveLoading(false)
        closeModal()
      })
  }

  const formik = useFormik({
    initialValues: {
      base_price: null,
      type: null,
      base_distance: null,
      price_per_km: null,
    },
    validationSchema: yup.object().shape({
      base_price: yup.mixed().required(t("required.field.error")),
      type: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit,
  })

  const closeModal = () => {
    setCreateModal(null)
    formik.resetForm()
  }

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: t("name"),
      key: "name",
      render: (record) => record.name,
    },
    {
      title: t("price"),
      key: "base_price",
      render: (record) => <>{numberToPrice(record.base_price, "сум")}</>,
    },
    {
      title: t("type"),
      key: "type",
      render: (record) => (
        <div>
          {record.type === "fixed"
            ? t("fixed")
            : "not-fixed"
            ? t("not.fixed")
            : " "}
        </div>
      ),
    },
    {
      title: "", // t("actions"),
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
                action: () => history.push(`/home/settings/fares/${record.id}`),
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

  const { values, handleChange, setFieldValue, handleSubmit } = formik

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
      <TableContainer className="rounded-md border border-lightgray-1">
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
              items.data.map((elm, index) => (
                <TableRow
                  key={elm.id}
                  onClick={() =>
                    permissions.put &&
                    history.push(`/home/settings/fares/${elm.id}`)
                  }
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(elm, index) : "----"}
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
      {/* <Pagination title={t("general.count")} count={items?.count} onChange={pageNumber => setCurrentPage(pageNumber)} /> */}

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />

      <Modal
        open={createModal}
        title={t(createModal?.id ? "update" : "create")}
        footer={null}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 py-8">
            <div>
              <Form.Item formik={formik} name="type" label={t("type")}>
                <Select
                  id="type"
                  options={findType}
                  value={values.type}
                  defaultValue={findType[0]}
                  onChange={(val) => {
                    setFieldValue("type", val)
                  }}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item formik={formik} name="base_price" label={t("price")}>
                <Input
                  type="number"
                  onKeyDown={(event) => {
                    if (event.keyCode === 38 || event.keyCode === 40) {
                      event.preventDefault()
                    }
                  }}
                  onKeyPress={isNumber}
                  id="base_price"
                  value={values.base_price}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>

          <div
            className={`${
              values?.type?.value === "fixed" ? "hidden" : " "
            } grid grid-cols-1 sm:grid-cols-2 gap-x-3 py-8`}
          >
            <div>
              <Form.Item
                formik={formik}
                name="base_distance"
                label={t("base.distance")}
              >
                <Input
                  type="number"
                  id="base_distance"
                  onKeyDown={(event) => {
                    if (event.keyCode === 38 || event.keyCode === 40) {
                      event.preventDefault()
                    }
                  }}
                  onKeyPress={isNumber}
                  value={values.base_distance}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                formik={formik}
                name="price_per_km"
                label={t("price.per.km")}
              >
                <Input
                  type="number"
                  id="price_per_km"
                  onKeyPress={isNumber}
                  value={values.price_per_km}
                  onChange={handleChange}
                  onKeyDown={(event) => {
                    if (event.keyCode === 38 || event.keyCode === 40) {
                      event.preventDefault()
                    }
                  }}
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="large"
              loading={saveLoading}
              icon={createModal?.id ? EditIcon : AddIcon}
            >
              {t(createModal?.id ? "update" : "add")}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  )
}
