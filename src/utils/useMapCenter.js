import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getOneGeozone } from "../services/geozones"
import { getOneRegion } from "../services/region"

export const useMapCenter = () => {
  const { region_ids } = useSelector((state) => state.auth)
  const [mapCenter, setMapCenter] = useState([41.311151, 69.279737])
  useEffect(() => {
    getOneRegion(region_ids[0]).then((res) => {
      if (res.geozone_id)
        getOneGeozone(res.geozone_id).then((result) => {
          const lats = result.points.map((item) => item.lat)
          const lons = result.points.map((item) => item.lon)
          setMapCenter([
            (Math.min(...lats) + Math.max(...lats)) / 2,
            (Math.min(...lons) + Math.max(...lons)) / 2,
          ])
        })
    })
  }, [])

  return mapCenter
}
