import request from "../utils/axios"

export const getCourierReports = (params) =>
  request({ method: "get", url: "/admin_reports/couriers_report", params })

export const getBranchReports = (params) =>
  request({ method: "get", url: "/admin_reports/branches_report", params })

export const getUserReports = (params) =>
  request({ method: "get", url: "/admin_reports/users_report", params })

export const getRegionReports = (params) =>
  request({ method: "get", url: "/admin_reports/regions_report", params })

export const getOrdersReports = (params) =>
  request({ method: "get", url: "/orders-report-shipper", params })

export const getCourierOrdersReports = (params) =>
  request({ method: "get", url: "/orders-report-courier", params })

export const getExcelReportBranch = (params) =>
  request({
    method: "get",
    url: "/admin_reports/branches_report/download",
    params,
  })

export const getExcelReportBranchItem = (params) =>
  request({
    method: "get",
    url: "/orders-report-shipper/download",
    params,
  })
