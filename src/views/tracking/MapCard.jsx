/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import Card from "../../components/Card"
import Switch from "../../components/Switch"
import { Map, Placemark, YMaps } from "react-yandex-maps"
import { mapDefaults, apikey } from "../../constants/mapDefaults"
import CourierTable from "./CourierTable"
import { getCouriersLastLocation } from "../../services/tracking"
import green from "../../assets/icons/car_green.png"
import orange from "../../assets/icons/car_orange.png"
import yellow from "../../assets/icons/car_yellow.png"

const MapCard = () => {
  const { t } = useTranslation()
  const yandexMap = useRef(null)
  const [couriesTacking, setCouriersTracking] = useState([])
  const [templates, setTemplates] = useState([])
  const [online, setOnline] = useState(false)
  const [branches, setBranches] = useState([])
  const statusImage = (item) => {
    switch (item.orders.length) {
      case 0:
        return green
      case 1:
        return yellow
      case 2:
        return orange
      case 3:
        return orange
      default:
        return green
    }
  }
  useEffect(() => {
    let params = {}
    if (online) {
      params.is_online = online
    }
    getCouriersLastLocation({ ...params }).then((res) => {
      setCouriersTracking(res.courier_trackings)
      const values = []
      if (
        yandexMap &&
        yandexMap.current &&
        yandexMap.current.templateLayoutFactory
      ) {
        res.courier_trackings?.forEach((item) => {
          values.push(
            yandexMap.current.templateLayoutFactory
              .createClass(`<div style='width: 300px'>
    <span style='background: ${
      item.courier.is_online ? "#54e346" : "#bbbfca"
    }; padding: 5px; border-radius: 3px; font-size: 16px; color: ${
              item.courier.is_online ? "white" : "black"
            }'>
      ${item.courier.first_name + " " + item.courier.last_name}
    </span>
  </div>`)
          )
        })
        setTemplates(values)
      }
    })
    // getBranches({ limit: 1000, page: 1 }, "").then((res) => {
    //   setBranches(res.branches)
    // })
  }, [online])

  const createTemplateLayoutFactory = (ymaps) => {
    //console.log(ymaps)
    yandexMap.current = ymaps
    const values = []
    console.log("dsadsads")
    couriesTacking.forEach((item) => {
      values.push(
        ymaps.templateLayoutFactory.createClass(`<div style='width: 300px'>
    <span style='background: ${
      item.courier.is_online ? "#54e346" : "#bbbfca"
    }; padding: 5px; border-radius: 3px; font-size: 16px; color: ${
          item.courier.is_online ? "white" : "black"
        }'>
      ${item.courier.first_name + " " + item.courier.last_name}
    </span>
  </div>`)
      )
    })
    setTemplates(values)
  }

  return (
    <div>
      <Card
        headerClass="py-3.5"
        title="Карта"
        extra={
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium">Онлайн куреры</span>
            <Switch checked={online} onChange={(val) => setOnline(val)} />
          </div>
        }
      >
        <div
          style={{
            height: 424,
          }}
          className="w-full rounded-md overflow-hidden"
        >
          <YMaps
            ref={yandexMap}
            query={{ apikey, lang: "ru_RU", load: "package.full" }}
          >
            {yandexMap && yandexMap.current && (
              <Map
                // onClick={setMapRef}
                onLoad={createTemplateLayoutFactory}
                width="100%"
                height="100%"
                state={{ ...mapDefaults }}
              >
                {/* {branches && Boolean(branches.length) ? (
                  branches.map(({ elm, label }, id) => (
                    <Placemark
                      key={id}
                      properties={{
                        iconContent: `${label}`,
                      }}
                      options={{
                        preset: "islands#redStretchyIcon",
                      }}
                      geometry={[elm?.location.lat, elm?.location.long]}
                    />
                  ))
                ) : (
                  <></>
                )} */}
                {couriesTacking && Boolean(couriesTacking.length) ? (
                  couriesTacking.map((elm, index) => (
                    <Placemark
                      key={elm.id}
                      options={{
                        iconLayout: "default#imageWithContent",
                        iconImageHref: statusImage(elm),
                        iconImageSize: [35, 35],
                        iconImageOffset: [0, 0],
                        iconContentOffset: [-135, -22],
                        iconContentLayout: templates[index],
                      }}
                      geometry={[
                        elm?.tracking.location.lat,
                        elm?.tracking.location.long,
                      ]}
                    />
                  ))
                ) : (
                  <></>
                )}
              </Map>
            )}
          </YMaps>
        </div>
        <CourierTable />
      </Card>
    </div>
  )
}

export default MapCard
