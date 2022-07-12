import request from '../utils/axios'

export const getNewProducts = (params) => request({ method: 'get', url: '/new-products', params })
export const deleteNewProduct = (id) => request({ method: 'delete', url:`/new/${id}`})
export const getOneNewProduct = (id) => request({ method: 'get', url: `/new-pro/${id}` })
export const postNewProduct = (data, params) => request({ method: 'post', url: '/new-products', data, params })
export const updateNewProduct = (new_id, data, params) => request({ method: 'put', url: `/new-pro/${new_id}`, data, params })