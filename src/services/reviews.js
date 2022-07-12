import request from "../utils/axios"

export const getReviews = (params) =>
  request({ method: "get", url: "/review", params })
export const deleteReviews = (id) =>
  request({ method: "delete", url: `/review/${id}` })
export const getOneReview = (id) =>
  request({ method: "get", url: `/review/${id}` })
export const postReviews = (data, params) =>
  request({ method: "post", url: "/review", data, params })
export const updateReviws = (banner_id, data, params) =>
  request({ method: "put", url: `/review/${banner_id}`, data, params })
