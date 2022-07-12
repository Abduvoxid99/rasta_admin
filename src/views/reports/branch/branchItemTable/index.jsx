import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Header from "../../../../components/Header"
import Filters from "../../../../components/Filters"
import RestaurantTable from "./BranchTable"
import { Input } from "alisa-ui"
import RangePicker from "../../../../components/DatePicker/RangePicker"
import moment from "moment"
import SearchIcon from "@material-ui/icons/Search"
import Button from "../../../../components/Button"
import { DownloadIcon } from "../../../../constants/icons"
import FDropdown from "../../../../components/Filters/FDropdown"
import { getBranches } from "../../../../services"
import { useHistory, useParams } from "react-router"
import AccountBalanceIcon from "@material-ui/icons/AccountBalance"
import { numberToPrice } from "../../../../utils/numberToPrice"
import {
  getExcelReportBranch,
  getExcelReportBranchItem,
} from "../../../../services/reports"
import useDebounce from "../../../../utils/useDebounce"

export default function ReportsBranch() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [shipper, setShipper] = useState({
    name: "",
    shipper_settlement_rate: 0,
    required_for_payment: 0,
  })
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState(null)
  const [limit, setLimit] = useState(10)
  const debouncedValue = useDebounce(search, 500)
  const [filters, setFilters] = useState({
    start_date: moment().startOf("month").format("YYYY-MM-DD"),
    end_date: moment().endOf("month").format("YYYY-MM-DD"),
    branch_ids: null,
  })

  useEffect(() => {
    if (debouncedValue) {
      setLimit(10)
      setCurrentPage(1)
    }
  }, [debouncedValue, filters])

  useEffect(() => {
    if (filters) {
      setLimit(10)
      setCurrentPage(1)
    }
  }, [filters])

  const [branches, setBranches] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { branches } = await getBranches({ limit: 1000 }, id)
    setBranches(
      branches
        ? branches.map((elm) => ({ label: elm.name, value: elm.id }))
        : []
    )
  }

  const changeRegion = (regionId, close) => {
    setFilters({
      ...filters,
      branch_ids: regionId,
    })
    close()
  }

  const clearRegion = () => {
    setFilters({
      ...filters,
      branch_ids: null,
    })
  }

  const downloadDocument = () => {
    setLoading(true)
    getExcelReportBranchItem({
      limit: limit,
      page: currentPage,
      shipper_id: id,
      search: debouncedValue,
      ...filters,
    })
      .then((res) => {
        const link = document.createElement("a")
        link.href = res.url
        link.setAttribute("download", `${Date.now()}.xlsx`)
        document.body.appendChild(link)
        link.click()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Header
        title={shipper.name}
        endAdornment={[
          <div className="font-medium text-sm mr-5">
            Необходимо к выплате:{" "}
            {numberToPrice(shipper.required_for_payment, "сум")}
          </div>,
          <div className="font-medium text-sm">
            Комиссия: {shipper.shipper_settlement_rate}%
          </div>,
        ]}
      />
      <Filters
        className="mb-0"
        extra={
          <Button
            icon={DownloadIcon}
            iconClassName="text-blue-600"
            color="zinc"
            shape="outlined"
            size="medium"
            loading={loading}
            onClick={downloadDocument}
          >
            {t("download")}
          </Button>
        }
      >
        <div className="flex gap-4 items-center">
          <Input
            //width={240}
            placeholder={t("search")}
            size="middle"
            addonBefore={
              <SearchIcon style={{ fill: "var(--color-primary)" }} />
            }
            onChange={(e) => setSearch(e.target.value)}
          />
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
            defaultValue={[
              moment(filters.start_date),
              moment(filters.end_date),
            ]}
            onChange={(e) => {
              e[0] === null
                ? setFilters((old) => ({
                    ...old,
                    start_date: undefined,
                    end_date: undefined,
                  }))
                : setFilters((old) => ({
                    ...old,
                    start_date: moment(e[0]).format("YYYY-MM-DD"),
                    end_date: moment(e[1]).format("YYYY-MM-DD"),
                  }))
            }}
          />
          {branches.length > 0 && (
            <FDropdown
              options={branches}
              onClick={changeRegion}
              reset={clearRegion}
              placeholder="Филиал"
              icon={
                <AccountBalanceIcon
                  fontSize="small"
                  style={{ color: "var(--color-primary)" }}
                />
              }
              value={filters.branch_ids ? filters.branch_ids : null}
            />
          )}
        </div>
      </Filters>
      <RestaurantTable
        filters={filters}
        setShipper={setShipper}
        limit={limit}
        setLimit={setLimit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        search={debouncedValue}
      />
    </>
  )
}
