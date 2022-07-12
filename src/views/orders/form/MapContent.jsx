import { CircularProgress } from "@material-ui/core"
import React, { useRef, useEffect, useState } from "react"
import { YMaps, Map, Placemark } from "react-yandex-maps"
import { mapDefaults, apikey } from "../../../constants/mapDefaults"
import Marquee from "react-fast-marquee"

export default function MapContent({
  placemarkGeometry,
  setPlacemarkGeometry,
  formik,
  branches,
  setMapChange,
  mapCenter,
  params,
  mapLoading,
  lastAddress,
}) {
  const yandexMap = useRef(null)
  const mapRef = useRef(null)
  function getAddress(ymap, e) {
    ymap.api.geocode(e.get("coords")).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0)
      formik.setFieldValue("to_address", firstGeoObject.getAddressLine())
    })
  }

  useEffect(() => {
    if (placemarkGeometry && placemarkGeometry.length > 0 && mapRef.current) {
      mapRef.current.panTo(placemarkGeometry, {
        duration: 750,
        timingFunction: "ease-in",
      })
    }
  }, [placemarkGeometry])

  // useEffect(() => {
  //   if (mapRef.current) {
  //     mapRef.current.geoObjects.events.add("click", (e) => {
  //       var object = e.get("target")
  //       mapRef.current.geoObjects.remove(object)
  //     })
  //   }
  // }, [mapRef])

  const setMapRef = (e) => {
    if (params.id) {
      setMapChange(true)
    }
    setPlacemarkGeometry(e.get("coords"))
    getAddress(yandexMap.current.ymaps, e)
  }

  return (
    <div style={{ width: "100%", height: 300, position: "relative" }}>
      {mapLoading && (
        <div className="map-loader">
          <CircularProgress
            size={40}
            style={{ color: "var(--color-primary)" }}
          />
        </div>
      )}
      <YMaps
        ref={yandexMap}
        query={{ apikey, lang: "ru_RU", load: "package.full" }}
      >
        <Map
          onClick={setMapRef}
          width="100%"
          height="100%"
          instanceRef={mapRef}
          state={{ ...mapDefaults, center: mapCenter }}
        >
          {placemarkGeometry.length ? (
            <Placemark geometry={placemarkGeometry} />
          ) : (
            <></>
          )}
          {branches && branches.length ? (
            branches?.map(({ elm, label }, id) => (
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
          )}
        </Map>
      </YMaps>
      <div className="absolute bottom-2 left-0 w-full">
        <div className="flex overflow-x-scroll no-scrollbar">
          {lastAddress?.map((item) => (
            <div
              className="py-1.5 px-4 flex items-center text-sm bg-yellow-100 text-yellow-600 rounded-2xl transition-all font-medium hover:scale-125 cursor-pointer mr-4"
              onClick={() => {
                formik.setFieldValue("to_address", item.address)
                setPlacemarkGeometry([item.location.lat, item.location.long])
              }}
            >
              <Marquee
                className="marquee-text"
                play={false}
                pauseOnHover={false}
                speed={60}
              >
                {item.address}
              </Marquee>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
