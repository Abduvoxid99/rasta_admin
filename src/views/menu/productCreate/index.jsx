import "./style.scss"
import React, { useEffect } from "react"
import axios from "../../../utils/axios"
import Header from "../../../components/Header"
import * as yup from "yup"
import Breadcrumb from "../../../components/Breadcrumb"
import MainContent from "./MainContent"
import { useFormik } from "formik"
import OptionsContent from "./OptionsContent"
import { useTranslation } from "react-i18next"
import { useState, useMemo } from "react"
import { useHistory, useParams } from "react-router-dom"
import CustomSkeleton from "../../../components/Skeleton"
import Button from "../../../components/Button"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import {
  getProducts,
  getRelatedProducts,
  updateRelatedProduct,
} from "../../../services"

// const menu_id = 'a3361f16-3076-4d50-83bd-38cc9dede994'
//const shipper_id = "a3361f16-3076-4d50-83bd-38cc9dede994" //static shipper id

export default function ProductCreate() {
  const { t } = useTranslation()
  const { id, menu_id, shipper_id } = useParams()
  const history = useHistory()
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loader, setLoader] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [options, setOptions] = useState([])
  const [ingredients, setIngredients] = useState([])

  const initialValues = useMemo(
    () => ({
      image: null,
      category: null,
      order_no: "",
      name: { uz: "", ru: "", en: "" },
      description: { uz: "", ru: "", en: "" },
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      order_no: yup.number().min(1).required(t("required.field.error")),
      name: yup.object({
        uz: defaultSchema,
        ru: defaultSchema,
        en: defaultSchema,
      }),
      price: defaultSchema,
      category: defaultSchema,
      image: defaultSchema,
    })
  }, [])

  useEffect(() => {
    fetchData()
    //getCategories()
    getIngredients()
    if (id) {
      getRelatedProducts(id).then((res) => {
        setRelatedProducts(
          res.products?.map((elm) => ({
            label: elm.name.ru,
            value: elm.id,
            elm,
          }))
        )
      })
    }
  }, [])

  const getProductsData = async (search, limit, page, menuId) => {
    return getProducts({ limit, search, page, menu_id: menuId })
  }

  const fetchData = () => {
    if (!id) return setLoader(false)
    axios
      .get("/product/" + id, { headers: { shipper: menu_id } })
      .then((res) => {
        formik.setValues({
          image: res?.image?.replace(process.env.MINIO_BASE_URL, ""),
          category: { label: res.category_name.ru, value: res.category_id },
          order_no: res.order_no,
          name: res.name,
          description: res.description,
          price: res.price,
        })
        setOptions(res.options)
      })
      .finally(() => setLoader(false))
  }

  const saveChanges = (data) => {
    setSaveLoading(true)

    const createParams = {
      url: "/product",
      method: "POST",
      headers: {
        shipper: menu_id,
      },
    }

    const editParams = {
      url: "/product/" + id,
      method: "PUT",
      headers: {
        shipper: menu_id,
      },
    }

    const selectedParams = id ? editParams : createParams

    axios({ ...selectedParams, data })
      .then((res) => {
        if (relatedProducts) {
          updateRelatedProduct(id || res.id, {
            related_product_ids: relatedProducts.map((item) => item.value),
          }).then((result) => {
            console.log(result)
          })
        }
        history.goBack(-1)
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    const newOptions = options.map((item) => {
      return { ...item, is_required: true }
    })
    saveChanges({
      name: values.name,
      title: values.name,
      description: values.description,
      category_id: values.category.value,
      image: `${process.env.MINIO_BASE_URL}${values.image}`,
      order_no: values.order_no,
      menu_id: menu_id,
      shipper_id,
      is_active: true,
      price: values.price,
      options: newOptions,
    })
  }

  // const getCategories = () => {
  //   axios
  //     .get("/category", { params: { all: true, menu_id: menu_id } })
  //     .then((res) => {
  //       if (res.categories)
  //         setCategories(
  //           res.categories.map((elm) => ({ label: elm.name.ru, value: elm.id }))
  //         )
  //     })
  //     .catch((err) => console.log(err))
  // }

  const getCategoriesData = async (search, limit, page, menuId) => {
    return axios.get("/category", {
      params: { all: true, menu_id: menuId, search, limit, page },
    })
  }

  const getIngredients = () => {
    axios
      .get(`/ingredients?limit=100&shipper_id=${shipper_id}`)
      .then((res) => {
        if (res.ingredients) setIngredients(res.ingredients)
      })
      .catch((err) => console.log(err))
  }

  const loadOptions = async (search, prevOptions, { page }) => {
    const res = await getProductsData(search, 10, page, menu_id)
    const hasMore = res.count > prevOptions.length + 10
    return {
      options: res.products
        ?.filter((item) => item.id !== id)
        ?.map((elm) => ({
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

  const loadOptionsCategory = async (search, prevOptions, { page }) => {
    const res = await getCategoriesData(search, 10, page, menu_id)
    const hasMore = res.count > prevOptions.length + 10
    return {
      options: res.categories
        ?.filter((item) => item.id !== id)
        ?.map((elm) => ({
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

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const routes = [
    {
      title: t("restaurants"),
      link: true,
      route: "/home/company/shipper-company",
    },
    {
      title: t("menu"),
      link: true,
      route: `/home/company/shipper-company/${shipper_id}?tab=menu`,
    },
    {
      title: t("products"),
      link: true,
      route: `/home/company/shipper-company/menu/${shipper_id}/${menu_id}?tab=product`,
    },
    {
      title: id ? formik.values?.name?.ru : t("create"),
    },
  ]

  if (loader) return <CustomSkeleton />

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Header
          title={t("product")}
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

        <div
          className="p-4 w-full flex flex-col gap-4 box-border font-body"
          style={{ fontSize: "14px", lineHeight: "24px" }}
        >
          <MainContent
            formik={formik}
            categories={categories}
            loadOptions={loadOptions}
            relatedProducts={relatedProducts}
            setRelatedProducts={setRelatedProducts}
            loadOptionsCategory={loadOptionsCategory}
          />
          <OptionsContent
            formik={formik}
            options={options}
            onOptionsChange={setOptions}
            saveLoading={saveLoading}
            ingredients={ingredients}
          />
        </div>
      </form>
    </div>
  )
}
