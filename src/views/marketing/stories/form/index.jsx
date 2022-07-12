import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { Input } from "alisa-ui"
import Gallery from "../../../../components/Gallery"
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import Button from "../../../../components/Button"
import LoaderComponent from "../../../../components/Loader"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import {
  createStories,
  getStoriesOne,
  updateStories,
} from "../../../../services/stories"

export default function StoriesForm() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)

  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getStoriesOne(id)
      .then((res) => {
        formik.setValues({
          title: res.title,
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

      image: "",
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      title: defaultSchema,
      image: defaultSchema,
    })
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)

    if (data.image) data.image = `/${data.image}`
    const selectedAction = id ? updateStories(id, data) : createStories(data)
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

  if (loader) return <LoaderComponent isLoader={loader} />

  const routes = [
    {
      title: t("Сторис"),
      link: true,
      route: `/home/marketing/stories`,
    },
    {
      title: id ? formik.values?.title : t("create"),
    },
  ]

  const { values, handleChange, setFieldValue, handleSubmit } = formik

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
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={cardFooter}
        />
        <div className="p-4 w-full flex flex-col gap-4 box-border font-body text-sm">
          <Card title={t("general.information")}>
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
              <div className="grid grid-cols-12 gap-2 items-baseline flex-1">
                <div className="input-label col-span-2">{t("Загаловок")}</div>
                <div className="col-span-10">
                  <Form.Item formik={formik} name="title">
                    <Input
                      size="large"
                      id="title"
                      value={values.title}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
