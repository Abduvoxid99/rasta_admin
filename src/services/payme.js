import request from "../utils/axios"

export const getPayme = (params) =>
  request({ method: "get", url: "/payme-settings", params })
export const updatePayme = (data, params) =>
  request({ method: "put", url: `/payme-settings`, data, params })
