// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "../utils/axios"

export const getDashboarOrderInfo = (params) =>
  request({ method: "get", url: "/dashboard", params })

export const getDashboarStatistic = (params) =>
  request({ method: "get", url: "/dashboard-statistic", params })

export const getDashboardTopItems = (params) =>
  request({ method: "get", url: "/dashboard-top", params })
