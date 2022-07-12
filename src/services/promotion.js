import request from "../utils/axios"

export const getPromotions = (params) =>
  request({ method: "get", url: "/promotion", params })
export const savePromotion = (data) =>
  request({ method: "post", url: "/promotion", data })
export const updatePromotion = (id, data) =>
  request({ method: "put", url: `/promotion/${id}`, data })
export const getOnePromotion = (id, params) =>
  request({ method: "get", url: `/promotion/${id}`, params })
export const deletePromotion = (id, params) =>
  request({ method: "delete", url: `/promotion/${id}`, params })
