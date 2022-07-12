// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "../utils/axios"

export const getNewsletter = (params) =>
  request({ method: "get", url: "/push", params })
export const getNewsletterOne = (id) =>
  request({ method: "get", url: `/push/${id}` })
export const updateNewsletter = (id, data, params) =>
  request({ method: "put", url: `/push/${id}`, data, params })
export const createNewsletter = (data) =>
  request({ method: "post", url: `/push`, data })
export const deleteNewsletter = (id) =>
  request({ method: "delete", url: `/push/${id}` })
