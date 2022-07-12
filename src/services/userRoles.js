import request from "../utils/axios"

export const getUserRoles = (params) =>
  request({ method: "get", url: "/user-roles", params })
export const getUserRolesOne = (id) =>
  request({ method: "get", url: `/user-roles/${id}` })
export const deleteUserRole = (id) =>
  request({ method: "delete", url: `/user-roles/${id}` })
export const getUserRolesOnePermissions = (id) =>
  request({ method: "get", url: `/user-roles/${id}/permissions` })
export const getPermissions = (params) =>
  request({ method: "get", url: "permissions", params })
export const savePermissions = (id, data) =>
  request({ method: "post", url: `/user-roles/${id}/permissions`, data })
export const updateUserRoles = (id, data) =>
  request({ method: "put", url: `/user-roles/${id}`, data })
export const saveUserRoles = (data) =>
  request({ method: "post", url: `/user-roles`, data })
