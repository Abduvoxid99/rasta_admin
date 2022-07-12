import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"

import { Input } from "alisa-ui"

//components
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import Button from "../../../../components/Button"
import Select from "../../../../components/Select"
import { getOneNew, postNew, updateNew } from "../../../../services/news"
import { useSelector } from "react-redux"
import { getMenus, getProducts, getShippers } from "../../../../services"
import CustomSkeleton from "../../../../components/Skeleton"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import TextArea from "../../../../components/Textarea"
import { getOneNewProduct, postNewProduct, updateNewProduct } from "../../../../services/newProducts"

export default function CreateProductCollection() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const lang = useSelector((state) => state.lang.current)
  const { region_ids } = useSelector((state) => state.auth)
  const [shippers, setShippers] = useState([])
  const [menus, setMenus] = useState([])
  const [products, setProducts] = useState([])

  const getShippersFunction = () => {
    setLoader(true)
    getShippers({ region_ids: region_ids.join(","), limit: 1000 })
      .then((res) => {
        setShippers(res?.shippers ?? [])
      })
      .finally(() => setLoader(false))
  }

  const getMenusFunction = async () => {
    const shipperIds = formik.values.shipper_ids?.map(el => el.value)
    if(!shipperIds?.length) formik.setFieldValue('menu_ids', [])

    try {
      
      const requests = shipperIds.map((id) =>
        getMenus({
          region_ids: region_ids.join(","),
          limit: 1000,
          page: 1,
          shipper_id: id,
        })
      )

      const response = await Promise.all(requests)
      const menusList = []
      response.forEach(el => el.menus?.forEach(menu => menusList.push(menu)))
      setMenus(menusList)
    } catch (error) {
      
    }
  }

  const getProductsFunction = async () => {
    const menuIds = formik.values.menu_ids?.map(el => el.value)
    if(!menuIds?.length) formik.setFieldValue('product_ids', [])

    try {
      const requests = menuIds.map((id) =>
        getProducts({
          region_ids: region_ids.join(","),
          limit: 1000,
          page: 1,
          menu_id: id,
        })
      )

      const response = await Promise.all(requests)
      const productList = []
      response.forEach(el => el.products?.forEach(product => productList.push(product)))
      setProducts(productList)
    } catch (error) {
      
    }
  }



  const getNewProduct = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getOneNewProduct(id)
      .then((res) => {

        const productIds = []
        const shipperIds = []
        const menuIds = []

        res.products?.forEach(product => {

          productIds.push({ label: product.name?.[lang], value: product })


          if(!menuIds.find(menu => menu.value === product.menu_id)) {
            menuIds.push({
              value: product.menu_id,
              label: product.menu_name?.[lang]
            })
          }

          if(!shipperIds.find(shipper => shipper.value === product.shipper_id)) {
            shipperIds.push({
              value: product.shipper_id,
              label: product.shipper_name
            })
          }
        })

        formik.setValues({
          name: res.name,
          description: res.description,
          shipper_ids: shipperIds,
          menu_ids: menuIds,
          product_ids: productIds
        })
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getShippersFunction()
    getNewProduct()
  }, [])

  const initialValues = useMemo(
    () => ({
      name: { en: "", ru: "", uz: "" },
      description: { en: "", ru: "", uz: "" },
      shipper_ids: [],
      menu_ids: [],
      product_ids: [],
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      name: yup.object({
        en: defaultSchema,
        ru: defaultSchema,
        uz: defaultSchema,
      }),
      menu_ids: yup.array().min(1, t("required.field.error")),
      product_ids: yup.array().min(1, t("required.field.error")),
      shipper_ids: yup.array().min(1, t("required.field.error"))
      // description: yup.object({
      //   en: defaultSchema,
      //   ru: defaultSchema,
      //   uz: defaultSchema,
      // }),
    })
  }, [])

  const computedShippers = useMemo(() => {
    return (
      shippers?.map(({ id, name }, _) => ({ label: name, value: id })) ?? []
    )
  }, [shippers])

  const computedMenus = useMemo(() => {
    return menus?.map(({ id, name }, _) => ({ label: name[lang] ?? '', value: id })) ?? []
  }, [menus])

  const computedProducts = useMemo(() => {
    return (
      products?.map((el, _) => ({ label: el.name?.[lang] ?? '', value: el })) ?? []
    )
  }, [products])

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = id ? updateNewProduct(id, data) : postNewProduct(data)

    selectedAction
      .then((res) => {
        history.goBack()
      })
      .catch((err) => console.log("err", err))
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    
    const computedMenus = values.menu_ids?.map(menu => ({
      menu_id: menu.value,
      products: values.product_ids?.filter(product => product.value?.menu_id === menu.value)?.map(el => el.value?.id)
    }))

    saveChanges({
      name: values.name,
      description: values.description,
      products: computedMenus
    })
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  useEffect(() => {
    getMenusFunction()
  }, [formik.values.shipper_ids])

  useEffect(() => {
    getProductsFunction()
  }, [formik.values.menu_ids])

  

  if (loader) return <CustomSkeleton />

  const routes = [
    {
      title: t("product.collection"),
      link: true,
      route: `/home/marketing/products-collection`,
    },
    // {
    //   title: t("company.collection"),
    //   link: true,
    //   route: `/home/catalog/news`,
    // },
    {
      title: id ? formik.values?.name[lang] : t("create"),
    },
  ]

  const { values, handleChange, setFieldValue } = formik

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
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
          <Card title={t("add.new.category")}>
            <div className="w-full grid grid-cols-12">
              <div className="col-span-12">
                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Form.Item
                      formik={formik}
                      name="name.uz"
                      label={t("name.in.uz")}
                    >
                      <Input
                        id="name.uz"
                        value={values.name?.uz}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="name.ru"
                      label={t("name.in.ru")}
                    >
                      <Input
                        id="name.ru"
                        value={values.name?.ru}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      formik={formik}
                      name="name.en"
                      label={t("name.in.en")}
                    >
                      <Input
                        id="name.en"
                        value={values.name?.en}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-x-6">
                  {/* <div>
                    <Form.Item
                      formik={formik}
                      name="description.uz"
                      label={t("description.in.uz")}
                    >
                      <TextArea
                        id="description.uz"
                        value={values.description.uz}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div> */}
                  {/* <div>
                    <Form.Item
                      formik={formik}
                      name="description.ru"
                      label={t("description.in.ru")}
                    >
                      <TextArea
                        id="description.ru"
                        value={values.description.ru}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div> */}
                  {/* <div>
                    <Form.Item
                      formik={formik}
                      name="description.en"
                      label={t("description.in.en")}
                    >
                      <TextArea
                        id="description.en"
                        value={values.description.en}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div> */}
                </div>
                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <Form.Item
                      formik={formik}
                      name="shipper_ids"
                      label={t("restaurants")}
                    >
                      <Select
                        id="shipper_ids"
                        isMulti
                        isSearchable
                        value={values.shipper_ids}
                        onChange={(val) => {
                          setFieldValue("shipper_ids", val)
                        }}
                        options={computedShippers}
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item
                      formik={formik}
                      name="menu_ids"
                      label={t("menu")}
                    >
                      <Select
                        id="menu_ids"
                        isMulti
                        isSearchable
                        value={values.menu_ids}
                        onChange={(val) => {
                          setFieldValue("menu_ids", val)
                        }}
                        options={computedMenus}
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <Form.Item
                      formik={formik}
                      name="product_ids"
                      label={t("products")}
                    >
                      <Select
                        id="product_ids"
                        isMulti
                        isSearchable
                        value={values.product_ids}
                        onChange={(val) => {
                          setFieldValue("product_ids", val)
                        }}
                        options={computedProducts}
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
