import { useState, useMemo, useEffect } from "react"
import Card from "../../../components/Card"
import { useSelector } from "react-redux"
import Form from "../../../components/Form/Index"
import { useTranslation } from "react-i18next"
import { Input } from "alisa-ui"
import { Close, Add } from "@material-ui/icons"
import IconButton from "../../../components/Button/IconButton"
import Modal from "../../../components/Modal"
import { useFormik } from "formik"
import Select from "../../../components/Select"
import TextArea from "../../../components/Textarea"
import Button from "../../../components/Button"
import { getProducts, getOneProduct } from "../../../services"
import { RadioGroup, Radio } from "../../../components/Radio"
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn"
import DriveEtaIcon from "@material-ui/icons/DriveEta"
import FunctionsIcon from "@material-ui/icons/Functions"

//images
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos"
import { numberToPrice } from "../../../utils/numberToPrice"
import { components } from "react-select"
import { getPaymentImg } from "../paymentType"
import { isNumber } from "../../../utils/inputHelpers"
import { useParams } from "react-router"

export default function ProductContent({
  formik,
  shipperId,
  selectedProducts,
  setSelectedProducts,
  deliveryPrice,
  discountDeliveryPrice,
  setDiscountDeliveryPrice,
  productRef,
  setOrderHistoryPage,
  cards,
  lastOrderId,
  courierTypes,
  orderAmountRestaurant,
  vendorEditTime,
}) {
  const { t } = useTranslation()
  const lang = useSelector((state) => state.lang.current)
  const params = useParams()
  const [modal, setModal] = useState(null)
  const [products, setProducts] = useState([])
  const [options, setOptions] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [edit, setEdit] = useState(false)
  const modalFormik = useFormik({
    initialValues: {
      product: null,
      option: null,
      ingredient: null,
      child_option: 0,
      count: 1,
    },
    onSubmit,
  })

  const { values, handleChange, setFieldValue, resetForm } = modalFormik

  useEffect(() => {
    const menu_id = formik?.values?.branch?.elm?.menu_id
    if (menu_id) {
      getProducts({ limit: 1000, menu_id })
        .then((res) =>
          setProducts(
            res.products
              ? res.products.map((elm) => ({
                  label: elm.name[lang],
                  value: elm,
                  disabled: !elm.is_active,
                }))
              : []
          )
        )
        .catch((err) => console.log(err))
    }
  }, [formik?.values?.branch?.elm?.menu_id])

  useEffect(() => {
    if (shipperId && values.product?.value?.id) {
      if (!edit) {
        setFieldValue("option", null)
        setFieldValue("ingredient", null)
      }

      getOneProduct(
        values.product.value.product_id || values.product.value.id,
        {},
        shipperId
      )
        .then((res) => {
          if (res.options && res.options.length) {
            let isNotRequired = []
            let options = res.options.map((elm) => ({
              ...elm,
              child_options: elm.child_options.length
                ? elm.child_options.filter((el) => {
                    if (!el.is_required) {
                      isNotRequired.push(el)
                      return false
                    }
                    return true
                  })
                : [],
            }))

            setOptions(options)
            setIngredients(isNotRequired)
            if (!values.product.value.product_id) {
              setFieldValue("option", {
                label: `${options[0].name[lang]} ( ${numberToPrice(
                  options[0].price,
                  "сум"
                )} )`,
                value: options[0],
              })
              setFieldValue("child_option", options[0].child_options[0])
            }
          } else {
            setOptions([])
            setIngredients([])
          }
        })
        .catch((err) => console.log(err))
    }
  }, [values.product])

  const totalPrice = useMemo(() => {
    const productPrice = values.product?.value?.price ?? 0
    const optionPrice = values.option?.value?.price ?? 0
    const optionChildPrice = values.child_option ? values.child_option.price : 0
    const ingredientsPrice = values.ingredient
      ? values.ingredient.reduce((pre, cur) => pre + cur.value.price, 0)
      : 0

    return (
      (productPrice + optionPrice + optionChildPrice + ingredientsPrice) *
      values.count
    )
  }, [
    values.product,
    values.option,
    values.child_option,
    values.ingredient,
    values.count,
  ])

  const productPrice = (elm) =>
    elm.price +
    (elm.optionPrice || 0) +
    (elm.optionChildPrice || 0) +
    (elm.ingredientsPrice || 0)

  const generalPrice = useMemo(() => {
    return selectedProducts.reduce((pre, cur) => {
      const price = cur.discount_value
        ? cur.discount_type === "percent"
          ? (productPrice(cur) -
              productPrice(cur) * (cur.discount_value / 100)) *
            cur.quantity
          : productPrice(cur) - cur.discount_value > 0
          ? (productPrice(cur) - cur.discount_value) * cur.quantity
          : 0
        : productPrice(cur) * cur.quantity
      return pre + price
    }, 0)
  }, [selectedProducts])

  useEffect(() => {
    if (selectedProducts && selectedProducts.length > 0) {
      selectedProducts.forEach((el) => {
        if (
          el.delivery_discount_value &&
          el.delivery_discount_type &&
          el.delivery_discount_promotion_id
        ) {
          setDiscountDeliveryPrice({
            delivery_discount_value: el.delivery_discount_value,
            delivery_discount_type: el.delivery_discount_type,
            delivery_discount_promotion_id: el.delivery_discount_promotion_id,
          })
          return
        }
      })
    } else {
      setDiscountDeliveryPrice(null)
    }
  }, [selectedProducts])

  function onSubmit(values) {
    try {
      const {
        name,
        description,
        id,
        discount_type,
        discount_value,
        delivery_discount_value,
        delivery_discount_type,
        delivery_discount_promotion_id,
        product_id,
      } = values.product.value
      const { child_options, ...options } = values.option?.value ?? {}

      const optionValue = child_options?.find(
        (item) => item.id === values.child_option.id
      )

      let childOpts = []

      if (values.ingredient) {
        childOpts = values.ingredient.map((elm) => elm.value)
      }

      if (optionValue) {
        childOpts.push(optionValue)
      }

      const productData = {
        name,
        description,
        product_id: product_id || id,
        id,
        price: values.product?.value?.price,
        quantity: values.count,
        discount_type,
        discount_value,
        delivery_discount_value,
        delivery_discount_type,
        delivery_discount_promotion_id,
        optionPrice:
          values.option && values.option.value.price
            ? values.option.value.price
            : 0,
        ingredientsPrice: values.ingredient
          ? values.ingredient.reduce((total, item) => {
              return total + item.value.price
            }, 0)
          : 0,
        optionChildPrice: values.child_option ? values.child_option.price : 0,
        option: values.option?.value
          ? {
              ...options,
              child_options: childOpts,
            }
          : {},
      }

      if (edit) {
        setSelectedProducts((prev) =>
          prev.map((item) => (item.id === id ? productData : item))
        )
      } else {
        setSelectedProducts((prev) => [...prev, productData])
      }

      setModal(null)
      setEdit(false)
      resetForm()
    } catch (e) {
      console.log(e)
    }
  }

  const handleRemoveProduct = (index) => {
    setSelectedProducts((prev) => prev.filter((elm, i) => index !== i))
  }

  const handleChangeQuantity = (index, val) => {
    setSelectedProducts((prev) =>
      prev.map((elm, i) => (index === i ? { ...elm, quantity: val } : elm))
    )
  }

  const Option = (props) => {
    return <components.Option {...props} />
  }

  const deliveryPriceWithDiscount = discountDeliveryPrice
    ? discountDeliveryPrice.delivery_discount_type === "percent"
      ? deliveryPrice * (discountDeliveryPrice.delivery_discount_value / 100)
      : deliveryPrice - discountDeliveryPrice.delivery_discount_value > 0
      ? deliveryPrice - discountDeliveryPrice.delivery_discount_value
      : 0
    : deliveryPrice

  const cardFooter = (
    <div className="grid grid-cols-2 my-3">
      <div style={{ paddingRight: 26 }}>
        <div className="w-full flex items-start">
          <div className="w-1/3 input-label">
            <span>{t("payment.types")}</span>
          </div>
          <div className="w-2/3">
            <Form.Item formik={formik} name="name">
              <div className="flex gap-2">
                <div
                  onClick={() => {
                    if (!formik.values.paid)
                      formik.setFieldValue("payment_type", "cash")
                  }}
                  style={{
                    pointerEvents: params.id ? "none" : "initial",
                  }}
                  className={`w-3/12 h-10 border ${
                    formik.values.payment_type === "cash"
                      ? "bg-blue-200"
                      : "bg-gray-50"
                  }  cursor-pointer border-bordercolor rounded-md items-center flex justify-center`}
                >
                  <img
                    src={getPaymentImg("cash")}
                    alt="payment image"
                    className="h-8"
                  />
                </div>

                <div
                  onClick={() => {
                    if (!formik.values.paid)
                      formik.setFieldValue("payment_type", "payme")
                  }}
                  style={{
                    pointerEvents: params.id ? "none" : "initial",
                  }}
                  className={`w-3/12 h-10 border ${
                    formik.values.payment_type === "payme"
                      ? "bg-blue-200"
                      : "bg-gray-50"
                  } hover:bg-blue-50 cursor-pointer border-bordercolor rounded-md items-center flex justify-center`}
                >
                  <img
                    src={getPaymentImg("payme")}
                    alt="payment image"
                    className="h-8"
                  />
                </div>
                {/* <div className="w-3/12 h-10 border bg-gray-50 hover:bg-blue-50 cursor-pointer border-bordercolor rounded-md py-2 flex justify-center">
                  <img src={click_icon} alt="click image" className="h-5" />
                </div>
                <div className="w-3/12 h-10 border bg-gray-50 hover:bg-blue-50 cursor-pointer border-bordercolor rounded-md py-2 flex justify-center">
                  <img src={bank_icon} alt="click image" className="h-6" />
                </div> */}
              </div>
            </Form.Item>
          </div>
        </div>
        {formik.values.payment_type === "payme" && (
          <div className="flex">
            <div className="w-1/3 input-label">
              <span>Карта</span>
            </div>
            <div className="w-2/3">
              <Form.Item formik={formik} name="card">
                <Select
                  id="card"
                  options={cards.map((item) => ({
                    value: item.card_id,
                    label: item.card_num,
                  }))}
                  value={formik.values.card}
                  onChange={(val) => formik.setFieldValue("card", val)}
                  // placeholder="Карта"
                />
              </Form.Item>
            </div>
          </div>
        )}
        <div className="flex">
          <div className="w-1/3 input-label">
            <span>Курьер</span>
          </div>
          <div className="w-2/3">
            <Form.Item formik={formik}>
              <Select id="courier" options={courierTypes} maxMenuHeight={150} />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className="border-l-2" style={{ paddingLeft: 26 }}>
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="flex gap-3" style={{ color: "#84919A" }}>
            <MonetizationOnIcon className="text-primary" />
            Сумма заказа
          </div>
          <div className="input-label font-medium">
            {numberToPrice(generalPrice, "сум")}
          </div>
          {params.id && (
            <>
              <div className="flex gap-3" style={{ color: "#84919A" }}>
                <MonetizationOnIcon className="text-primary" />
                Сумма заказа для ресторана
              </div>
              <div className="input-label font-medium">
                {numberToPrice(orderAmountRestaurant, "сум")}
              </div>
            </>
          )}
          <div className="flex gap-3" style={{ color: "#84919A" }}>
            <DriveEtaIcon className="text-primary" />
            Сумма доставки
          </div>
          <div className="input-label font-medium">
            {discountDeliveryPrice ? (
              discountDeliveryPrice.delivery_discount_type === "percent" ? (
                <span className="mr-2">
                  {numberToPrice(
                    deliveryPrice *
                      ((100 - discountDeliveryPrice.delivery_discount_value) /
                        100),
                    "сум "
                  )}
                </span>
              ) : (
                <span className="mr-2">
                  {deliveryPrice > discountDeliveryPrice.delivery_discount_value
                    ? numberToPrice(
                        deliveryPrice -
                          discountDeliveryPrice.delivery_discount_value,
                        "сум "
                      )
                    : "0 сум"}
                </span>
              )
            ) : (
              ""
            )}
            <span className={discountDeliveryPrice ? "cross" : ""}>
              {numberToPrice(deliveryPrice, "сум")}
            </span>
            {discountDeliveryPrice ? (
              <span
                className="text-xs font-semibold ml-3 mt-1"
                style={{ color: "#F76659" }}
              >{`${
                discountDeliveryPrice.delivery_discount_type === "percent"
                  ? ` ( Скидка -${discountDeliveryPrice.delivery_discount_value}% )`
                  : ` ( Скидка -${numberToPrice(
                      discountDeliveryPrice.delivery_discount_value,
                      "сум"
                    )} )`
              }`}</span>
            ) : undefined}
          </div>
        </div>
        <div className="h-0.5 w-full bg-bordercolor my-3"></div>
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="flex gap-3 text-black-1 text-base">
            <FunctionsIcon className="text-primary" />
            Итого
          </div>
          <div className="text-black font-medium">
            {numberToPrice(generalPrice + deliveryPriceWithDiscount, "сум")}
          </div>
        </div>
      </div>
    </div>
  )

  const opentProductModal = (element) => {
    setModal(true)

    getOneProduct(element.product_id, {}, shipperId).then((res) => {
      let optionsData = res?.options?.map((elm) => ({
        ...elm,
        child_options: elm.child_options.length
          ? elm.child_options.filter((el) => {
              if (!el.is_required) {
                return false
              }
              return true
            })
          : [],
      }))
      setOptions(optionsData)
    })

    setFieldValue("product", {
      label: element.name[lang],
      value: element,
    })

    if (element.option && element.option.name) {
      setFieldValue("option", {
        label: element.option.name[lang],
        value: element.option,
      })
      setFieldValue(
        "child_option",
        element?.option?.child_options?.find((val) => val.is_required)
      )
      setFieldValue(
        "ingredient",
        element?.option?.child_options
          ?.filter((val) => !val.is_required)
          ?.map((item) => ({
            label: item.name[lang],
            value: item,
          }))
      )
    }

    setEdit(true)
    setFieldValue("count", element.quantity)
  }

  return (
    <Card
      title={t("products")}
      footer={cardFooter}
      headerClass="py-3"
      extra={
        <>
          {vendorEditTime && (
            <div className="text-md font-medium">
              Время подготовки заказа:
              <span className="text-sm ml-2 text-gray-500">
                {vendorEditTime}
              </span>
            </div>
          )}
          {!params.id && lastOrderId && (
            <div className="flex items-center">
              <span className="mr-4 input-label">История заказов</span>
              {/* <Switch
              color="primary"
              className="mr-4"
              checked={lastOrder}
              onChange={(val) => {
                setLastOrder(val)
              }}
            /> */}
              <div className="transition-all">
                <div
                  className={`flex items-center rounded-md overflow-hidden border`}
                >
                  <div
                    className="h-8 w-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                    style={{
                      transform: "rotate(-180deg)",
                      color: "var(--color-primary)",
                    }}
                    onClick={() => setOrderHistoryPage()}
                  >
                    <ArrowForwardIosIcon
                      fontSize="small"
                      style={{ fontSize: "12px" }}
                    />
                  </div>
                  <div className="h-8 px-2 border-r border-l flex items-center">
                    {lastOrderId}
                  </div>
                  <div
                    onClick={() => setOrderHistoryPage("increment")}
                    className="h-8 w-8 cursor-pointer flex items-center justify-center hover:bg-gray-100"
                  >
                    <ArrowForwardIosIcon
                      fontSize="small"
                      style={{
                        fontSize: "12px",
                        color: "var(--color-primary)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      }
    >
      {selectedProducts.map((elm, i) => (
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex gap-4">
            <div onClick={() => opentProductModal(elm)}>
              <span className="input-label mb-1">{t("name")}</span>
              <Input
                value={elm?.name[lang]}
                disabled
                className="cursor-pointer-allow"
              />
              {elm.discount_type && elm.discount_value ? (
                <div className="text-xs font-semibold text-red-600 ml-3 mt-1">{`${
                  elm.discount_type === "percent"
                    ? `Скидка -${elm.discount_value}%`
                    : `Скидка -${numberToPrice(elm.discount_value, "сум")}`
                }`}</div>
              ) : undefined}
            </div>

            {elm.option.name && (
              <div onClick={() => opentProductModal(elm)}>
                <span className="input-label mb-1">{t("option")}</span>
                <Input
                  value={elm.option.name?.[lang]}
                  disabled
                  className="cursor-pointer-allow"
                />
              </div>
            )}
            {elm?.option?.child_options?.find((val) => val.is_required) && (
              <div onClick={() => opentProductModal(elm)}>
                <span className="input-label mb-1">
                  {t("additional.option")}
                </span>
                <Input
                  value={
                    elm?.option?.child_options?.find((val) => val.is_required)
                      .name?.[lang]
                  }
                  disabled
                  className="cursor-pointer-allow"
                />
              </div>
            )}

            {elm?.option?.child_options?.filter((val) => !val.is_required)
              ?.length > 0 && (
              <div onClick={() => opentProductModal(elm)}>
                <span className="input-label mb-1">{t("ingredients")}</span>
                <Input
                  value={elm.option.child_options
                    ?.filter((val) => !val.is_required)
                    ?.map((item) => item?.name?.[lang])
                    ?.join(",")}
                  disabled
                  className="cursor-pointer-allow"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div onClick={() => opentProductModal(elm)}>
              <span className="input-label mb-1">{t("price")}</span>
              <Input
                type="number"
                value={
                  elm.discount_value
                    ? elm.discount_type === "percent"
                      ? productPrice(elm) -
                        productPrice(elm) * (elm.discount_value / 100)
                      : productPrice(elm) > elm.discount_value
                      ? productPrice(elm) - elm.discount_value
                      : 0
                    : productPrice(elm)
                }
                suffix="сум"
                width={182}
                onKeyDown={(event) => {
                  if (event.keyCode === 38 || event.keyCode === 40) {
                    event.preventDefault()
                  }
                }}
                disabled
                className="cursor-pointer-allow"
              />
            </div>
            <div>
              <Close className="text-primary mt-7" />
            </div>
            <div>
              <span className="input-label mb-1">{t("amount")}</span>
              <Input
                type="number"
                value={elm.quantity}
                onKeyPress={isNumber}
                min="1"
                width={100}
                onKeyDown={(event) => {
                  if (event.keyCode === 38 || event.keyCode === 40) {
                    event.preventDefault()
                  }
                }}
                onChange={(e) => {
                  if (e.target.value && e.target.value > 0) {
                    handleChangeQuantity(i, e.target.value)
                  } else if (!e.target.value) {
                    handleChangeQuantity(i, e.target.value)
                  }
                }}
              />
            </div>
            <div>
              <div className="text-primary mt-5 text-3xl">=</div>
            </div>
            <div onClick={() => opentProductModal(elm)}>
              <span className="input-label mb-1">{t("total.cost")}</span>
              <Input
                type="number"
                value={
                  elm.discount_value
                    ? elm.discount_type === "percent"
                      ? (productPrice(elm) -
                          productPrice(elm) * (elm.discount_value / 100)) *
                        elm.quantity
                      : productPrice(elm) - elm.discount_value > 0
                      ? (productPrice(elm) - elm.discount_value) * elm.quantity
                      : 0
                    : productPrice(elm) * elm.quantity
                }
                suffix="sum"
                width={182}
                onKeyDown={(event) => {
                  if (event.keyCode === 38 || event.keyCode === 40) {
                    event.preventDefault()
                  }
                }}
                disabled
                className="cursor-pointer-allow"
              />
            </div>
            <IconButton
              icon={<Close />}
              color="red"
              onClick={() => handleRemoveProduct(i)}
              className="self-end"
            />
          </div>
        </div>
      ))}
      <div
        className="cursor-pointer border border-dashed border-blue-800 text-secondary text-sm bg-gray-200 p-2 rounded-md flex justify-center items-center gap-2.5"
        onClick={() => setModal(true)}
        ref={productRef}
      >
        <Add />
        <div className="text-black-1">Добавить продукт</div>
      </div>

      <Modal
        width={400}
        open={modal}
        offsetTop={100}
        title={t("add.new.product")}
        footer={null}
        onClose={() => {
          setModal(null)
          setEdit(false)
        }}
        isWarning={false}
      >
        <form onSubmit={modalFormik.handleSubmit}>
          <Form.Item
            name="product"
            formik={modalFormik}
            label={t("product.name")}
          >
            <Select
              options={products}
              value={values.product}
              onChange={(val) => setFieldValue("product", val)}
              isOptionDisabled={(option) => option.disabled}
              components={{ Option }}
            />
          </Form.Item>

          {options.length ? (
            <Form.Item name="option" formik={modalFormik} label={t("option")}>
              <Select
                value={values.option}
                onChange={(val) => {
                  setFieldValue("option", val)
                  setFieldValue("child_option", val.value.child_options[0])
                }}
                options={options.map((elm) => ({
                  label: `${elm.name[lang]} (${elm.price})`,
                  value: elm,
                }))}
              />
              <RadioGroup
                className="mt-3"
                onChange={(val) => {
                  setFieldValue("child_option", val)
                }}
              >
                {values.option?.value?.child_options
                  ?.filter((item) => item.is_required)
                  ?.map((elm, i) => (
                    <Radio
                      value={elm}
                      checked={
                        values.child_option && values.child_option.id === elm.id
                      }
                    >
                      {elm.name[lang]} ({elm.price})
                    </Radio>
                  ))}
              </RadioGroup>
            </Form.Item>
          ) : (
            <></>
          )}

          {ingredients.length ? (
            <Form.Item
              name="ingredient"
              formik={modalFormik}
              label={t("ingredients")}
            >
              <Select
                isMulti
                value={values.ingredient}
                onChange={(val) => setFieldValue("ingredient", val)}
                options={ingredients
                  .filter(
                    (item) =>
                      values.option && item.parent_id === values.option.value.id
                  )
                  .map((elm) => ({
                    label: `${elm.name[lang]} (${elm.price})`,
                    value: elm,
                  }))}
              />
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item name="count" formik={modalFormik} label={t("amount")}>
            <Input
              id="count"
              value={values.count}
              onChange={(e) => {
                if (e.target.value && e.target.value > 0) {
                  handleChange(e)
                } else if (!e.target.value) {
                  handleChange(e)
                }
              }}
              type="number"
              onKeyPress={isNumber}
              min="1"
            />
          </Form.Item>

          <Form.Item
            name="description"
            formik={modalFormik}
            label={t("description")}
          >
            <TextArea
              id="description"
              size={2}
              value={values.description}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item formik={modalFormik} label={t("total.cost")}>
            <Input type="number" disabled={true} value={totalPrice} />
          </Form.Item>
          <div className="flex justify-end gap-3 items-center">
            <Button
              shape="outlined"
              borderColor="bordercolor"
              size="small"
              color="gray"
              onClick={() => setModal(null)}
            >
              {t("cancel")}
            </Button>
            <Button size="small" type="submit">
              {t("save")}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  )
}
