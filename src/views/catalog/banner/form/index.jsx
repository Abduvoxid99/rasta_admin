import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { CircularProgress } from "@material-ui/core"
import { Input } from "alisa-ui"
import ReactQuill from "react-quill" // ES6
import "react-quill/dist/quill.snow.css" // ES6
//components and functions
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import Button from "../../../../components/Button"
import Gallery from "../../../../components/Gallery"
import {
  getOneBanner,
  postBanner,
  updateBanner,
} from "../../../../services/banner"
import Select, { customStyles } from "../../../../components/Select"
import { getRegions } from "../../../../services/region"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { getPromotions } from "../../../../services/promotion"
import { getMenuProducts, getShippers } from "../../../../services"
import { AsyncPaginate } from "react-select-async-paginate"
import { isNumber } from "../../../../utils/inputHelpers"
import TextArea from "../../../../components/Textarea"

export default function CreateBanner() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const [promotions, setPormotions] = useState([])
  const [shippers, setShippers] = useState([])
  const [asyncProduct, setAsyncProduct] = useState(true)
  const [regions, setRegions] = useState([])
  const [validHours, setValidHours] = useState(false)
  const lang = useSelector((state) => state.lang.current)

  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getOneBanner(id)
      .then((res) => {
        formik.setValues({
          title: res.title,
          description: res.description,
          image: res.image.replace(process.env.MINIO_BASE_URL, ""),
          region: {
            label: res.region_name,
            value: res.region_id,
          },
          start_date: res.start_date,
          end_date: res.end_date,
          promotion: res.promotion_name && {
            label: res.promotion_name.ru,
            value: res.promotion_id,
          },
          shipper: res.shipper_name && {
            label: res.shipper_name,
            value: res.shipper_id,
          },
          product: res.product_name && {
            label: res.product_name.ru,
            value: res.promotion_id,
          },
          order_no: +res.order_no,
        })
        setWeekArray((prev) =>
          prev.map((item, index) => ({
            ...item,
            value: {
              startDate: res.daily_start_times[index],
              endDate: res.daily_end_times[index],
            },
          }))
        )
      })
      .finally(() => setLoader(false))
  }

  const fetchData = async () => {
    setLoader(true)
    try {
      const { regions } = await getRegions({ limit: 1000 })
      setRegions(
        regions
          ? regions.map((elm) => ({ label: elm.name, value: elm.id }))
          : []
      )
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }
  const getPromotionsData = () => {
    getPromotions().then((res) => {
      setPormotions(
        res.promotions
          .filter((item) => item.name)
          .map((item) => ({
            value: item.id,
            label: item.name?.ru,
          }))
      )
    })
  }

  const getProductsData = async (search, limit, page, shipper_id) => {
    return getMenuProducts({ limit, search, page, shipper_id })
  }

  useEffect(() => {
    fetchData()
    getItem()
    getPromotionsData()
    getShippersData()
  }, [])

  const initialValues = useMemo(
    () => ({
      image: null,
      title: { en: "", ru: "", uz: "" },
      description: { en: "", ru: "", uz: "" },
      region: null,
      end_date: "",
      start_date: "",
      promotion: null,
      shipper: null,
      product: null,
      order_no: 0,
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape(
      {
        title: yup.object({
          en: defaultSchema,
          ru: defaultSchema,
          uz: defaultSchema,
        }),
        end_date: defaultSchema,
        order_no: defaultSchema,
        image: defaultSchema,
        start_date: defaultSchema,
        region: defaultSchema,
        // promotion: yup.mixed().when(["shipper", "product"], {
        //   is: (shipper, product) => !shipper && !product,
        //   then: defaultSchema,
        // }),
        // shipper: yup.mixed().when(["promotion", "product"], {
        //   is: (promotion, product) => !promotion && !product,
        //   then: defaultSchema,
        // }),
        // product: yup.mixed().when(["promotion", "shipper"], {
        //   is: (promotion, shipper) => !promotion && !shipper,
        //   then: defaultSchema,
        // }),
      },
      [
        ["shipper", "product"],
        ["promotion", "shipper"],
        ["promotion", "product"],
      ]
    )
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = id ? updateBanner(id, data) : postBanner(data)
    selectedAction
      .then(() => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    let isCheckHours = false

    weekArray.forEach((val) => {
      if (val.value.startDate === "" || val.value.endDate === "") {
        isCheckHours = true
        return
      }
    })

    if (isCheckHours) {
      setValidHours(isCheckHours)
      return
    }
    const data = {
      ...values,
      position: "something",
      image: `/${values.image}`,
      region_id: values.region.value,
      promotion_id: values.promotion?.value,
      shipper_id: values.shipper?.value,
      product_id: values.product?.value,
      daily_start_times: weekArray.map((item) => item.value.startDate),
      daily_end_times: weekArray.map((item) => item.value.endDate),
    }
    delete data.region
    delete data.promotion
    delete data.product
    delete data.shipper
    saveChanges(data)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const getShippersData = () => {
    if (formik.values.region)
      getShippers({ limit: 1000, region_ids: formik.values.region.value }).then(
        (res) => {
          setShippers(
            res.shippers.map((item) => ({
              value: item.id,
              label: item.name,
            }))
          )
        }
      )
  }

  const [weekArray, setWeekArray] = useState([
    {
      id: 1,
      title: "monday",
      isChecked: true,
      value: {
        startDate: "08:00",
        endDate: "22:00",
      },
    },
    {
      id: 2,
      title: "tuesday",
      isChecked: true,
      value: {
        startDate: "08:00",
        endDate: "22:00",
      },
    },
    {
      id: 3,
      title: "wednesday",
      isChecked: true,
      value: {
        startDate: "08:00",
        endDate: "22:00",
      },
    },
    {
      id: 4,
      title: "thursday",
      isChecked: true,
      value: {
        startDate: "08:00",
        endDate: "22:00",
      },
    },
    {
      id: 5,
      title: "friday",
      isChecked: true,
      value: {
        startDate: "08:00",
        endDate: "22:00",
      },
    },
    {
      id: 6,
      title: "saturday",
      isChecked: true,
      value: {
        startDate: "08:00",
        endDate: "22:00",
      },
    },
    {
      id: 7,
      title: "sunday",
      isChecked: true,
      value: {
        startDate: "08:00",
        endDate: "22:00",
      },
    },
  ])

  useEffect(() => {
    getShippersData()
  }, [formik.values.region])

  if (loader)
    return (
      <div className="w-full flex align-center justify-center">
        <CircularProgress />
      </div>
    )

  const routes = [
    {
      title: t("banners"),
      link: true,
      route: "/home/marketing/banners",
    },
    {
      title: id ? formik.values?.title[lang] : t("create"),
    },
  ]

  const loadOptions = async (search, prevOptions, { page }) => {
    const res = await getProductsData(
      search,
      10,
      page,
      formik.values.shipper.value
    )

    const hasMore = res.count > prevOptions.length + 10
    return {
      options: res.products?.map((elm) => ({
        label: elm.name.ru,
        value: elm.id,
        elm,
      })),
      hasMore,
      additional: {
        page: page + 1,
      },
    }
  }

  const handleChangeTimes = (event, id, action) => {
    setWeekArray((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              value: {
                ...item.value,
                [action]: event.target.value,
              },
            }
          : item
      )
    )
  }

  // const changeWeekArray = (e) => {
  //   setWeekArray((prev) =>
  //     prev.map((item) =>
  //       String(item.id) === e.target.value
  //         ? {
  //             ...item,
  //             value: {
  //               startDate: "",
  //               endDate: "",
  //             },
  //             isChecked: !item.isChecked,
  //           }
  //         : item
  //     )
  //   )
  // }

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
          <Card title={t("add.new.banner")}>
            <div className="w-full grid grid-cols-12 gap-8">
              <div className="col-span-12 sm:col-span-2 text-center">
                <Form.Item formik={formik} name="image">
                  <Gallery
                    width="100%"
                    aspectRatio="1"
                    gallery={values.image ? [values.image] : []}
                    setGallery={(elm) => {
                      setFieldValue("image", elm[0])
                    }}
                    multiple={false}
                  />
                </Form.Item>
                <span className="text-primary">{t("Изображение товара")}</span>
              </div>
              <div className="col-span-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 items-end">
                  <div>
                    <Form.Item
                      formik={formik}
                      name="title.uz"
                      label={t("name.in.uz")}
                    >
                      <ReactQuill
                        id="title"
                        value={values.title?.uz}
                        onChange={(e) => formik.setFieldValue("title.uz", e)}
                      />
                      {/* <Input
                        size="large"
                        id="title.uz"
                        value={values.title?.uz}
                        onChange={handleChange}
                      /> */}
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="title.ru"
                      multiLangValid={{
                        name: "title",
                        lang: "ru",
                      }}
                      label={t("name.in.ru")}
                    >
                      <ReactQuill
                        id="title.ru"
                        value={values.title?.ru}
                        onChange={(e) => formik.setFieldValue("title.ru", e)}
                      />
                      {/* <Input
                        size="large"
                        id="title.ru"
                        value={values.title?.ru}
                        onChange={handleChange}
                      /> */}
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="title.en"
                      multiLangValid={{
                        name: "title",
                        lang: "en",
                      }}
                      label={t("name.in.en")}
                    >
                      <ReactQuill
                        id="title.en"
                        value={values.title?.en}
                        onChange={(e) => formik.setFieldValue("title.en", e)}
                      />
                      {/* <Input
                        size="large"
                        id="title.en"
                        value={values.title?.en}
                        onChange={handleChange}
                      /> */}
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item
                      formik={formik}
                      name="description.uz"
                      label={t("description.in.uz")}
                    >
                      <ReactQuill
                        id="description.uz"
                        value={
                          values.description ? values?.description?.uz : ""
                        }
                        onChange={(e) =>
                          formik.setFieldValue("description.uz", e)
                        }
                      />
                      {/* <TextArea
                        rows={3}
                        size="large"
                        id="description.uz"
                        value={values.description?.uz}
                        onChange={handleChange}
                      /> */}
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="description.ru"
                      multiLangValid={{
                        name: "description",
                        lang: "ru",
                      }}
                      label={t("description.in.ru")}
                    >
                      <ReactQuill
                        id="description.ru"
                        value={values.description ? values.description?.ru : ""}
                        onChange={(e) =>
                          formik.setFieldValue("description.ru", e)
                        }
                      />
                      {/* <TextArea
                        rows={3}
                        size="large"
                        id="description.ru"
                        value={values.description?.ru}
                        onChange={handleChange}
                      /> */}
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="description.en"
                      multiLangValid={{
                        name: "description",
                        lang: "en",
                      }}
                      label={t("description.in.en")}
                    >
                      <ReactQuill
                        id="description.en"
                        value={
                          values.description ? values?.description?.en : ""
                        }
                        onChange={(e) =>
                          formik.setFieldValue("description.en", e)
                        }
                      />
                      {/* <TextArea
                        rows={3}
                        size="large"
                        id="description.en"
                        value={values.description?.en}
                        onChange={handleChange}
                      /> */}
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item
                      formik={formik}
                      name="start_date"
                      label={t("От")}
                    >
                      <Input
                        type="date"
                        size="large"
                        id="start_date"
                        value={formik.values.start_date}
                        onChange={handleChange}
                        max="9999-12-31"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item formik={formik} name="end_date" label={t("До")}>
                      <Input
                        type="date"
                        size="large"
                        max="9999-12-31"
                        id="end_date"
                        value={formik.values.end_date}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="order_no"
                      label={t("priority")}
                    >
                      <Input
                        size="large"
                        type="number"
                        // onKeyDown={(event) => {
                        //   event.preventDefault()
                        // }}
                        onKeyPress={isNumber}
                        id="order_no"
                        value={values.order_no}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="region"
                      label={t("regions")}
                    >
                      <Select
                        height={40}
                        id="region"
                        options={regions}
                        value={values.region}
                        onChange={(val) => {
                          setFieldValue("shipper", null)
                          setFieldValue("product", null)
                          setFieldValue("region", val)
                          setFieldValue("promotion", null)
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="promotion"
                      label={t("stock")}
                    >
                      <Select
                        height={40}
                        id="promotion"
                        isDisabled={values.shipper}
                        options={promotions}
                        value={values.promotion}
                        onChange={(val) => {
                          setFieldValue("promotion", val)
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="shipper"
                      label={t("restaurants")}
                    >
                      <Select
                        height={40}
                        maxMenuHeight={200}
                        id="shipper"
                        isDisabled={!values.region || values.promotion}
                        options={shippers}
                        value={values.shipper}
                        onChange={(val) => {
                          setFieldValue("shipper", val)
                          setFieldValue("product", null)
                          setAsyncProduct((prev) => !prev)
                          //need optimization
                          setTimeout(() => {
                            setAsyncProduct((prev) => !prev)
                          }, 300)
                        }}
                      />
                    </Form.Item>
                  </div>

                  {asyncProduct && (
                    <div>
                      <Form.Item
                        formik={formik}
                        name="product"
                        label={t("products")}
                      >
                        <AsyncPaginate
                          value={values.product}
                          loadOptions={loadOptions}
                          isDisabled={!values.shipper}
                          additional={{ page: 1 }}
                          placeholder=""
                          styles={customStyles({ height: "40px" })}
                          onChange={(val) => {
                            setFieldValue("product", val)
                          }}
                        />
                      </Form.Item>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
          <Card title={t("schedule")}>
            {weekArray.map((elm) => (
              <div
                className="grid grid-cols-12 w-full items-baseline"
                key={elm.id}
              >
                <div className="col-span-3 input-label">{t(elm.title)}</div>
                <div className="col-span-9 grid grid-cols-12 gap-x-3">
                  <div className="col-span-6">
                    <Input
                      size="large"
                      disabled={!elm.isChecked}
                      id="monday"
                      value={elm.value.startDate}
                      onChange={(e) =>
                        handleChangeTimes(e, elm.id, "startDate")
                      }
                      type="time"
                    />
                    <div
                      className="min-h-6 w-full"
                      style={{
                        fontSize: "12px",
                        lineHeight: 1.5715,
                        color: "#ff4d4f",
                      }}
                    >
                      {validHours && elm.value.startDate === ""
                        ? t("required.field.error")
                        : ""}
                    </div>
                  </div>
                  <div className="col-span-6">
                    <Input
                      size="large"
                      disabled={!elm.isChecked}
                      id="monday"
                      value={elm.value.endDate}
                      onChange={(e) => handleChangeTimes(e, elm.id, "endDate")}
                      type="time"
                    />
                    <div
                      className="min-h-6 w-full"
                      style={{
                        fontSize: "12px",
                        lineHeight: 1.5715,
                        color: "#ff4d4f",
                      }}
                    >
                      {validHours && elm.value.endDate === ""
                        ? t("required.field.error")
                        : ""}
                    </div>
                  </div>
                  {/* <div className="col-span-2 flex justify-center h-100 pt-2.5">
                    <input
                      onChange={changeWeekArray}
                      checked={elm.isChecked}
                      className="w-5 h-5 rounded cursor-pointer"
                      value={elm.id}
                      type="checkbox"
                    />
                  </div> */}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </form>
    </div>
  )
}
