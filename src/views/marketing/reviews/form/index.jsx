import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { CircularProgress } from "@material-ui/core"
import { Input } from "alisa-ui"

//components and functions
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import Button from "../../../../components/Button"
import Select from "../../../../components/Select"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import {
  getOneReview,
  postReviews,
  updateReviws,
} from "../../../../services/reviews"
import Switch from "../../../../components/Switch"

export default function CreateBanner() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const lang = useSelector((state) => state.lang.current)
  const subjects = [
    {
      label: "Оператор",
      value: "operator",
    },
    {
      label: "Курьер",
      value: "courier",
    },
    {
      label: "Срок доставки",
      value: "delivery_time",
    },
    {
      label: "Еда",
      value: "food",
    },
  ]
  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getOneReview(id)
      .then((res) => {
        formik.setValues({
          message: res.message,
          related_subject: subjects.find(
            (item) => item.value === res.related_subject
          ),
          type: res.type === "like" ? true : false,
        })
      })
      .finally(() => setLoader(false))
  }

  const initialValues = useMemo(
    () => ({
      message: { en: "", ru: "", uz: "" },
      related_subject: null,
      type: false,
    }),
    []
  )

  useEffect(() => {
    getItem()
  }, [])

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      message: yup.object({
        en: defaultSchema,
        ru: defaultSchema,
        uz: defaultSchema,
      }),
      related_subject: defaultSchema,
      type: defaultSchema,
    })
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = id ? updateReviws(id, data) : postReviews(data)
    selectedAction
      .then(() => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    const data = {
      ...values,
      related_subject: values.related_subject.value,
      type: values.type ? "like" : "dislike",
    }

    saveChanges(data)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  if (loader)
    return (
      <div className="w-full flex align-center justify-center">
        <CircularProgress />
      </div>
    )

  const routes = [
    {
      title: t("reviews"),
      link: true,
      route: "/home/marketing/reviews",
    },
    {
      title: id ? formik.values?.message[lang] : t("create"),
    },
  ]

  const { values, handleChange, setFieldValue, handleSubmit } = formik

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
              {t(id ? "save" : "create")}
            </Button>,
          ]}
        />
        <div className="p-4 w-full flex flex-col gap-4 box-border font-body text-sm">
          <Card title={t("Добавить новый отзыв")}>
            <div className="w-full grid grid-cols-12 gap-8">
              <div className="col-span-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 items-end">
                  <div>
                    <Form.Item
                      formik={formik}
                      name="message.uz"
                      label={t("name.in.uz")}
                    >
                      <Input
                        size="large"
                        id="message.uz"
                        value={values.message?.uz}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="message.ru"
                      multiLangValid={{
                        name: "message",
                        lang: "ru",
                      }}
                      label={t("name.in.ru")}
                    >
                      <Input
                        size="large"
                        id="message.ru"
                        value={values.message?.ru}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="message.en"
                      multiLangValid={{
                        name: "message",
                        lang: "en",
                      }}
                      label={t("name.in.en")}
                    >
                      <Input
                        size="large"
                        id="message.en"
                        value={values.message?.en}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item
                      formik={formik}
                      name="related_subject"
                      label={t("Относится к")}
                    >
                      <Select
                        height={40}
                        id="related_subject"
                        options={subjects}
                        value={values.related_subject}
                        onChange={(val) => {
                          setFieldValue("related_subject", val)
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex">
                    <div>
                      <Form.Item
                        formik={formik}
                        name="related_subject"
                        label={t("Тип")}
                      >
                        <div
                          className="flex items-center"
                          style={{ height: "42px" }}
                        >
                          <Switch
                            color="primary"
                            checked={values.type}
                            onChange={(val) => {
                              setFieldValue("type", val)
                            }}
                          />
                          <div className="input-label ml-2">
                            {values.type ? "Позитивный" : "Негативный"}
                          </div>
                        </div>
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
