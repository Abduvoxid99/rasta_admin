import React, { useCallback, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useState, useMemo } from "react"
import { useHistory, useParams } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from "formik"
import { useDispatch, useSelector } from "react-redux"
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder"
import Modal from "../../../components/Modal"
import {
  postOrder,
  updateOrder,
  getOneOrder,
  getShippers,
  getNearestBranch,
  getComputeDeliveryPrice,
  getUserPaymentCard,
  orderPayByCard,
  getOrders,
  paymentSms,
} from "../../../services"
import {
  getDeliveryPrice,
  getCustomers,
  changeOrderStatus,
  postCustomer,
} from "../../../services"

//components
import MainContent from "./MainContent"
import ProductContent from "./ProductsContent"
import Button from "../../../components/Button"
import Header from "../../../components/Header"

//styles
import "./style.scss"
import CustomSkeleton from "../../../components/Skeleton"
import { StyledTab, StyledTabs } from "../../../components/StyledTabs"
import SaveIcon from "@material-ui/icons/Save"
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import Filter from "../../../components/Filters"
import PrintIcon from "@material-ui/icons/Print"
import TagBtn from "../../../components/Tag/TimeTag"
import { orderTimer } from "../../../utils/orderTimer"
import { showAlert } from "../../../redux/reducers/alertReducer"
import moment from "moment"
import { getAddressListYandex } from "../../../services/yandex"
import { statusCheck } from "../statuses"
import UserOrdersTable from "./user-orders/Table"
import ActionMenu from "../../../components/ActionMenu"
import CheckIcon from "@material-ui/icons/Check"
import ClearIcon from "@material-ui/icons/Clear"
import TextArea from "../../../components/Textarea"
import axios from "../../../utils/axios"
import { useMapCenter } from "../../../utils/useMapCenter"
import { getCourierTypes } from "../../../services/courierType"
import { getRegionByPoint } from "../../../services/region"

export default function CreateClient() {
  const { t } = useTranslation()
  const params = useParams()
  const history = useHistory()
  const [msg, setMsg] = useState("")
  const [createdTime, setCreatedTime] = useState(null)
  const [mapLoading, setMapLoading] = useState(false)
  const [addressList, setAddressList] = useState([])
  const [loader, setLoader] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [shippers, setShippers] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [placemarkGeometry, setPlacemarkGeometry] = useState([])
  const [deliveryPrice, setDeliveryPrice] = useState(0)
  const [orderAmountRestaurant, setOrderAmountRestaurant] = useState(0)
  const [vendorEditTime, setVendorEditTime] = useState(null)
  const {
    region_ids,
    shipper_user_id,
    name: shipper_user_name,
  } = useSelector((state) => state.auth)
  const [regionId, setRegionId] = useState(null)
  const [mapChange, setMapChange] = useState(false)
  const [tabValue, setTabValue] = useState("main")
  const [searchAddress, setSearchAddress] = useState("")
  const [mapCenter, setMapCenter] = useState(useMapCenter())
  const [discountDeliveryPrice, setDiscountDeliveryPrice] = useState(null)
  const [statusId, setStatusId] = useState(null)
  const [userId, setUserId] = useState(null)
  const [cards, setCards] = useState([
    {
      card_num: "Оплата через смс",
      card_id: "paymentBySms",
    },
  ])
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [orderHistoryPage, setOrderHistoryPage] = useState(0)
  const [lastOrders, setLastOrders] = useState([])
  const [lastAddress, setLastAddress] = useState([])
  const [isCard, setIsCard] = useState(false)
  const [courierTypes, setCourierTypes] = useState([])
  const [lastOrderId, setLastOrderId] = useState(null)
  const [deliveryType, setDeliveryType] = useState(null)
  const tabLabel = (text) => {
    return <span className="px-1">{text}</span>
  }

  const productRef = useRef()

  const initialValues = useMemo(
    () => ({
      shipper: null,
      client: null,
      is_courier_call: false,
      client_name: null,
      description: "",
      apartment: "",
      building: "",
      floor: "",
      delivery_type: null,
      is_reissued: false,
      paid: false,
      payment_type: "cash",
      source: "admin_panel",
      to_address: "",
      extra_phone_number: "",
      branch: null,
      card: null,
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      client: defaultSchema,
      shipper: defaultSchema,
      client_name: defaultSchema,
      delivery_type: defaultSchema,
      to_address: defaultSchema,
      branch: defaultSchema,
      card: isCard ? defaultSchema : null,
    })
  }, [isCard])

  const handleMsg = (e) => {
    setMsg(e.target.value)
  }
  useEffect(() => {
    ;(async () => {
      const _shippers = await getShippers({
        limit: 1000,
        region_ids: region_ids.join(","),
      })
        .then((res) => formatLikeOptions(res.shippers))
        .catch((err) => console.log(err))
      const { courier_type } = await getCourierTypes({ limit: 1000 })
      setCourierTypes(
        courier_type
          ? courier_type.map((elm) => ({ label: elm.name, value: elm.id }))
          : []
      )
      const _customers = await getCustomers({ limit: 1000 })
        .then((res) =>
          res.customers?.map((elm) => ({
            label: `${elm.phone} (${elm.name})`,
            value: elm.id,
            elm,
          }))
        )
        .catch((err) => console.log(err))

      setShippers(_shippers)

      fetchData({ _customers })
    })()
  }, [])

  useEffect(async () => {
    if (deliveryType === "delivery" && !params.id) {
      const _deliveryPrice = await getDeliveryPrice().then((res) => res.price)
      setDeliveryPrice(_deliveryPrice)
    }
  }, [deliveryType])

  const dispatch = useDispatch()
  const TabBody = useCallback(
    ({ tab, children }) => {
      if (tab === tabValue) return children
      return <></>
    },
    [tabValue]
  )

  const onSubmit = async (values) => {
    setSaveLoading(true)

    const _values = { ...values }

    if (values.client.action === "create-option") {
      const { id } = await postCustomer({
        name: values.client_name,
        phone: values.client.label,
      })
      _values.client.value = id
    }

    if (selectedProducts.length == 0) {
      dispatch(showAlert("Добавьте продукты"))
      productRef?.current?.scrollIntoView()
      setSaveLoading(false)
      return
    }

    const data = {
      ..._values,
      ...discountDeliveryPrice,
      region_id: regionId,
      client_id: values.client.value,
      co_delivery_price: deliveryPrice,
      extra_phone_number: values.extra_phone_number
        ? "+998" + values.extra_phone_number
        : null,
      to_location: { lat: placemarkGeometry[0], long: placemarkGeometry[1] },
      delivery_type: values.delivery_type.value,
      steps: [
        {
          branch_id: values.branch?.value,
          products: selectedProducts.map((item) => {
            delete item.optionPrice
            delete item.optionChildPrice
            delete item.ingredientsPrice
            delete item.option.is_default
            delete item.delivery_discount_value
            delete item.delivery_discount_type
            delete item.delivery_discount_promotion_id

            item?.option?.child_options?.forEach((val) => {
              if (val) delete val.is_default
            })
            return {
              ...item,
            }
          }),
        },
      ],
    }
    if (values.card) {
      data.card_id =
        values.card.value === "paymentBySms" ? "" : values.card.value
      data.card_num =
        values.card.value === "paymentBySms" ? "" : values.card.label
    }
    delete data.branch
    delete data.card
    delete data.client
    delete data.client_name
    delete data.shipper

    if (params.id) {
      try {
        data.shipper_id = values.shipper.value
        await updateOrder(params.id, data)
        // await changeOrderStatus(
        //   params.id,
        //   {
        //     status_id: "ccb62ffb-f0e1-472e-bf32-d130bea90617",
        //     description: "new order updated",
        //   },
        //   values.shipper.value
        // )

        history.push("/home/orders")
      } catch (e) {
        console.log(e)
      } finally {
        setSaveLoading(false)
      }
    } else {
      postOrder(data)
        .then(async (res) => {
          if (values?.card?.value === "paymentBySms") {
            await paymentSms({
              order_id: res.order_id,
              payment_type: "payme",
              phone:
                values.client.action === "create-option"
                  ? values.client.value
                  : values.client.elm.phone,
              shipper_user_id,
              shipper_user_name,
            })
          }
          if (data.card_id) {
            orderPayByCard(res.order_id).then((res) => {
              console.log(res)
            })
          }
          history.push("/home/orders")
        })
        .finally(() => setSaveLoading(false))
    }
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const changeStatus = (statusId = "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1") => {
    setDeleteLoading((prev) => !prev)
    axios
      .patch(
        `/order/${params.id}/change-status?shipper_id=${formik.values.shipper.value}`,
        {
          description: msg,
          status_id: statusId,
        }
      )
      .then(() => {
        setDeleteModal(null)
        history.push("/home/orders")
      })
      .finally(() => {
        setDeleteLoading((prev) => !prev)
      })
  }

  useEffect(() => {
    if (placemarkGeometry && formik.values.shipper) {
      getNearestBranch({
        shipper_id: formik.values.shipper.value,
        lat: placemarkGeometry[0],
        long: placemarkGeometry[1],
        current_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      }).then((res) => {
        if (res.branches && res.branches.length > 0) {
          setBranches(formatLikeOptions(res.branches))
          const elm = res.branches[0]
          formik.setFieldValue(
            "branch",
            elm ? { label: elm.name, value: elm.id, elm } : null
          )
        } else {
          setBranches([])
        }
      })
    }
  }, [placemarkGeometry, formik.values.shipper])

  useEffect(() => {
    if (searchAddress) {
      getAddressListYandex({
        text: searchAddress,
      }).then((res) => {
        if (res.status === 200) {
          setAddressList(
            res.data.features.map((item) => ({
              label: item.properties.name,
              value: item.properties.CompanyMetaData.id,
              id: item.properties.CompanyMetaData.id,
              description: item.properties.description,
              ...item,
            }))
          )
        }
      })
    } else {
      setAddressList([])
    }
  }, [searchAddress])

  useEffect(() => {
    if (formik.values.branch && placemarkGeometry.length > 0) {
      if (mapChange) {
        setMapLoading((prev) => !prev)
        getComputeDeliveryPrice({
          branch_id: formik.values.branch.value,
          date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
          lat: placemarkGeometry[0],
          long: placemarkGeometry[1],
        })
          .then((res) => {
            setDeliveryPrice(res.price)
          })
          .finally(() => {
            setMapLoading((prev) => !prev)
          })
      }
    }
  }, [placemarkGeometry, formik.values.branch])

  useEffect(() => {
    if (placemarkGeometry.length > 0) {
      getRegionByPoint({
        latitude: placemarkGeometry[0],
        longtitude: placemarkGeometry[1],
      }).then((res) => {
        if (res.regions && res.regions.length > 0) {
          setRegionId(res.regions[0].id)
        }
      })
    }
  }, [placemarkGeometry])

  useEffect(() => {
    if (formik.values.delivery_type)
      setDeliveryType(formik.values.delivery_type.value)
  }, [formik.values.delivery_type])

  const fetchData = ({ _customers }) => {
    if (!params.id) {
      setMapChange(true)
      setLoader(false)
      return
    }
    getOneOrder(params.id)
      .then((res) => {
        const client = _customers.find((elm) => elm.value === res.client_id)
        let date = new Date(res.created_at)
        date.setHours(date.getHours() - new Date(date).getTimezoneOffset() / 60)
        const lats = [res.to_location.lat, res.steps[0].location.lat]
        const lons = [res.to_location.long, res.steps[0].location.long]
        setMapCenter([
          (Math.min(...lats) + Math.max(...lats)) / 2,
          (Math.min(...lons) + Math.max(...lons)) / 2,
        ])
        setCreatedTime(res.created_at)
        setStatusId(res.status_id)
        setRegionId(res.region_id)
        setUserId(res.client_id)
        if (res.delivery_discount_value) {
          setDiscountDeliveryPrice({
            ...discountDeliveryPrice,
            delivery_discount_type: res.delivery_discount_type,
            delivery_discount_value: res.delivery_discount_value,
          })
        }
        setDeliveryType(res.delivery_type)
        setVendorEditTime(res.vendor_ready_time)
        formik.setValues({
          shipper: {
            label: res.shipper_name,
            value: res.shipper_id,
          },
          extra_phone_number: res?.extra_phone_number?.substring(4),
          client: client,
          client_name: client?.elm?.name ?? "",
          is_courier_call: res.is_courier_call,
          description: res.description,
          apartment: res.apartment,
          building: res.building,
          floor: res.floor,
          delivery_type:
            res.delivery_type === "delivery"
              ? { label: t("type-delivery"), value: res.delivery_type }
              : { label: t("type-self-pickup"), value: res.delivery_type },
          is_reissued: res.is_reissued,
          paid: res.paid,
          card: res.card_id && {
            label: res.card_num,
            value: res.card_id,
          },
          payment_type: res.payment_type,
          source: res.source,
          to_address: res.to_address,
          external_order_id: res.external_order_id,
          branch: {
            elm: {
              phone: res.steps[0].phone_number,
              address: res.steps[0].address,
            },
            label: res.steps[0].branch_name,
            value: res.steps[0].branch_id,
          },
        })
        formik.setFieldValue("client", client)
        setOrderAmountRestaurant(res.order_amount_without_rasta_shares)
        setPlacemarkGeometry([res.to_location.lat, res.to_location.long])
        setSelectedProducts(res.steps[0].products)
        setDeliveryPrice(res.delivery_price)
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    setIsCard(formik.values.payment_type === "payme")
    if (formik.values.client && formik.values.payment_type === "payme") {
      getUserPaymentCard({
        limit: 100,
        page: 1,
        user_id: formik.values.client.value,
      }).then((res) => {
        setCards((prev) => [...prev, ...res.cards])
      })
    }
  }, [formik.values.client, formik.values.payment_type])

  useEffect(() => {
    if (lastOrders.length > 0 && !params.id && lastOrders[orderHistoryPage]) {
      setLastOrderId(lastOrders[orderHistoryPage].id)
      if (lastOrders[orderHistoryPage].steps[0].products) {
        setSelectedProducts([
          ...lastOrders[orderHistoryPage]?.steps[0]?.products,
        ])
      }
      if (lastOrders[orderHistoryPage]?.external_order_id) {
        setLastOrderId(lastOrders[orderHistoryPage].external_order_id)
      }
    }
  }, [orderHistoryPage, lastOrders])

  useEffect(() => {
    if (
      formik.values.client &&
      formik.values.branch &&
      formik.values.client.action !== "create-option" &&
      !params.id
    ) {
      getOrders({
        page: 1,
        limit: 10,
        region_ids: region_ids.join(","),
        customer_id: formik.values.client.value,
        with_products: true,
        branch_ids: formik.values.branch.value,
      }).then((res) => {
        if (res.orders) {
          setLastOrders(res.orders)
          setOrderHistoryPage(0)
          setLastAddress(
            res.orders.map((item) => ({
              address: item.to_address,
              location: item.to_location,
            }))
          )
        }
        if (res.count === "0") {
          setLastOrderId(null)
          setLastOrders([])
          setLastAddress([])
          setSelectedProducts([])
        }
      })
    }
  }, [formik.values.client, formik.values.branch])

  const formatLikeOptions = (arr) =>
    arr.map((elm) => ({ label: elm.name, value: elm.id, elm }))

  if (loader)
    return (
      <div>
        <CustomSkeleton />
      </div>
    )

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={PrintIcon}
        color="zink"
        size="medium"
        shape="outlined"
        onClick={() => console.log("clicked")}
        borderColor="bordercolor"
      >
        {t("print")}
      </Button>
    </div>
  )

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Header
          title={t("order")}
          startAdornment={[
            params.id && (
              <h3 className="pr-4 text-secondary text-sm text-medium">
                ID {formik?.values?.external_order_id}
              </h3>
            ),
            params.id && (
              <h3 className="text-secondary text-sm flex items-center">
                <CalendarTodayIcon
                  style={{ marginRight: "8px" }}
                  fontSize="small"
                />{" "}
                {moment(createdTime).format("DD.MM.YYYY HH:mm:ss")}
              </h3>
            ),
          ]}
          endAdornment={[
            params.id && (
              <TagBtn
                iconLeft={<QueryBuilderIcon fontSize="small" />}
                color="#1AC19D"
                bgColor="rgba(56, 217, 185, 0.15)"
                autoSize
              >
                <span className="ml-3">
                  {createdTime &&
                    orderTimer(createdTime, null, moment(new Date()))}
                </span>
              </TagBtn>
            ),
            params.id && (
              <ActionMenu
                id="change-status-btn"
                customBtn={statusCheck(statusId, t, true)}
                actions={[
                  {
                    title: t("cancel"),
                    icon: <ClearIcon />,
                    color: "red",
                    action: () =>
                      setDeleteModal({
                        id: params.id,
                        shipper_id: formik.values.shipper.value,
                      }),
                  },
                  {
                    title: t("end.process"),
                    icon: <CheckIcon />,
                    color: "green",
                    action: () =>
                      changeStatus("e665273d-5415-4243-a329-aee410e39465"),
                  },
                ]}
              />
            ),
            // <Button
            //   icon={CancelIcon}
            //   color="red"
            //   shape="outlined"
            //   onClick={() => history.goBack()}
            //   size="large"
            //   borderColor="bordercolor"
            // >
            //   {t("cancel")}
            // </Button>,
            <Button
              size="large"
              icon={SaveIcon}
              type="submit"
              loading={saveLoading}
            >
              {t("save")}
            </Button>,
          ]}
        />
        <Filter extra={extraFilter}>
          <StyledTabs
            value={tabValue}
            onChange={(e, val) => {
              setTabValue(val)
            }}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={tabLabel(t("Основное"))} value="main" />
            <StyledTab
              label={tabLabel(t("История изменений"))}
              value="userOrders"
            />
          </StyledTabs>
        </Filter>
        <TabBody tab="main">
          <div
            className="p-4 w-full box-border font-body flex flex-col gap-4"
            style={{ fontSize: "14px", lineHeight: "24px" }}
          >
            <MainContent
              formik={formik}
              shippers={shippers}
              branches={branches}
              deliveryPrice={deliveryPrice}
              placemarkGeometry={placemarkGeometry}
              setPlacemarkGeometry={setPlacemarkGeometry}
              setMapChange={setMapChange}
              params={params}
              mapCenter={mapCenter}
              mapLoading={mapLoading}
              setAddressList={setAddressList}
              addressList={addressList}
              lastAddress={lastAddress}
              setSearchAddress={setSearchAddress}
              clearProducts={() => {
                setSelectedProducts([])
              }}
            />
            <ProductContent
              formik={formik}
              deliveryPrice={deliveryPrice}
              shipperId={formik.values?.shipper?.value}
              selectedProducts={selectedProducts}
              productRef={productRef}
              setSelectedProducts={setSelectedProducts}
              discountDeliveryPrice={discountDeliveryPrice}
              setDiscountDeliveryPrice={setDiscountDeliveryPrice}
              cards={cards}
              lastOrderId={lastOrderId}
              courierTypes={courierTypes}
              orderAmountRestaurant={orderAmountRestaurant}
              vendorEditTime={vendorEditTime}
              // setLastOrder={setLastOrder}
              // lastOrder={lastOrder}
              setOrderHistoryPage={(action) => {
                if (action === "increment") {
                  if (lastOrders.length > orderHistoryPage + 1)
                    setOrderHistoryPage((prev) => prev + 1)
                } else if (orderHistoryPage !== 0) {
                  setOrderHistoryPage((prev) => prev - 1)
                }
              }}
            />
          </div>
        </TabBody>
        <TabBody tab="userOrders">
          <UserOrdersTable userId={userId} setTabValue={setTabValue} />
        </TabBody>
      </form>
      <Modal
        disable={msg.length >= 1 ? false : true}
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => changeStatus()}
        loading={deleteLoading}
      >
        <TextArea
          aria-label="minimum height"
          minRows={3}
          className="mb-6"
          placeholder="Причина"
          error={msg.length >= 1 ? false : true}
          onChange={(e) => handleMsg(e)}
          value={msg}
        />
      </Modal>
    </div>
  )
}
