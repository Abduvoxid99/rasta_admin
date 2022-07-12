// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import { store } from "../redux/store"
import request from "../utils/axios"

export const getShippers = (params) =>
  request({ method: "get", url: "/shippers", params })
export const getOneShipper = (id, params) =>
  request({ method: "get", url: `/shippers/${id}`, params })

export const getShipperUsers = (params) =>
  request({ method: "get", url: "/shipper-users", params })
export const deleteShipperUser = (id) =>
  request({ method: "delete", url: `/shipper-users/${id}` })
export const getShipperUser = (id) =>
  request({ method: "get", url: `/shipper-users/${id}` })
export const postShipperUser = (data) =>
  request({ method: "post", url: "/shipper-users", data })
export const updateShipperUser = (id, data) =>
  request({ method: "put", url: `/shipper-users/${id}`, data })

export const shipperLoadOptions = async (search, prevOptions, { page }) => {
  const region_ids = store.getState().auth.region_ids
  const res = await getShippers({
    search,
    limit: 10,
    page,
    region_ids: region_ids.join(","),
  })
  const hasMore = res.count > prevOptions.length + 10
  return {
    options: res.shippers?.map((elm) => ({
      label: elm.name,
      value: elm.id,
      elm,
    })),
    hasMore,
    additional: {
      page: page + 1,
    },
  }
}
