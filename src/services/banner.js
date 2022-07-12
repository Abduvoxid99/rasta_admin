import request from '../utils/axios'

export const getBanners = (params) => request({ method: 'get', url: '/banner', params })
export const deleteBanner = (id) => request({ method: 'delete', url:`/banner/${id}`})
export const getOneBanner = (id) => request({ method: 'get', url: `/banner/${id}` })
export const postBanner = (data, params) => request({ method: 'post', url: '/banner', data, params })
export const updateBanner = (banner_id, data, params) => request({ method: 'put', url: `/banner/${banner_id}`, data, params })

export const getTextBanners = (params) => request({ method: 'get', url: '/text-banner', params })
export const deleteTextBanner = (params) => request({ method: 'delete', url:`/text-banner`, params })
export const getOneTextBanner = (id) => request({ method: 'get', url: `/text-banner/${id}` })
export const postTextBanner = (data, params) => request({ method: 'post', url: '/text-banner', data, params })
export const updateTextBanner = (banner_id, data ) => request({ method: 'put', url: `/text-banner/${banner_id}`, data })

