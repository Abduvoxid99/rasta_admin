import React, { useEffect, useState } from "react"
import Modal from "../../../../components/Modal"
import Button from "../../../../components/Button"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import CloseIcon from "@material-ui/icons/Close"
import Form from "../../../../components/Form/Index"
import { Input } from "alisa-ui"
import Select from "../../../../components/Select"
import Switch from "../../../../components/Switch"
import { useParams } from "react-router"
import { getBranches } from "../../../../services"

export default function ProductStopModal({
  open,
  onClose,
  isClose = true,
  onSubmit,
  ...props
}) {
  const { t } = useTranslation()
  const { shipper_id } = useParams()
  const [branches, setBranches] = useState([])
  const formik = useFormik({
    initialValues: {
      time_stamp: "",
      is_active: null,
      branch_id: null,
    },
    validationSchema: yup.object().shape(
      {
        //is_active: yup.mixed().required(t("required.field.error")),
        is_active: yup.mixed().when(["time_stamp"], {
          is: (time_stamp) => !time_stamp,
          then: yup.mixed().required(t("required.field.error")),
        }),
        time_stamp: yup.mixed().when(["is_active"], {
          is: (is_active) => !is_active,
          then: yup.mixed().required(t("required.field.error")),
        }),
      },
      [["is_active", "time_stamp"]]
    ),
    onSubmit: (values) => {
      onSubmit(values, formik.resetForm)
    },
  })

  const handleClose = () => {
    onClose()
    formik.resetForm()
  }

  useEffect(async () => {
    const { branches: data } = await getBranches({ limit: 1000 }, shipper_id)
    setBranches(
      data ? data.map((elm) => ({ label: elm.name, value: elm.id })) : []
    )
  }, [])

  const { values, handleChange, setFieldValue } = formik

  return (
    <Modal
      title={null}
      footer={null}
      width={500}
      open={open}
      onClose={isClose && handleClose}
      {...props}
      style={{ padding: "0" }}
      header={
        <div className="flex justify-between items-start px-4 py-3 border-b">
          <span className="text-md font-medium">
            Стоп продукта
            <div className="text-sm font-normal mt-3">
              Выберите на какое время вы хотите остановить продукт
            </div>
          </span>
          <span className="cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </span>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 items-baseline">
            <div className="input-label">Период (дата и время)</div>
            <Form.Item formik={formik} name="time_stamp">
              <Input
                size="large"
                id="time_stamp"
                max="9999-12-31T00:00"
                value={values.duration}
                onChange={handleChange}
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 items-baseline">
            <Form.Item formik={formik} name="branch_id">
              <div className="input-label">Филиал</div>
              <Select
                id="branch_id"
                options={branches}
                height={40}
                value={values.branch}
                onChange={(val) => setFieldValue("branch_id", val)}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 items-baseline">
            <div className="input-label">Отключить навсегда</div>
            <Form.Item formik={formik} name="is_active">
              <Switch
                checked={values.is_active}
                onChange={(e) => {
                  setFieldValue("is_active", e)
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 border-t">
          <Button
            classNameParent="w-full"
            size="medium"
            shape="outlined"
            style={{ width: "100%" }}
            onClick={handleClose}
            borderColor="bordercolor"
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            classNameParent="w-full"
            size="medium"
            style={{ width: "100%" }}
          >
            {t("save")}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
