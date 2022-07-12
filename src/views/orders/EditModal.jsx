import "./style.scss"
import {
  Modal,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import Button from "../../components/Button"
import { useTranslation } from "react-i18next"
import { useEffect, useRef, useState } from "react"
import { getOneOrder } from "../../services"
import moment from "moment"
import { numberToPrice } from "../../utils/numberToPrice"
import { Placemark, YMaps, Map } from "react-yandex-maps"
import { useMapCenter } from "../../utils/useMapCenter"
import { mapDefaults, apikey } from "../../constants/mapDefaults"
import green from "../../assets/icons/car_green.png"
import { useHistory } from "react-router-dom"

const useStyles = makeStyles(() => ({
  modal: {
    position: "fixed!important",
    top: "0!important",
    right: "0!important",
    bottom: "0!important",
    left: "0!important",
    zIndex: "1000!important",
    overflow: "auto!important",
    display: "flex",
    alignItems: "center",
  },
}))

const EditModal = ({
  open = false,
  close,
  confirm,
  onClose,
  onConfirm,
  title,
  footer,
  loading,
  className,
  style,
  width = 1000,
  offsetTop = 100,
  children,
  disable = false,
  isWarning = true,
  header = <div></div>,
  ...props
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [order, setOrder] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [mapCenter, setMapCenter] = useState(useMapCenter())
  const [template, setTemplate] = useState(null)
  const yandexMap = useRef(null)
  const history = useHistory()
  const createTemplateLayoutFactory = (ymaps) => {
    if (order?.courier) {
      setTemplate(ymaps)
    }
  }

  const initialSteps = [
    {
      title: "Заказ создан",
      statusId: "ccb62ffb-f0e1-472e-bf32-d130bea90617",
    },
    {
      title: "Филиал принял",
      statusId: "1b6dc9a3-64aa-4f68-b54f-71ffe8164cd3",
    },
    {
      title: "Курьер принял",
      statusId: "8781af8e-f74d-4fb6-ae23-fd997f4a2ee0",
    },
    {
      title: "Филиал подготовил",
      statusId: "b0cb7c69-5e3d-47c7-9813-b0a7cc3d81fd",
    },

    { title: "Курьер пути", statusId: "84be5a2f-3a92-4469-8283-220ca34a0de4" },
    {
      title: "Завершен",
      statusId:
        "79413606-a56f-45ed-97c3-f3f18e645972,e665273d-5415-4243-a329-aee410e39465",
    },
  ]
  const [steps, setSteps] = useState(initialSteps)

  useEffect(() => {
    if (open)
      getOneOrder(open).then((res) => {
        setOrder({
          ...res,
        })

        const lats = [res.to_location.lat, res.steps[0].location.lat]
        const lons = [res.to_location.long, res.steps[0].location.long]

        setMapCenter([
          (Math.min(...lats) + Math.max(...lats)) / 2,
          (Math.min(...lons) + Math.max(...lons)) / 2,
        ])
        const statusNotes = steps
        res?.status_notes?.forEach((item, index) => {
          let date = new Date(item.created_at)
          date.setHours(
            date.getHours() - new Date(date).getTimezoneOffset() / 60
          )

          const findIndex = steps.findIndex((elm) =>
            elm.statusId.includes(item.status_id)
          )

          if (findIndex >= 0)
            statusNotes[findIndex].created_at = moment(date).format(
              "DD.MM.YYYY HH:mm:ss"
            )
          setActiveStep(findIndex)
        })
      })
  }, [open])

  const clearAll = () => {
    setSteps(initialSteps)
    setActiveStep(0)
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => {
        onClose(clearAll)
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      {...props}
    >
      <Fade in={open}>
        <div
          className="modal-component rounded-md"
          style={{
            width,
            margin: "0 auto",
            position: "relative",
            top: offsetTop,
          }}
        >
          <div className="p-4 overflow-auto" style={{ height: "500px" }}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-lg font-medium">Информация</p>
              <Button
                style={{ width: "160px" }}
                size="large"
                color="blue"
                onClick={() => history.push(`/home/orders/${open}`)}
              >
                {t("edit")}
              </Button>
            </div>
            <Stepper
              activeStep={activeStep >= 0 ? activeStep + 1 : 0}
              alternativeLabel
            >
              {steps?.map((item, index) => (
                <Step key={item.statusId}>
                  <StepLabel>
                    {item.title}
                    <p className="font-normal mt-2">
                      {order && item.created_at}
                    </p>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <p className="font-normal text-md mb-2">Информация о клиенте</p>
            <TableContainer className="rounded-lg border border-lightgray-1 mb-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Имя клиента</TableCell>
                    <TableCell className="client-info-column">
                      {order?.client_name}
                    </TableCell>
                    <TableCell>Телефон клиента</TableCell>
                    <TableCell className="client-info-column">
                      {order?.client_phone_number}
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <p className="font-normal text-md mb-2">Адрес</p>
            <TableContainer className="rounded-lg border border-lightgray-1 mb-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Адрес</TableCell>
                    <TableCell className="client-info-column">
                      {order?.to_address}
                    </TableCell>
                    <TableCell>Квартира</TableCell>
                    <TableCell className="client-info-column">
                      {order?.apartment}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Этаж</TableCell>
                    <TableCell className="client-info-column">
                      {order?.floor}
                    </TableCell>
                    <TableCell>Подъезд</TableCell>
                    <TableCell className="client-info-column">
                      {order?.building}
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <p className="font-normal text-md mb-2">
              Информация о продуктe и Цена
            </p>
            <TableContainer className="rounded-lg border border-lightgray-1 mb-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>

                    <TableCell>Цена</TableCell>
                    <TableCell>Количество</TableCell>
                    <TableCell>Всего</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order?.steps[0]?.products?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name.ru}</TableCell>
                      <TableCell>{numberToPrice(item.price, "сум")}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {numberToPrice(item.quantity * item.price, "сум")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ width: "100%", height: 300, position: "relative" }}>
              <YMaps
                ref={yandexMap}
                query={{ apikey, lang: "ru_RU", load: "package.full" }}
              >
                {yandexMap && yandexMap.current ? (
                  <Map
                    width="100%"
                    height="100%"
                    onLoad={createTemplateLayoutFactory}
                    state={{ ...mapDefaults, center: mapCenter }}
                  >
                    {order && order.to_location ? (
                      <Placemark
                        geometry={[
                          order.to_location.lat,
                          order.to_location.long,
                        ]}
                      />
                    ) : (
                      ""
                    )}
                    {order &&
                    order.courier &&
                    order.courier.location &&
                    template ? (
                      <Placemark
                        options={{
                          iconLayout: "default#imageWithContent",
                          iconImageHref: green,
                          iconImageSize: [35, 35],
                          iconImageOffset: [0, 0],
                          iconContentOffset: [-135, -22],
                          iconContentLayout: template.templateLayoutFactory
                            .createClass(`<div style='width: 300px'>
    <span style='background: #54e346; padding: 5px; border-radius: 3px; font-size: 16px; color: white'>
      ${order.courier?.first_name}
    </span>
  </div>`),
                        }}
                        geometry={[
                          order.courier?.location.lat,
                          order.courier?.location.long,
                        ]}
                      />
                    ) : (
                      <></>
                    )}
                    {order && order.steps[0] ? (
                      <Placemark
                        key={order.steps[0].branch_id}
                        properties={{
                          iconContent: `${order.steps[0].branch_name}`,
                        }}
                        options={{
                          preset: "islands#redStretchyIcon",
                        }}
                        geometry={[
                          order.steps[0]?.location.lat,
                          order.steps[0]?.location.long,
                        ]}
                      />
                    ) : (
                      ""
                    )}
                  </Map>
                ) : (
                  ""
                )}
              </YMaps>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default EditModal
