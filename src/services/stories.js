// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "../utils/axios"

export const getStories = (params) =>
  request({ method: "get", url: "/stories", params })
export const getStoriesOne = (id) =>
  request({ method: "get", url: `/stories/${id}` })
export const updateStories = (id, data, params) =>
  request({ method: "put", url: `/stories/${id}`, data, params })
export const createStories = (data) =>
  request({ method: "post", url: `/stories`, data })
export const deleteStories = (id) =>
  request({ method: "delete", url: `/stories/${id}` })
