import request from "../utils/axios"

export const getCouriers = (params) =>
  request({ method: "get", url: "/couriers", params })
export const deleteCourier = (id) =>
  request({ method: "delete", url: `/couriers/${id}` })
export const getCourier = (id) =>
  request({ method: "get", url: `/couriers/${id}` })
export const postCourier = (data, params) =>
  request({ method: "post", url: "/couriers", data, params })
export const updateCourier = (courier_id, data, params) =>
  request({ method: "put", url: `/couriers/${courier_id}`, data, params })
export const getCourierTransactions = (params) =>
  request({
    method: "get",
    url: `/courier-transaction`,
    params,
  })
export const getCourierBalance = (courier_id) =>
  request({ method: "get", url: `/courier-balance/${courier_id}` })

export const getCourierPromotionDebts = (params) =>
  request({
    method: "get",
    url: `/courier-promotion-debts`,
    params,
  })

export const deductBalance = (courier_id, data) =>
  request({
    method: "post",
    url: `/courier-balance/${courier_id}/deduct-balance`,
    data,
  })

export const deductDebtBalance = (courier_id, data) =>
  request({
    method: "post",
    url: `/courier-balance/${courier_id}/deduct-debt-balance`,
    data,
  })
export const coutierPromotionDebtsPay = (data) =>
  request({
    method: "post",
    url: "/courier-promotion-debts/pay",
    data,
  })

export const getCouriersVehicle = (params) =>
  request({ method: "get", url: "/courier-vehicle-class", params })

export const postCourierVehicle = (courier_id, data, params) =>
  request({
    method: "post",
    url: `/courier-vehicle/${courier_id}`,
    data,
    params,
  })
export const updateCourierVehicle = (courier_id, data, params) =>
  request({
    method: "put",
    url: `/courier-vehicle/${courier_id}`,
    data,
    params,
  })

export const couriersLoadOptions = async (search, prevOptions, { page }) => {
  const res = await getCouriers({ search, limit: 10, page })
  const hasMore = res.count > prevOptions.length + 10
  return {
    options: res.couriers?.map((elm) => ({
      label: elm.first_name,
      value: elm.id,
      elm,
    })),
    hasMore,
    additional: {
      page: page + 1,
    },
  }
}
