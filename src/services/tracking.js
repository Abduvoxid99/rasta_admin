// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "../utils/axios"

export const getCouriersLastLocation = (params) =>
  request({ method: "get", url: "/tracking/couriers-last-location", params })
