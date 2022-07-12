import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Header from "../../../components/Header"
import Filters from "../../../components/Filters"
import RestaurantTable from "./Table"
import { Input } from "alisa-ui"
import RangePicker from "../../../components/DatePicker/RangePicker"
import moment from "moment"
import SearchIcon from "@material-ui/icons/Search"
import Button from "../../../components/Button"
import { DownloadIcon } from "../../../constants/icons"
import FDropdown from "../../../components/Filters/FDropdown"
import { getRegions } from "../../../services/region"
import useDebounce from "../../../utils/useDebounce"

export default function ReportsRegion() {
  const { t } = useTranslation()
  const [search, setSearch] = useState(null)
  const debouncedValue = useDebounce(search, 500)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filters, setFilters] = useState({
    start_date: moment().startOf("month").format("YYYY-MM-DD"),
    end_date: moment().endOf("month").format("YYYY-MM-DD"),
    region_id: null,
  })

  const [regions, setRegions] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (debouncedValue) {
      setLimit(10)
      setCurrentPage(1)
    }
  }, [debouncedValue])

  const fetchData = async () => {
    const { regions } = await getRegions({ limit: 1000 })
    setRegions(
      regions ? regions.map((elm) => ({ label: elm.name, value: elm.id })) : []
    )
  }

  const changeRegion = (regionId, close) => {
    setFilters({
      ...filters,
      region_id: regionId,
    })
    close()
  }

  const clearRegion = () => {
    setFilters({
      ...filters,
      region_id: null,
    })
  }

  return (
    <>
      <Header title={t("Отчеты по городам")} />
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
            // width={240}
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
          {regions.length > 0 && (
            <FDropdown
              options={regions}
              onClick={changeRegion}
              reset={clearRegion}
              value={filters.region_id}
            />
          )}
        </div>
      </Filters>
      <RestaurantTable
        filters={filters}
        searchValue={debouncedValue}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  )
}
