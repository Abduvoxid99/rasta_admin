import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { Input } from "alisa-ui"
import Gallery from "../../../../components/Gallery"
import Select from "../../../../components/Select"
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import Button from "../../../../components/Button"
import LoaderComponent from "../../../../components/Loader"
import ReactQuill from "react-quill" // ES6
import "react-quill/dist/quill.snow.css" // ES6

import {
  createNewsletter,
  getNewsletterOne,
  updateNewsletter,
} from "../../../../services/push"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import TextArea from "../../../../components/Textarea"

export default function BannerForm() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const types = [
    { value: "branch_user", label: "Пользователь филиала" },
    { value: "customer", label: "Клиент" },
    { value: "courier", label: "Курьер" },
  ]
  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getNewsletterOne(id)
      .then((res) => {
        formik.setValues({
          title: res.title,
          body: res.body,
          receiver_type: types.find((item) => item.value === res.receiver_type),
          image: res.image
            ? res.image.replace(process.env.MINIO_BASE_URL, "")
            : "",
        })
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getItem()
  }, [])

  const initialValues = useMemo(
    () => ({
      title: "",
      body: "",
      receiver_type: null,
      image: "",
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      title: defaultSchema,
      body: defaultSchema,
      receiver_type: defaultSchema,
    })
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)
    data.receiver_type = data.receiver_type.value
    if (data.image) data.image = `/${data.image}`
    const selectedAction = id
      ? updateNewsletter(id, data)
      : createNewsletter(data)
    selectedAction
      .then(() => {
        history.goBack()
      })
      .catch(() => {
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

  if (loader) return <LoaderComponent isLoader={loader} />

  const routes = [
    {
      title: t("newsletter"),
      link: true,
      route: `/home/marketing/newsletter`,
    },
    {
      title: id ? formik.values?.title : t("create"),
    },
  ]

  const { values, handleChange, setFieldValue, handleSubmit } = formik

  const handler = (e) => {
    console.log(e)
  }
  const cardFooter = [
    <Button
      size="large"
      shape="outlined"
      color="red"
      borderColor="bordercolor"
      icon={CancelIcon}
      onClick={() => history.goBack()}
    >
      {t("cancel")}
    </Button>,
    <Button size="large" type="submit" icon={SaveIcon} loading={saveLoading}>
      {t("save")}
    </Button>,
  ]

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          // title={null}
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={cardFooter}
        />
        <div className="p-4 w-full flex flex-col gap-4 box-border font-body text-sm">
          <Card title={t("general.information")}>
            {/* <TabsWithFlags /> */}
            <div className="flex gap-8">
              <div>
                <Form.Item formik={formik} name="image">
                  <Gallery
                    multiple={false}
                    width={120}
                    aspectRatio="1"
                    gallery={values.image ? [values.image] : []}
                    setGallery={(elm) => {
                      setFieldValue("image", elm[0])
                    }}
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-4 items-baseline flex-1">
                <div className="input-label">{t("Загаловок")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="title">
                    {/* <ReactQuill id="title" value={values.title}
                      onChange={e => formik.setFieldValue('title', e)} /> */}
                    <Input
                      size="large"
                      id="title"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
                {/* <div>{t("title")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="title">
                    <Input size="large" />
                  </Form.Item>
                </div> */}
                <div className="input-label">{t("description")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="body">
                    {/* <ReactQuill id="body" value={values.body}
                      onChange={e => formik.setFieldValue('body', e)} /> */}
                    <TextArea
                      size={5}
                      name="body"
                      id="body"
                      value={values.body}
                      onChange={handleChange}
                    />
                    {/* <Input
                      size="large"
                      id="body"
                      value={values.body}
                      onChange={handleChange}
                    /> */}
                  </Form.Item>
                </div>
                <div className="input-label">{t("Тип получателя")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="receiver_type">
                    <Select
                      id="receiver_type"
                      options={types}
                      height={40}
                      value={values.receiver_type}
                      onChange={(val) =>
                        formik.setFieldValue("receiver_type", val)
                      }
                    />
                  </Form.Item>
                </div>

                {/* <div>{t("text")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="text">
                    <Input size="large" />
                  </Form.Item>
                </div>

                <div>{t("period (date)")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="text">
                    <RangePicker
                      hideTimePicker
                      style={{ height: 36 }}
                      placeholder={t("order.period")}
                    />
                  </Form.Item>
                </div>
                <div>{t("period (Time)")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="text">
                    <RangePicker
                      hideTimePicker
                      style={{ height: 36 }}
                      placeholder={t("order.period")}
                    />
                  </Form.Item>
                </div>

                <div>{t("type")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="type">
                    <RadioGroup
                      className="flex gap-4"
                      onChange={(val) => setFieldValue("type", val)}
                    >
                      <Radio checked={values.type === true} value={true}>
                        {t("scheduled")}
                      </Radio>
                      <Radio checked={values.type === false} value={false}>
                        {t("one-time")}
                      </Radio>
                    </RadioGroup>
                  </Form.Item>
                </div>
                <div>{t("restaurant")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="restaurant">
                    <Select height={36} />
                  </Form.Item>
                </div>
                <div>{t("status")}</div>
                <div className="col-span-3">
                  <Form.Item formik={formik} name="name">
                    <div className="flex items-center gap-3">
                      <Switch defaultChecked={true} />
                      Активный
                    </div>
                  </Form.Item>
                </div> */}
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
