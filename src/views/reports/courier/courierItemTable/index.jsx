import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Header from "../../../../components/Header"
import Filters from "../../../../components/Filters"
import RestaurantTable from "./CourierTable"
import { Input } from "alisa-ui"
import RangePicker from "../../../../components/DatePicker/RangePicker"
import moment from "moment"
import SearchIcon from "@material-ui/icons/Search"
import Button from "../../../../components/Button"
import { DownloadIcon } from "../../../../constants/icons"
import FDropdown from "../../../../components/Filters/FDropdown"
import { getBranches, getShippers } from "../../../../services"
import { useHistory, useParams } from "react-router"
import AccountBalanceIcon from "@material-ui/icons/AccountBalance"
import { numberToPrice } from "../../../../utils/numberToPrice"

export default function ReportsBranch() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [shipper, setShipper] = useState({
    name: "",
    shipper_settlement_rate: 0,
    required_for_payment: 0,
  })
  const history = useHistory()
  const [filters, setFilters] = useState({
    start_date: moment().startOf("month").format("YYYY-MM-DD"),
    end_date: moment().endOf("month").format("YYYY-MM-DD"),
    search: "",
    shipper_id: null,
  })

  const [branches, setBranches] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { shippers } = await getShippers({ limit: 1000 }, id)
    setBranches(
      shippers
        ? shippers.map((elm) => ({ label: elm.name, value: elm.id }))
        : []
    )
  }

  const changeRegion = (regionId, close) => {
    setFilters({
      ...filters,
      shipper_id: regionId,
    })
    close()
  }

  const clearRegion = () => {
    setFilters({
      ...filters,
      shipper_id: null,
    })
  }

  return (
    <>
      <Header title={shipper.name} />
      <Filters
        className="mb-0"
        extra={
          <Button
            icon={DownloadIcon}
            iconClassName="text-blue-600"
            color="zinc"
            shape="outlined"
            size="medium"
            onClick={() => console.log("clicked")}
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
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
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
            defaultValue={[
              moment(filters.start_date),
              moment(filters.end_date),
            ]}
          />
          {branches.length > 0 && (
            <FDropdown
              options={branches}
              onClick={changeRegion}
              reset={clearRegion}
              placeholder={t("restaurants")}
              icon={
                <AccountBalanceIcon
                  fontSize="small"
                  style={{ color: "var(--color-primary)" }}
                />
              }
              value={filters.shipper_id ? filters.shipper_id : null}
            />
          )}
        </div>
      </Filters>
      <RestaurantTable
        filters={filters}
        setShipper={setShipper}
        shipper={shipper}
      />
    </>
  )
}
