import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { Input } from "alisa-ui"

//components and functions
import Form from "../../../components/Form/Index"
import Breadcrumb from "../../../components/Breadcrumb"
import Header from "../../../components/Header"
import Card from "../../../components/Card"
import Button from "../../../components/Button"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import CustomSkeleton from "../../../components/Skeleton"
import { getPayme, updatePayme } from "../../../services/payme"

export default function UpdatePayme() {
  const history = useHistory()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)

  const getItem = () => {
    setLoader(true)
    getPayme()
      .then((res) => {
        formik.setValues({
          merchant_id: res.merchant_id,
          merchant_key: res.merchant_key,
          // base64_key: res.base64_key,
        })
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getItem()
  }, [])

  const initialValues = useMemo(
    () => ({
      merchant_id: "",
      merchant_key: "",
      // base64_key: "",
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      merchant_id: defaultSchema,
      merchant_key: defaultSchema,
      // base64_key: defaultSchema,
    })
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = updatePayme(data)
    selectedAction
      .then(() => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    saveChanges(values)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  if (loader) return <CustomSkeleton />

  const routes = [
    {
      title: t("Payme"),
      link: true,
      route: `/home/settings/payme`,
    },
  ]

  const { values, handleChange, handleSubmit } = formik

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={[
            <Button
              icon={CancelIcon}
              size="large"
              shape="outlined"
              color="red"
              borderColor="bordercolor"
              onClick={(e) => history.go(-1)}
            >
              {t("cancel")}
            </Button>,
            <Button
              icon={SaveIcon}
              size="large"
              type="submit"
              loading={saveLoading}
            >
              {t("save")}
            </Button>,
          ]}
        />

        <div className="p-4">
          <div className="w-full grid grid-cols-12 gap-4">
            <Card title={t("setting")} className="col-span-12">
              <div className="flex items-baseline">
                <span className="w-1/4 input-label">{t("Мерчант ID")}</span>
                <div className="w-3/4">
                  <Form.Item formik={formik} name="merchant_id">
                    <Input
                      size="large"
                      id="merchant_id"
                      value={values.merchant_id}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="w-1/4 input-label">{t("Мерчант KEY")}</span>
                <div className="w-3/4">
                  <Form.Item formik={formik} name="merchant_key">
                    <Input
                      size="large"
                      id="merchant_key"
                      value={values.merchant_key}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
              {/* <div className="flex items-baseline">
                <span className="w-1/4 input-label">{t("base64_key")}</span>
                <div className="w-3/4">
                  <Form.Item formik={formik} name="base64_key">
                    <Input
                      size="large"
                      id="base64_key"
                      value={values.base64_key}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div> */}
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
