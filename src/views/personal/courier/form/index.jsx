import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"

//components and functions
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Button from "../../../../components/Button"
import {
  getCourier,
  postCourier,
  updateCourier,
  getCouriersVehicle,
  updateCourierVehicle,
  postCourierVehicle,
} from "../../../../services/courier"
import { getCourierTypes } from "../../../../services/courierType"
import { getRegions } from "../../../../services/region"
import CustomSkeleton from "../../../../components/Skeleton"
import CreateCourier from "./Create"
//icons
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { StyledTab, StyledTabs } from "../../../../components/StyledTabs"
import Filters from "../../../../components/Filters"
import CreateTransport from "./transport"
import TransactionTable from "./transactions"
import OrderCourier from "./orders"
import AddIcon from "@material-ui/icons/Add"

export default function MainCourier() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const [courierTypes, setCourierTypes] = useState([])
  const [regions, setRegions] = useState([])
  const [selectedTab, setSelectedTab] = useState("courier")
  const [vehicleClasses, setVehicleClasses] = useState([])
  const colors = [
    {
      value: "red",
      label: "red",
    },
    {
      value: "green",
      label: "green",
    },
    {
      value: "black",
      label: "Чёрный",
    },
    {
      value: "nigga",
      label: "Ниггер",
    },
  ]
  useEffect(() => {
    getCarClass()
    fetchData()
    getItem()
  }, [])

  const TabBody = useCallback(
    ({ tab, children }) => {
      if (tab === selectedTab) return children
      return <></>
    },
    [selectedTab]
  )

  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>
  }

  const headersByTab = useMemo(() => {
    switch (selectedTab) {
      case "courier":
      case "transport":
        return [
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
        ]
      case "transactions":
        return [
          <Button icon={AddIcon} size="medium" onClick={() => console.log("c")}>
            {t("add")}
          </Button>,
        ]
      case "orders":
        return [
          <Button icon={AddIcon} size="medium" onClick={() => console.log("c")}>
            {t("add")}
          </Button>,
        ]
      default:
        return []
    }
  }, [selectedTab])

  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getCourier(id)
      .then((res) => {
        formik.setValues({
          first_name: res.first_name,
          last_name: res.last_name,
          max_orders_count: res.max_orders_count,
          phone: res.phone?.substring(4),
          region: {
            label: res.region_name,
            value: res.region_id,
          },
          description: res.description,
          courier_type: {
            label: res.courier_type?.name,
            value: res.courier_type?.id,
          },
          image: res.image
            ? res.image.replace(process.env.MINIO_BASE_URL, "")
            : null,
          is_active: res.is_active,
          courier_vehicle: res.courier_vehicle.id
            ? {
                id: res.courier_vehicle.id,
                model: res.courier_vehicle.model,
                car_brand: res.courier_vehicle.car_brand,
                car_class: {
                  value: res.courier_vehicle.vehicle_class.id,
                  label: res.courier_vehicle.vehicle_class.class.ru,
                },
                vehicle_number: res.courier_vehicle.vehicle_number,
                car_colour: colors.find(
                  (item) => item.value === res.courier_vehicle.car_colour
                ),

                picture: res.courier_vehicle.picture
                  ? res.courier_vehicle.picture.replace(
                      process.env.MINIO_BASE_URL,
                      ""
                    )
                  : null,
              }
            : {},
        })
      })
      .finally(() => setLoader(false))
  }

  const getCarClass = () => {
    getCouriersVehicle().then((res) => {
      setVehicleClasses(
        res.vehicle_classes.map((item) => ({
          value: item.id,
          label: item.class.ru,
        }))
      )
    })
  }

  const fetchData = async () => {
    setLoader(true)
    try {
      const { courier_type } = await getCourierTypes({ limit: 1000 })
      setCourierTypes(
        courier_type
          ? courier_type.map((elm) => ({ label: elm.name, value: elm.id }))
          : []
      )

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

  const initialValues = useMemo(
    () => ({
      first_name: "",
      last_name: "",
      phone: "",
      description: "",
      max_orders_count: null,
      courier_type: null,
      region: null,
      image: null,
      is_active: false,
      courier_vehicle: {
        model: "",
        car_brand: "",
        car_class: null,
        vehicle_number: "",
        picture: "",
        car_colour: null,
      },
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      first_name: defaultSchema,
      last_name: defaultSchema,
      max_orders_count: defaultSchema,
      image: defaultSchema,
      phone: yup
        .number()
        .typeError(t("required.field.error"))
        .positive("Введите корректный номер")
        .integer("Введите корректный номер")
        .required(t("required.field.error")),
      courier_type: defaultSchema,
      region: defaultSchema,
      courier_vehicle: yup.object().shape({
        model: defaultSchema,
        car_brand: defaultSchema,
        car_class: defaultSchema,
        vehicle_number: defaultSchema,
        car_colour: defaultSchema,
      }),
    })
  }, [])

  const saveChanges = (data) => {
    const courier_vehicle = {
      ...data.courier_vehicle,
      car_class: +data.courier_vehicle.car_class.value,
      car_colour: data.courier_vehicle.car_colour.value,
      is_active: true,
      picture: `/${data.courier_vehicle.picture}`,
    }

    delete data.courier_vehicle
    data.image = data.image && `${process.env.MINIO_BASE_URL}${data.image}`
    setSaveLoading(true)
    const selectedAction = id
      ? updateCourier(id, { ...data, is_free: true })
      : postCourier({ ...data, is_free: true })

    selectedAction
      .then((res) => {
        if (formik.values.courier_vehicle.id) {
          updateCourierVehicle(id, {
            ...courier_vehicle,
            courier_id: id,
          }).then(() => {
            history.goBack()
          })
        } else {
          postCourierVehicle(res.id, {
            ...courier_vehicle,
            courier_id: res.id,
          }).then(() => {
            history.goBack()
          })
        }
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    const data = {
      ...values,
      region_id: values?.region?.value,
      courier_type_id: values.courier_type.value,
      phone: "+998" + values.phone,
    }
    delete data.courier_type
    delete data.region
    saveChanges(data)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  if (loader) return <CustomSkeleton />

  const routes = [
    // {
    //   title: t("personal"),
    //   link: true,
    //   route: `/home/courier/list`,
    // },
    {
      title: t("couriers"),
      link: true,
      route: `/home/courier/list`,
    },
    {
      title: id ? formik.values?.courier_type?.label : t("create"),
    },
  ]

  const { handleSubmit } = formik

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={headersByTab}
        />
        <Filters className="mb-0">
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
            <StyledTab label={tabLabel(t("main.page"))} value="courier" />
            {/* {id && (
              <StyledTab label={tabLabel(t("transport"))} value="transport" />
            )} */}
            {id && (
              <StyledTab
                label={tabLabel(t("transactions"))}
                value="transactions"
              />
            )}
            {id && <StyledTab label={tabLabel(t("orders"))} value="orders" />}
          </StyledTabs>
        </Filters>

        <TabBody tab="courier">
          <div className="p-4 w-full grid grid-cols-12 gap-4">
            <CreateCourier
              formik={formik}
              regions={regions}
              courierTypes={courierTypes}
            />
            <CreateTransport
              formik={formik}
              vehicleClasses={vehicleClasses}
              colors={colors}
            />
          </div>
        </TabBody>
        {/* <TabBody tab="transport">
          
        </TabBody> */}
        <TabBody tab="transactions">
          <TransactionTable />
        </TabBody>
        <TabBody tab="orders">
          <OrderCourier courier_id={id} />
        </TabBody>
      </form>
    </div>
  )
}
