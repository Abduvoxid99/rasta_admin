import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { Input } from "alisa-ui"
import "./styles.scss"

//components and functions
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import Button from "../../../../components/Button"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { StyledTab, StyledTabs } from "../../../../components/StyledTabs"
import RusFlag from "../../../../assets/icons/Ellipse 8.png"
import EngFlag from "../../../../assets/icons/Ellipse 9.png"
import FlagUz from "../../../../assets/icons/Ellipse 7.png"
import Filters from "../../../../components/Filters"
import CustomSkeleton from "../../../../components/Skeleton"
import Select from "../../../../components/Select"
import IconButton from "../../../../components/Button/IconButton"
import ClearIcon from "@material-ui/icons/Clear"
import { getMenus, getShippers } from "../../../../services"
import {
  getCategories,
  getCompanyCategories,
  getOneCompanyCategory,
} from "../../../../services/company_category"
import {
  getOnePromotion,
  savePromotion,
  updatePromotion,
} from "../../../../services/promotion"
import ProductModal from "./ProductModal"
import { useDispatch, useSelector } from "react-redux"
import { showAlert } from "../../../../redux/reducers/alertReducer"
import { isNumber } from "../../../../utils/inputHelpers"
import Switch from "../../../../components/Switch"

export default function CreateCourierType() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [checkedProducts, setCheckedProducts] = useState([])
  const [products, setProducts] = useState([])
  const [menuIds, setMenuIds] = useState([])
  const [shippers, setShippers] = useState([])
  const [isProduct, setIsProduct] = useState(false)
  const [open, setOpen] = useState(false)
  const [menus, setMenus] = useState([])
  const [companyCategories, setCompanyCategories] = useState([])
  const [selectedTab, setSelectedTab] = useState("ru")
  const [productsSwitch, setProductsSwitch] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState(null)
  const [discountType, setDiscountType] = useState(null)
  const [allCategories, setAllCategories] = useState([])
  const expensive_types = [
    { label: "Цена товара", value: "product" },
    { label: "Цена доставки", value: "delivery" },
    // { label: "Фиксированный", value: "fixed" },
  ]
  const discount_types = [
    { label: "Фиксированный", value: "fixed", disabled: false },
    { label: "Процент", value: "percent", disabled: false },
  ]
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

  const changeWeekArray = (e) => {
    setWeekArray((prev) =>
      prev.map((item) =>
        String(item.id) === e.target.value
          ? {
              ...item,
              value: {
                startDate: "",
                endDate: "",
              },
              isChecked: !item.isChecked,
            }
          : item
      )
    )
  }

  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getOnePromotion(id)
      .then((res) => {
        formik.setValues({
          start_amount: parseInt(res.start_amount),
          end_amount: parseInt(res.end_amount),
          name: {
            ...res.name,
          },
          start_date: `${res.start_date.split("-")[2]}-${
            res.start_date.split("-")[1]
          }-${res.start_date.split("-")[0]}`,
          end_date: `${res.end_date.split("-")[2]}-${
            res.end_date.split("-")[1]
          }-${res.end_date.split("-")[0]}`,
          shipper_ids: res.shippers,
          menu_ids: res.menus.map((item) => ({
            ...item,
            label: item.label[selectedTab],
          })),
          company_category: res.company_categories.map((item) => ({
            ...item,
            label: item.label[selectedTab],
          })),
          expense_type: expensive_types.find(
            (item) => item.value === res.expense_type
          ),
          discount_type: discount_types.find(
            (item) => item.value === res.discount_type
          ),
          discount_value: res.discount_value,
          promo_login: res.promo_login,
          rasta_share: res.rasta_share,
          restaurant_shade: 100 - res.rasta_share,
          initial_budget: res.initial_budget,
          is_active: res.is_active,
          for_all_shippers: res.for_all_shippers,
        })
        const newWeekArray = [...weekArray]
        res.daily_start_times.forEach((item, index) => {
          newWeekArray[index].value.startDate = item
        })
        res.daily_end_times.forEach((val, index) => {
          newWeekArray[index].value.endDate = val
        })
        newWeekArray.map((el) => {
          if (!el.value.endDate && !el.value.startDate) {
            el.isChecked = false
          }
        })
        setMenuIds([...res.menu_ids])
        setCheckedProducts([...res.product_ids])
        setWeekArray(newWeekArray)
        setDiscountType(
          discount_types.filter((el) => el.value === res.discount_type)[0]
        )
      })
      .finally(() => setLoader(false))
  }

  const tabLabel = (text, _) => {
    return <span className="px-1">{text}</span>
  }

  useEffect(() => {
    getItem()
    getCompanyCategories({ limit: 1000 }).then((res) => {
      setCompanyCategories(res?.company_categories)
    })
  }, [])

  useEffect(() => {
    console.log("checkedProducts===>", checkedProducts)
  }, [checkedProducts])

  const initialValues = useMemo(
    () => ({
      name: {
        uz: "",
        ru: "",
        en: "",
      },
      company_category: [],
      promo_login: "",
      discount_value: "",
      expense_type: null,
      discount_type: discount_types[0],
      start_date: "",
      rasta_share: null,
      restaurant_shade: null,
      initial_budget: null,
      end_date: "",
      shipper_ids: [],
      menu_ids: [],
      start_amount: 0,
      end_amount: 0,
      is_active: true,
      for_all_shippers: false,
    }),
    []
  )

  const dispatch = useDispatch()

  const saveChanges = (data) => {
    // if (checkedProducts.length === 0) {
    //   dispatch(showAlert("Выберите продукты"))
    //   formik.setErrors({ ...formik.errors, menu_ids: "Выберите продукты" })
    //   return
    // }
    const company_category_ids = data.company_category.map((item) => item.value)
    delete data.company_category
    const daily_start_times = weekArray.map((item) => item.value.startDate)
    const daily_end_times = weekArray.map((item) => item.value.endDate)
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
      current_budget: data.initial_budget,
      product_ids: checkedProducts,
      shipper_ids: data.shipper_ids.map((item) => item.value),
      region_ids,
      discount_type: data.discount_type.value,
      expense_type: data.expense_type.value,
      daily_start_times,
      daily_end_times,
      start_date,
      end_date,
      menu_ids: data.menu_ids.map((item) => item.value),
      company_category_ids,
      start_amount: parseInt(data.start_amount),
      end_amount: parseInt(data.end_amount),
    }
    const selectedAction = id
      ? updatePromotion(id, response)
      : savePromotion(response)
    selectedAction
      .then(() => {
        history.goBack()
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    saveChanges(values)
  }

  const onFieldChange = (name, e) => {
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
      // shipper_ids: yup.array().min(1, t("required.field.error")),
      // menu_ids: yup.array().min(1, t("required.field.error")),
      expense_type: defaultSchema,
      discount_type: defaultSchema,
      rasta_share: defaultSchema,
      restaurant_shade: defaultSchema,
      promo_login: defaultSchema,
      //company_category: yup.array().min(1, t("required.field.error")),
      discount_value:
        discountType && discountType.value === "percent"
          ? yup
              .number()
              .required(t("required.field.error"))
              .min(0, `Число должно находиться в интервале (0 - 100)`)
              .max(100, `Число должно находиться в интервале (0 - 100)`)
          : yup.number().required(t("required.field.error")),
      start_date: defaultSchema,
      end_date: defaultSchema,
      start_amount:
        discountType && discountType.value === "fixed" ? defaultSchema : "",
      end_amount:
        discountType && discountType.value === "fixed" ? defaultSchema : "",
    })
  }, [discountType])

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  // useEffect(() => {
  //   if (
  //     formik.values.expense_type &&
  //     formik.values.expense_type.value === "product"
  //   ) {
  //     setIsProduct(true)
  //     if (
  //       formik.values.discount_type &&
  //       formik.values.discount_type.value === "fixed"
  //     ) {
  //       formik.setFieldValue("discount_type", null)
  //     }
  //   } else {
  //     setIsProduct(false)
  //   }
  // }, [formik.values.expense_type])

  const { values, setFieldValue, handleChange, handleSubmit } = formik
  const { region_ids } = useSelector((state) => state.auth)
  // need to optimize
  useEffect(() => {
    if (values.company_category && values.company_category.length > 0) {
      const promise = new Promise((resolve, reject) => {
        let shippersData = []
        // need to optimize
        values.company_category.forEach((el) => {
          getOneCompanyCategory(el.value, {
            region_ids: region_ids.join(","),
          }).then((res) => {
            res?.shippers?.forEach((item) => {
              shippersData.push({
                label: item.name,
                value: item.id,
              })
            })
          })
        })
        // need to optimize
        setTimeout(() => {
          resolve(shippersData)
        }, 1000)
      })
      promise.then((result) => {
        const res = [
          ...new Map(result.map((item) => [item["value"], item])).values(),
        ]

        setShippers([...res])
      })
    } else {
      getShippers({ limit: 1000, region_ids: region_ids.join(",") }).then(
        (res) => {
          const result = res?.shippers?.map((item) => ({
            label: item.name,
            value: item.id,
          }))
          setShippers(result)
        }
      )
    }
  }, [values.company_category])

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

  const openPopup = (data) => {
    let mySet = new Set([...menuIds, data.value])
    setMenuIds(Array.from(mySet))
    getCategories({
      menu_id: data.value,
      with_product: true,
    }).then((res) => {
      setOpen(true)
      setCategories(res.categories || [])
      res.categories?.forEach((item) => {
        setCategoryId(null)
        if (item.products) {
          if (!id && menuIds && !menuIds.includes(data.value)) {
            item.products.forEach((el) => {
              setCheckedProducts((prev) => [...prev, el.id])
            })
          }
          setProducts((prev) => [...prev, ...item.products])
        }
      })
      if (menuIds && !menuIds.includes(data.value)) {
        if (res.categories)
          setAllCategories((prev) => [...prev, ...res.categories])
      }
    })
  }

  useEffect(() => {
    values.menu_ids.forEach((item) => {
      if (!id && menuIds && !menuIds.includes(item.value)) {
        openPopup(item)
      }
    })
  }, [values.menu_ids, menuIds])

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

  if (loader) return <CustomSkeleton />

  const routes = [
    {
      title: t("list.stocks"),
      link: true,
      route: `/home/marketing/promotion`,
    },
    {
      title: id ? formik.values?.name.ru : t("create"),
    },
  ]

  const switchCategory = (id) => {
    if (id) {
      const newProducts = categories.find((item) => item.id === id)
      setCategoryId(id)
      setProducts(newProducts.products || [])
    } else {
      setCategoryId(null)
      let newProducts = []
      categories?.forEach((item) => {
        if (item.products) {
          newProducts = [...newProducts, ...item.products]
        }
      })
      setProducts(newProducts)
    }
  }

  const deleteSelectedProducts = (selected) => {
    const removedCategories = allCategories.filter(
      (value) => value.menu_id === selected.removedValue.value
    )
    let removedProducts = []
    removedCategories.forEach((data) => {
      if (data.products) {
        data.products.forEach((itemData) => {
          removedProducts.push(itemData.id)
        })
      }
    })
    let products = []
    for (var i = 0; i < checkedProducts.length; i++) {
      if (!removedProducts.includes(checkedProducts[i])) {
        products.push(checkedProducts[i])
      }
    }
    setCheckedProducts(products)
    setMenuIds((prev) =>
      prev.filter((val) => val !== selected.removedValue.value)
    )
  }

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
                  <div className="col-span-6">
                    <span className="col-span-2 input-label">
                      {t(`name.in.${selectedTab}`)}
                    </span>
                    <Form.Item formik={formik} name={`name.${selectedTab}`}>
                      <Input
                        size="large"
                        value={values.name?.[selectedTab]}
                        onChange={(e) => onFieldChange("name", e)}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-6">
                    <span className="input-label">{t(`promo_login`)}</span>
                    <Form.Item formik={formik} name="promo_login">
                      <Input
                        size="large"
                        value={values.promo_login}
                        onChange={(e) =>
                          setFieldValue("promo_login", e.target.value)
                        }
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-baseline">
                  <div className="grid grid-cols-12 gap-4 col-span-9 items-baseline">
                    <span className="col-span-4 input-label">
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
                    <div className="col-span-4">
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
                  <div className="col-span-3 grid grid-cols-12">
                    <span className="col-span-4 input-label">
                      {t("status")}
                    </span>
                    <div className="col-span-8">
                      <Form.Item formik={formik} name="is_active">
                        <Switch
                          id="is_active"
                          color="primary"
                          checked={values.is_active}
                          onChange={(e) => setFieldValue("is_active", e)}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card title={t("goods")}>
            <div className="grid grid-cols-12 items-baseline">
              <span className="col-span-3 input-label">
                {t("Для всех ресторанов")}
              </span>
              <div className="col-span-9">
                <Form.Item formik={formik} name="is_active">
                  <Switch
                    id="is_active"
                    color="primary"
                    checked={values.for_all_shippers}
                    onChange={(e) => setFieldValue("for_all_shippers", e)}
                  />
                </Form.Item>
              </div>

              <span className="col-span-3 input-label">{t("categories")}</span>
              <div className="col-span-9">
                <div className="flex gap-8 items-start">
                  <div className="w-full">
                    <Form.Item formik={formik} name="company_category">
                      <Select
                        height={40}
                        isMulti
                        options={companyCategories.map((elm) => ({
                          label: elm.name[selectedTab],
                          value: elm.id,
                        }))}
                        id="company_category"
                        value={values.company_category}
                        onChange={(val) =>
                          setFieldValue("company_category", val)
                        }
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <IconButton
                      style={{ width: "40px", height: "40px" }}
                      color="red"
                      icon={<ClearIcon />}
                      onClick={() => {
                        setFieldValue("company_category", [])
                        setFieldValue("shipper_ids", [])
                        setFieldValue("menu_ids", [])
                        setCheckedProducts([])
                      }}
                    />
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
                        options={shippers}
                        value={values.shipper_ids}
                        maxMenuHeight={200}
                        isSearchable
                        onChange={(val) => setFieldValue("shipper_ids", val)}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <IconButton
                      style={{ width: "40px", height: "40px" }}
                      color="red"
                      onClick={() => {
                        setFieldValue("shipper_ids", [])
                        setFieldValue("menu_ids", [])
                        setCheckedProducts([])
                      }}
                      icon={<ClearIcon />}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 items-baseline">
              <span className="col-span-3 input-label">{t("products")}</span>
              <div className="col-span-9">
                <div className="flex gap-8 items-start">
                  <div className="w-full">
                    <Form.Item formik={formik} name="menu_ids">
                      <Select
                        height={40}
                        options={menus.map((item) => ({
                          label: item?.name?.[selectedTab],
                          value: item?.id,
                        }))}
                        customOptionMulti
                        isMulti
                        id="menu_ids"
                        maxMenuHeight={200}
                        onClickOption={openPopup}
                        value={values.menu_ids}
                        onChange={(val, selected) => {
                          if (selected.removedValue) {
                            deleteSelectedProducts(selected)
                          }
                          setFieldValue("menu_ids", val)
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <IconButton
                      style={{ width: "40px", height: "40px" }}
                      color="red"
                      icon={<ClearIcon />}
                      onClick={() => {
                        setFieldValue("menu_ids", [])
                        setCheckedProducts([])
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card title={t("discount")}>
            <div className="grid grid-cols-2">
              <div className="pr-4">
                <Form.Item
                  formik={formik}
                  label={t("Ресторан берет на себя (%)")}
                  name="restaurant_shade"
                >
                  <Input
                    suffix="%"
                    type="number"
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                    size="large"
                    disabled={id}
                    onKeyPress={isNumber}
                    min="0"
                    max="100"
                    name="restaurant_shade"
                    onChange={(e) => {
                      if (e.target.value <= 100) {
                        handleChange(e)
                        setFieldValue("rasta_share", 100 - e.target.value)
                      }
                    }}
                    value={values.restaurant_shade}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  formik={formik}
                  label={t("Rasta берет на себя (%)")}
                  name="rasta_share"
                >
                  <Input
                    suffix="%"
                    type="number"
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                    size="large"
                    onKeyPress={isNumber}
                    disabled={id}
                    min="0"
                    max="100"
                    name="rasta_share"
                    onChange={(e) => {
                      if (e.target.value <= 100) {
                        handleChange(e)
                        setFieldValue("restaurant_shade", 100 - e.target.value)
                      }
                    }}
                    value={values.rasta_share}
                  />
                </Form.Item>
              </div>
              <div className="pr-4">
                <Form.Item
                  formik={formik}
                  label={t("budget")}
                  name="initial_budget"
                >
                  <Input
                    type="number"
                    suffix="сум"
                    size="large"
                    disabled={id}
                    onKeyPress={isNumber}
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                    min="0"
                    name="initial_budget"
                    onChange={(e) => {
                      if (e.target.value && e.target.value > 0) {
                        handleChange(e)
                      } else if (!e.target.value) {
                        handleChange(e)
                      }
                    }}
                    value={values.initial_budget}
                  />
                </Form.Item>
              </div>
              <div>
                {/* <span className="col-span-3 input-label">
                  {t("type.variable")}
                </span> */}

                <Form.Item
                  formik={formik}
                  name="expense_type"
                  label={t("type.variable")}
                >
                  <Select
                    height={40}
                    id="expense_type"
                    options={expensive_types}
                    value={values.expense_type}
                    onChange={(val) => setFieldValue("expense_type", val)}
                  />
                </Form.Item>
              </div>
              <div className="pr-4">
                {/* <span className="col-span-3 input-label">
                  {t("discount.type")}
                </span> */}

                <Form.Item
                  formik={formik}
                  name="discount_type"
                  label={t("discount.type")}
                >
                  <Select
                    height={40}
                    id="discount_type"
                    options={discount_types}
                    value={values.discount_type}
                    isOptionDisabled={(option) => option.disabled}
                    onChange={(val) => {
                      setDiscountType(val)
                      setFieldValue("discount_type", val)
                    }}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  formik={formik}
                  name="discount_value"
                  label={t(`value`)}
                >
                  <Input
                    type="number"
                    onKeyPress={isNumber}
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                    size="large"
                    id="discount_value"
                    onChange={handleChange}
                    value={values.discount_value}
                  />
                </Form.Item>
              </div>
              <div className="pr-4">
                <Form.Item
                  formik={formik}
                  name="start_amount"
                  label={t("start_amount")}
                >
                  <Input
                    type="number"
                    onKeyPress={isNumber}
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                    size="large"
                    id="start_amount"
                    onChange={handleChange}
                    value={values.start_amount}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  formik={formik}
                  name="end_amount"
                  label={t("end_amount")}
                >
                  <Input
                    type="number"
                    onKeyPress={isNumber}
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                    size="large"
                    id="end_amount"
                    onChange={handleChange}
                    value={values.end_amount}
                  />
                </Form.Item>
              </div>

              {/* <span className="col-span-3 input-label">{t(`value`)}</span> */}
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
                  <div className="col-span-5">
                    <Form.Item formik={formik}>
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
                    </Form.Item>
                  </div>
                  <div className="col-span-5">
                    <Form.Item formik={formik}>
                      <Input
                        size="large"
                        disabled={!elm.isChecked}
                        id="monday"
                        value={elm.value.endDate}
                        onChange={(e) =>
                          handleChangeTimes(e, elm.id, "endDate")
                        }
                        type="time"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-2 flex justify-center h-100 pt-2.5">
                    <input
                      onChange={changeWeekArray}
                      checked={elm.isChecked}
                      className="w-5 h-5 rounded cursor-pointer"
                      value={elm.id}
                      type="checkbox"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </form>
      <ProductModal
        open={open}
        onClose={() => {
          setOpen(false)
          //getItem()
          setProducts([])
        }}
        categories={categories}
        products={products}
        switchCategory={switchCategory}
        categoryId={categoryId}
        setCheckedProducts={setCheckedProducts}
        checkedProducts={checkedProducts}
        setProductsSwitch={setProductsSwitch}
        productsSwitch={productsSwitch}
      />
    </div>
  )
}
