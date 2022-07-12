import { useMemo, useState, useEffect, useRef } from "react"
import Card from "../../../../components/Card"
import { useTranslation } from "react-i18next"
import Switch from "../../../../components/Switch"
import { useHistory, useParams } from "react-router-dom"
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined"
import { Input } from "alisa-ui"
import Form from "../../../../components/Form/Index"
import * as yup from "yup"
import { useFormik } from "formik"
import Header from "../../../../components/Header"
import Select from "../../../../components/Select"
import Button from "../../../../components/Button"
import Breadcrumb from "../../../../components/Breadcrumb"
import TextFilter from "../../../../components/Filters/TextFilter"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import { getFare, postFare, updateFare } from "../../../../services"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { getRegions } from "../../../../services/region"
import { showAlert } from "../../../../redux/reducers/alertReducer"
import { useDispatch } from "react-redux"
import { tariffTimers } from "../../../../utils/tariffHelpers"
import { isNumber } from "../../../../utils/inputHelpers"
import Rainbow from "rainbowvis.js"
import { getCourierTypes } from "../../../../services/courierType"

export default function TariffCreate() {
  const { t } = useTranslation()
  const history = useHistory()
  const params = useParams()
  const dispatch = useDispatch()
  const typeSelectRef = useRef()
  const [saveLoading, setSaveLoading] = useState(false)
  const [timer, setTimer] = useState([])
  const [isSchedule, setIsSchedule] = useState(false)
  const [regions, setRegions] = useState([])
  const [region, setRegion] = useState(null)
  const [max, setMax] = useState(100)
  const [min, setMin] = useState(1)
  const [selectedTime, setSelectedTime] = useState(
    Array(168)
      .fill()
      .map(() => false)
  )
  const [courierTypes, setCourierTypes] = useState([])

  var rainbow = new Rainbow()
  rainbow.setSpectrum("#EBFFF1", "#E4FCFC", "#FFFCC2", "#FED6CD")
  rainbow.setNumberRange(min, max)
  useEffect(() => {
    getRegions({ limit: 1000 }).then((res) => {
      setRegions(res.regions.map((elm) => ({ label: elm.name, value: elm.id })))
    })
    getCourierTypes({ limit: 1000 }).then((res) => {
      setCourierTypes(
        res.courier_type
          ? res.courier_type.map((elm) => ({ label: elm.name, value: elm.id }))
          : []
      )
    })

    if (params.id) {
      getFare(params.id).then((res) => {
        setValues({
          base_price: res.base_price,
          type: findType.find((elm) => elm.value === res.type),
          base_distance: res.base_distance ?? null,
          price_per_km: res.price_per_km ?? null,
          name: res.name,
          courier_type_id: res.courier_type_id,
        })
        setRegion(res.region_ids)
        setSelectedTime([...res.is_dynamic_expensive])
        let maximum = Math.max(...res.dynamic_price_per_km)
        let minimum = Math.min(...res.dynamic_price_per_km)
        if (maximum !== -Infinity && minimum !== -Infinity) {
          console.log(maximum, minimum)
          if (maximum !== minimum && maximum > minimum) {
            setMax(maximum)
            setMin(minimum)
          } else if (minimum !== 0 && maximum !== 0) {
            setMax(maximum * 2)
            setMin(maximum)
          }
        }

        setIsSchedule(res.is_price_dynamic)
        setTimer(tariffTimers(res.dynamic_price_per_km))
      })
    }
  }, [])

  const initialValues = useMemo(
    () => ({
      name: null,
      base_price: null,
      type: null,
      base_distance: null,
      price_per_km: null,
      region_ids: [],
      courier_type_id: null,
    }),
    []
  )

  useEffect(() => {
    if (region)
      setFieldValue(
        "region_ids",
        region?.map((item) => regions.find((val) => val.value === item))
      )
  }, [region, regions])

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      base_price: defaultSchema,
      type: defaultSchema,
      name: defaultSchema,
      region_ids: yup.array().min(1, t("required.field.error")),
    })
  }, [])

  const onSubmit = (values) => {
    const data = {
      ...values,
      courier_type_id: values?.courier_type_id?.value,
      type: values?.type?.value,
    }

    const dynamic_price_per_km = []

    Array(7)
      ?.fill()
      ?.map((_, index) => {
        timer.forEach((_, j) => {
          dynamic_price_per_km.push(timer[j][index + 1])
        })
      })

    data?.type === "fixed" && delete data.base_distance
    data?.type === "fixed" && delete data.price_per_km
    data.is_price_dynamic = isSchedule
    data.dynamic_price_per_km = dynamic_price_per_km
    data.region_ids = values.region_ids.map((item) => item.value)
    data.is_dynamic_expensive = selectedTime
    setSaveLoading(true)
    const selectedAction = params.id
      ? updateFare(params.id, data)
      : postFare(data)
    selectedAction
      .then((res) => {
        history.goBack()
      })
      .finally(() => {
        setSaveLoading(false)
      })
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik

  useEffect(() => {
    if (isSchedule && !params.id && values.price_per_km) {
      setTimer(tariffTimers(values.price_per_km))
    }
  }, [isSchedule])

  const changeShedulePrice = (e, parentIndex, index) => {
    let newTimers = timer
    newTimers[parentIndex][index] = parseInt(e.target.value)
    setTimer([...newTimers])
  }

  useEffect(() => {
    const newTimers = []
    if (timer.length > 0) {
      timer.forEach((item) => {
        item.forEach((el) => {
          if (el && typeof el !== "string" && !isNaN(el)) newTimers.push(el)
        })
      })
      let maximum = Math.max(...newTimers)
      let minimum = Math.min(...newTimers)
      if (maximum !== -Infinity && minimum !== -Infinity) {
        if (maximum !== minimum && maximum > minimum) {
          setMax(maximum)
          setMin(minimum)
        } else if (minimum !== 0 && maximum !== 0) {
          setMax(maximum * 2)
          setMin(maximum)
        }
      }
    }
  }, [timer])

  // ****** CONSTANTS ******
  const findType = [
    {
      label: `${t("fixed")}`,
      value: "fixed",
    },
    {
      label: `${t("not.fixed")}`,
      value: "not-fixed",
    },
  ]

  const columns = [
    {
      title: t("time"),
    },
    {
      title: t("monday"),
    },
    {
      title: t("tuesday"),
    },
    {
      title: t("wednesday"),
    },
    {
      title: t("thursday"),
    },
    {
      title: t("friday"),
    },
    {
      title: t("saturday"),
    },
    {
      title: t("sunday"),
    },
  ]

  const routes = [
    {
      title: t(`fares`),
      link: true,
      route: `/home/settings/fares`,
    },
    {
      title: t("create"),
    },
  ]

  const changeIsShedule = (e) => {
    if (!values.type) {
      if (typeSelectRef.current) {
        typeSelectRef.current.focus()
        typeSelectRef.current.select()
      }
      dispatch(showAlert("Выберите тип нефиксированный"))
      return
    } else if (values.type && values.type.value !== "not-fixed") {
      dispatch(showAlert("Выберите тип нефиксированный"))
      return
    }
    if (!values.price_per_km) {
      dispatch(showAlert("Введите сумма за км"))
      return
    }
    setIsSchedule(e)
  }

  useEffect(() => {
    if (formik.values.type && formik.values.type.value === "fixed") {
      setIsSchedule(false)
    }
  }, [formik.values.type])

  const handleChangeTime = (e, rowI, colI) => {
    const newData = selectedTime
    newData[rowI + colI * 24] = e.target.value === "false" ? true : false
    setSelectedTime([...newData])
  }

  const headerButtons = [
    <Button
      icon={CancelIcon}
      size="large"
      shape="outlined"
      color="red"
      borderColor="bordercolor"
      onClick={() => history.goBack()}
    >
      {t("cancel")}
    </Button>,
    <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
      {t("save")}
    </Button>,
  ]

  return (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <div className="m-4">
        <div className="grid grid-cols-2 gap-5">
          <Card title={t("general.information")}>
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">
                <span className="mr-1 font-bold text-lg text-red-700">*</span>
                {t("name")}
              </div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="name">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="name"
                  />
                </Form.Item>
              </div>
              {/* <div className="input-label">{t("country")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="name">
                  <Input size="large" />
                </Form.Item>
              </div> */}
              <div className="input-label">
                <span className="mr-1 font-bold text-lg text-red-700">*</span>
                {t("city")}
              </div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="region_ids">
                  <Select
                    id="region_ids"
                    isMulti
                    height={40}
                    name="region_ids"
                    value={values.region_ids}
                    onChange={(value) => setFieldValue("region_ids", value)}
                    options={regions}
                  />
                </Form.Item>
              </div>
              <div className="input-label">{t("transport")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="courier_type_id">
                  <Select
                    height={40}
                    id="courier_type_id"
                    name="courier_type_id"
                    value={courierTypes.find(
                      (item) => item.value === values.courier_type_id
                    )}
                    onChange={(value) =>
                      setFieldValue("courier_type_id", value)
                    }
                    options={courierTypes}
                  />
                </Form.Item>

                {/* <Form.Item formik={formik} name="name">
                  <Input size="large" />
                </Form.Item> */}
              </div>
            </div>
          </Card>

          <Card title={t("price")}>
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">
                <span className="mr-1 font-bold text-lg text-red-700">*</span>
                {t("type")}
              </div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="type">
                  <Select
                    id="type"
                    height={40}
                    options={findType}
                    value={values.type}
                    openMenuOnFocus={true}
                    ref={typeSelectRef}
                    defaultValue={findType[0]}
                    onChange={(val) => {
                      setFieldValue("type", val)
                    }}
                  />
                </Form.Item>
              </div>

              <div className="input-label">
                <span className="mr-1 font-bold text-lg text-red-700">*</span>
                {t("base.price")}
              </div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="base_price">
                  <Input
                    type="number"
                    id="base_price"
                    onKeyPress={isNumber}
                    size="large"
                    value={values.base_price}
                    onChange={handleChange}
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                  />
                </Form.Item>
              </div>

              {values?.type?.value === "not-fixed" ? (
                <>
                  <div className="input-label">{t("included.kilometers")}</div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="base_distance">
                      <Input
                        type="number"
                        id="base_distance"
                        size="large"
                        onKeyPress={isNumber}
                        value={values.base_distance}
                        onChange={handleChange}
                        onKeyDown={(event) => {
                          if (event.keyCode === 38 || event.keyCode === 40) {
                            event.preventDefault()
                          }
                        }}
                      />
                    </Form.Item>
                  </div>

                  <div className="input-label">
                    {t("further.amount.per.km")}
                  </div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="price_per_km">
                      <Input
                        type="number"
                        id="price_per_km"
                        size="large"
                        name="price_per_km"
                        min="1"
                        onKeyPress={isNumber}
                        value={values.price_per_km}
                        onChange={handleChange}
                        onKeyDown={(event) => {
                          if (event.keyCode === 38 || event.keyCode === 40) {
                            event.preventDefault()
                          }
                        }}
                      />
                    </Form.Item>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </Card>
          <Card
            className="col-span-2"
            extra={
              <div className="flex items-center gap-3">
                <span className="text-base text-black-1">{t("timetable")}</span>
                <Switch onChange={changeIsShedule} checked={isSchedule} />
                <InfoOutlinedIcon className="fill-current text-secondary" />
              </div>
            }
          >
            {isSchedule ? (
              <TableContainer className="rounded-md border border-bordercolor">
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {columns.map((elm) => (
                        <TableCell key={elm.key}>
                          <TextFilter title={elm.title} />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Boolean(timer.length) &&
                      timer.map((elm, index) => (
                        <TableRow
                          // className={colors[index]}
                          key={"timer" + `-${index}`}
                        >
                          {elm.map((col, i) => (
                            <TableCell
                              key={`element-${i}`}
                              style={{
                                backgroundColor:
                                  min === 1 && max === 100
                                    ? "bg-blue-100"
                                    : typeof col === "string"
                                    ? ""
                                    : !isNaN(col)
                                    ? `#${rainbow.colourAt(col)}`
                                    : "",
                              }}
                            >
                              {i === 0 ? (
                                col
                              ) : (
                                <div
                                  className="flex items-center"
                                  key={`element-timer-${i}`}
                                >
                                  <input
                                    type="number"
                                    className="w-30"
                                    name={`input-timer-${i}`}
                                    value={col}
                                    onChange={(e) =>
                                      changeShedulePrice(e, index, i)
                                    }
                                    onKeyDown={(event) => {
                                      if (
                                        event.keyCode === 38 ||
                                        event.keyCode === 40
                                      ) {
                                        event.preventDefault()
                                      }
                                    }}
                                    onKeyPress={isNumber}
                                  />
                                  сум
                                  <input
                                    onChange={(e) =>
                                      handleChangeTime(e, index, i - 1)
                                    }
                                    checked={selectedTime[index + (i - 1) * 24]}
                                    className="ml-1 rounded cursor-pointer"
                                    value={selectedTime[index + (i - 1) * 24]}
                                    style={{
                                      minWidth: "15px",
                                      minHeight: "15px",
                                    }}
                                    type="checkbox"
                                  />
                                </div>
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              ""
            )}
          </Card>
        </div>
      </div>
    </form>
  )
}
