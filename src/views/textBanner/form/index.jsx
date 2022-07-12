import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { Input } from "alisa-ui"
import "./styles.scss"
import ReactQuill from "react-quill" // ES6
import "react-quill/dist/quill.snow.css" // ES6
//components and functions
import Form from "../../../components/Form/Index"
import Breadcrumb from "../../../components/Breadcrumb"
import Header from "../../../components/Header"
import Card from "../../../components/Card"
import Button from "../../../components/Button"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { StyledTab, StyledTabs } from "../../../components/StyledTabs"
import RusFlag from "../../../assets/icons/Ellipse 8.png"
import EngFlag from "../../../assets/icons/Ellipse 9.png"
import FlagUz from "../../../assets/icons/Ellipse 7.png"
import { getRegions } from "../../../services/region"
import Filters from "../../../components/Filters"
import CustomSkeleton from "../../../components/Skeleton"
import Select from "../../../components/Select"
import IconButton from "../../../components/Button/IconButton"
import ClearIcon from "@material-ui/icons/Clear"
import { getMenus, getShippers } from "../../../services"

import {
  postTextBanner,
  updateTextBanner,
  getOneTextBanner,
} from "../../../services/banner"
import Switch from "../../../components/Switch"

export default function CreateTextBanner() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [checkedProducts, setCheckedProducts] = useState([])
  const [shippers, setShippers] = useState([])
  const [selectedType, setSelectedType] = useState("info")
  const [menus, setMenus] = useState([])
  const [selectedTab, setSelectedTab] = useState("ru")
  const [types, setTypes] = useState([
    { value: "Courier", label: "Courier" },
    { value: "info", label: "Info" },
  ])
  const [regions, setRegions] = useState()

  const getItem = (regionList) => {
    if (!id) return setLoader(false)
    setLoader(true)
    getOneTextBanner(id)
      .then(async (res) => {
        console.log("res", res)
        setSelectedType(res.type)
        const [regionObj] = regionList.filter((el) => el.id === res.region_id)
        try {
          let { shippers } = await getShipperList(res.region_id)
          console.log(shippers)

          if (shippers) {
            shippers = shippers.map((el) => ({ value: el.id, label: el.name }))
            setShippers(shippers)
          }

          const singleShipper = []

          shippers.forEach((el) => {
            if (!res.shipper_ids) return
            if (res.shipper_ids.includes(el.value)) {
              singleShipper.push(el)
            }
          })

          console.log("selectedShipper", singleShipper)
          formik.setValues({
            name: {
              ...res.name,
            },
            start_date: `${res.start_date.split("-")[2]}-${
              res.start_date.split("-")[1]
            }-${res.start_date.split("-")[0]}`,
            end_date: `${res.end_date.split("-")[2]}-${
              res.end_date.split("-")[1]
            }-${res.end_date.split("-")[0]}`,
            shipper_ids: singleShipper,
            type: res.type === "Courier" ? types[0] : types[1],
            is_active: res.is_active,
            region_id: {
              label: regionObj.name,
              value: res.region_id,
            },
          })
        } catch (error) {}
      })
      .finally(() => setLoader(false))
  }

  const tabLabel = (text, _) => {
    return <span className="px-1">{text}</span>
  }

  const getShipperList = (id) => {
    return getShippers({ limit: 1000, region_ids: id })
  }
  // useEffect(() => {
  //   getItem()
  // }, [])

  const initialValues = useMemo(
    () => ({
      name: {
        uz: "",
        ru: "",
        en: "",
      },
      start_date: "",
      end_date: "",
      shipper_ids: [],
      region_id: null,
      is_active: false,
      type: "",
    }),
    []
  )

  const saveChanges = (data) => {
    const start_date = `${data.start_date.split("-")[2]}-${
      data.start_date.split("-")[1]
    }-${data.start_date.split("-")[0]}`
    const end_date = `${data.end_date.split("-")[2]}-${
      data.end_date.split("-")[1]
    }-${data.end_date.split("-")[0]}`

    setSaveLoading(true)

    delete data.restaurant_shade

    const response = {
      ...data,
      shipper_ids:
        data.type.value === "info"
          ? data.shipper_ids.map((item) => item.value)
          : null,
      start_date,
      end_date,
      region_id: data.region_id.value,
      is_active: data.is_active,
      type: data.type.value,
    }
    const selectedAction = id
      ? updateTextBanner(id, response)
      : postTextBanner(response)
    selectedAction
      .then(() => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    saveChanges(values)
  }

  const onFieldChange = (name, e, type = "") => {
    if (type === "custom") {
      setFieldValue(`${name}.${selectedTab}`, e)
      return
    }
    setFieldValue(`${name}.${selectedTab}`, e.target.value)
  }

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))

    return yup.object().shape({
      name: yup.object().shape({
        uz: defaultSchema,
        ru: defaultSchema,
        en: defaultSchema,
      }),
      start_date: defaultSchema,
      end_date: defaultSchema,
      region_id: defaultSchema,
      type: defaultSchema,
    })
  }, [])

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const fetchData = async () => {
    setLoader(true)
    try {
      const { regions } = await getRegions({ limit: 1000 })
      console.log("regions", regions)
      getItem(regions)
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
  const getShippersData = () => {
    if (formik.values.region_id)
      getShippers({
        limit: 1000,
        region_ids: formik.values.region_id.value,
      }).then((res) => {
        setShippers(
          res.shippers.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        )
      })
  }

  const setValue = (val) => {
    console.log(val)
    setFieldValue("type", val)
    setSelectedType(val.value)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    getShippersData()
  }, [formik.values.region_id])

  const { values, setFieldValue, handleChange, handleSubmit } = formik
  // need to optimize
  useEffect(() => {
    // need to optimize
    if (values.shipper_ids && values.shipper_ids.length > 0) {
      setMenus([])
      values.shipper_ids.map((item) => {
        getMenus({ shipper_id: item.value, limit: 1000 }).then((res) => {
          setMenus((prev) => [...prev, ...res.menus])
        })
      })
    }
  }, [values.shipper_ids])

  if (loader) return <CustomSkeleton />

  const routes = [
    {
      title: t("textBanner"),
      link: true,
      route: `/home/marketing/text-banner`,
    },
    {
      title: id ? formik.values?.name.ru : t("create"),
    },
  ]

  return (
    <div className="w-full Stocks">
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
              onClick={() => console.log()}
            >
              {t(id ? "save" : "create")}
            </Button>,
          ]}
        />

        <div className="p-4 w-full flex flex-col gap-4 box-border font-body text-sm">
          <Card title={t("general.settings")}>
            <div className="w-full grid grid-cols-12 gap-8">
              <div className="col-span-12">
                <Filters
                  className="mb-4 filterStock"
                  style={{ borderTop: "none" }}
                >
                  <StyledTabs
                    value={selectedTab}
                    onChange={(_, value) => {
                      setSelectedTab(value)
                    }}
                    indicatorColor="primary"
                    textColor="primary"
                    centered={false}
                    aria-label="full width tabs example"
                    TabIndicatorProps={{ children: <span className="w-2" /> }}
                  >
                    <StyledTab
                      label={
                        <div className="flex items-center">
                          <img
                            className="mr-2"
                            src={RusFlag}
                            width={16}
                            alt=""
                          />
                          {tabLabel(t("russian"))}
                        </div>
                      }
                      value="ru"
                    />
                    <StyledTab
                      label={
                        <div className="flex items-center">
                          <img
                            className="mr-2"
                            src={EngFlag}
                            width={16}
                            alt=""
                          />
                          {tabLabel(t("english"))}
                        </div>
                      }
                      value="en"
                    />
                    <StyledTab
                      label={
                        <div className="flex items-center">
                          <img
                            className="mr-2"
                            src={FlagUz}
                            width={16}
                            alt=""
                          />
                          {tabLabel(t("uzbek"))}
                        </div>
                      }
                      value="uz"
                    />
                  </StyledTabs>
                </Filters>
                <div className="grid grid-cols-12 items-baseline gap-3">
                  <span className="col-span-3 input-label">
                    {t(`name.in.${selectedTab}`)}
                  </span>
                  <div className="col-span-9">
                    <Form.Item formik={formik} name={`name.${selectedTab}`}>
                      {selectedTab === "uz" ? (
                        <ReactQuill
                          id="name"
                          value={values.name?.[selectedTab]}
                          onChange={(e) => formik.setFieldValue("name.uz", e)}
                        />
                      ) : (
                        ""
                      )}
                      {selectedTab === "ru" ? (
                        <ReactQuill
                          id="name"
                          value={values.name?.[selectedTab]}
                          onChange={(e) => formik.setFieldValue("name.ru", e)}
                        />
                      ) : (
                        ""
                      )}
                      {selectedTab === "en" ? (
                        <ReactQuill
                          id="name"
                          value={values.name?.[selectedTab]}
                          onChange={(e) => formik.setFieldValue("name.en", e)}
                        />
                      ) : (
                        ""
                      )}
                      {/* <ReactQuill id="name" value={values.name?.[selectedTab]}
                          onChange={(e) => onFieldChange("name", e, 'custom')}
                      /> */}
                      {/* <Input
                        size="large"
                        value={values.name?.[selectedTab]}
                        onChange={(e) => onFieldChange("name", e)}
                      /> */}
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-baseline gap-3">
                  <span className="col-span-3 input-label">{t(`Статус`)}</span>
                  <div className="col-span-9">
                    <Form.Item formik={formik} name="related_subject">
                      <div
                        className="flex items-center"
                        style={{ height: "42px" }}
                      >
                        <Switch
                          color="primary"
                          checked={values.is_active}
                          onChange={(val) => {
                            setFieldValue("is_active", val)
                          }}
                        />
                        <div className="input-label ml-2">
                          {values.is_active ? "Активный" : "Неактивный"}
                        </div>
                      </div>
                    </Form.Item>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-baseline">
                  <span className="col-span-3 input-label">
                    {t(`start.time`)}
                  </span>
                  <div className="col-span-4">
                    <Form.Item formik={formik} name="start_date">
                      <Input
                        type="date"
                        max="9999-12-31"
                        size="large"
                        id="start_date"
                        value={values.start_date}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-4 ">
                    <Form.Item formik={formik} name="end_date">
                      <Input
                        type="date"
                        size="large"
                        id="end_date"
                        max="9999-12-31"
                        value={values.end_date}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-baseline">
                  <span className="col-span-3 input-label">{t(`type`)}</span>
                  <div className="col-span-4">
                    <Form.Item formik={formik} name="type">
                      <Select
                        height={40}
                        id="type"
                        options={types}
                        value={values.type}
                        onChange={(val) => {
                          setValue(val)
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card title={t("Допалнительные информации")}>
            <div className="grid grid-cols-12 items-baseline">
              <span className="col-span-3 input-label">{t("regions")}</span>
              <div className="col-span-9">
                <div className="flex gap-8 items-start">
                  <div className="w-full">
                    <Form.Item formik={formik} name="region_id">
                      <Select
                        height={40}
                        id="region_id"
                        options={regions}
                        value={values.region_id}
                        onChange={(val) => {
                          setFieldValue("region_id", val)
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 items-baseline">
              <span className="col-span-3 input-label">{t("restaurants")}</span>
              <div className="col-span-9">
                <div className="flex gap-8 items-start">
                  <div className="w-full">
                    <Form.Item formik={formik} name="shipper_ids">
                      <Select
                        isMulti
                        id="shipper_ids"
                        height={40}
                        disabled={selectedType !== "info"}
                        options={shippers}
                        value={values.shipper_ids}
                        maxMenuHeight={200}
                        isSearchable
                        onChange={(val) => setFieldValue("shipper_ids", val)}
                      />
                    </Form.Item>
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
