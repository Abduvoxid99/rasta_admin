import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { Input } from "alisa-ui"
import StatusBar from "./StatusBar"
import Header from "../../components/Header"
import Filter from "../../components/Filters"
import RangePicker from "../../components/DatePicker/RangePicker"
import Button from "../../components/Button"
import AddIcon from "@material-ui/icons/Add"
import SearchIcon from "@material-ui/icons/Search"
import "./style.scss"
import { PlacemarkIcon } from "../../constants/icons"
import { useSelector } from "react-redux"
import usePermissions from "../../utils/usePermissions"
import Filter1TwoTone from "@material-ui/icons/Filter1TwoTone"
import CloseIcon from "@material-ui/icons/Close"
import { statusTabList } from "../../constants/statuses"

export default function Orders() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissionActions = usePermissions("order")
  const [tab, setTab] = useState(null)
  const [extraFilterProp, setExtraFilterProp] = useState(false)
  const [filtersData, setFiltersData] = useState({
    external_order_id: undefined,
    start_date: moment().add(-1, "d").format("YYYY-MM-DD"),
    end_date: moment().add(1, "d").format("YYYY-MM-DD"),
    payment_type: undefined,
    tabValue: statusTabList[0].id,
  })
  const statusId = useSelector((state) => state.order.status_id)

  const [filters, setFilters] = useState({
    customer_id: null,
    branch_ids: undefined,
    courier_id: null,
    payment_type: undefined,
    sort_by: null,
    external_order_id: null,
    shipper_id: null,
    region_ids: [],
  })

  // useEffect(() => {
  //   if (tab && tab?.length > 400) {
  //     setFiltersData((prev) => ({
  //       ...prev,
  //       start_date: moment().add(-7, "d").format("YYYY-MM-DD"),
  //       end_date: moment().add(1, "d").format("YYYY-MM-DD"),
  //     }))
  //   } else if (tab === statusTabList[3].id) {
  //     setFiltersData((prev) => ({
  //       ...prev,
  //       start_date: moment().format("YYYY-MM-DD"),
  //       end_date: moment().add(1, "d").format("YYYY-MM-DD"),
  //     }))
  //   } else {
  //     setFiltersData((prev) => ({
  //       ...prev,
  //       start_date: moment().add(-1, "d").format("YYYY-MM-DD"),
  //       end_date: moment().add(1, "d").format("YYYY-MM-DD"),
  //     }))
  //   }
  // }, [tab])

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={Filter1TwoTone}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => setExtraFilterProp((el) => !el)}
      >
        {t("filter")}
      </Button>
      <Button
        icon={PlacemarkIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          history.push("/home/tracking")
        }}
      >
        {t("map")}
      </Button>
    </div>
  )

  return (
    <div>
      <Header
        title={t("orders")}
        startAdornment={[
          <div className="flex items-center gap-2">
            {filters.region_ids.length > 0 && (
              <div className="font-medium text-xs px-3 py-2 bg-gray-200 rounded-md flex items-center leading-0">
                {filters?.region_ids?.map((item) => item.label).join(" , ")}
                <div className="ml-2 flex items-center justify-center">
                  <CloseIcon
                    style={{ fontSize: "14px" }}
                    className="cursor-pointer clear-animation"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        region_ids: [],
                      }))
                    }
                  />
                </div>
              </div>
            )}
            {filters.courier_id && (
              <div className="font-medium text-xs px-3 py-2 bg-gray-200 rounded-md flex items-center leading-0">
                {filters.courier_id.label}
                <div className="ml-2 flex items-center justify-center">
                  <CloseIcon
                    style={{ fontSize: "14px" }}
                    className="cursor-pointer clear-animation"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        courier_id: null,
                      }))
                    }
                  />
                </div>
              </div>
            )}
            {filters.customer_id && (
              <div className="font-medium text-xs px-3 py-2 bg-gray-200 rounded-md flex items-center leading-0">
                {filters.customer_id.label}
                <div className="ml-2 flex items-center justify-center">
                  <CloseIcon
                    style={{ fontSize: "14px" }}
                    className="cursor-pointer clear-animation"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        customer_id: null,
                      }))
                    }
                  />
                </div>
              </div>
            )}
            {filters.external_order_id && (
              <div className="font-medium text-xs px-3 py-2 bg-gray-200 rounded-md flex items-center leading-0">
                {filters.external_order_id}
                <div className="ml-2 flex items-center justify-center">
                  <CloseIcon
                    style={{ fontSize: "14px" }}
                    className="cursor-pointer clear-animation"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        external_order_id: "",
                      }))
                    }
                  />
                </div>
              </div>
            )}
            {filters.shipper_id && (
              <div className="font-medium text-xs px-3 py-2 bg-gray-200 rounded-md flex items-center leading-0">
                {filters.shipper_id.label}
                <div className="ml-2 flex items-center justify-center">
                  <CloseIcon
                    style={{ fontSize: "14px" }}
                    className="cursor-pointer clear-animation"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        shipper_id: null,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>,
        ]}
        endAdornment={[
          (filters.courier_id ||
            filters.shipper_id ||
            filters.region_ids.length > 0 ||
            filters.customer_id ||
            filters.external_order_id) && (
            <Button
              size="medium"
              icon={CloseIcon}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  customer_id: null,
                  courier_id: null,
                  shipper_id: null,
                  region_ids: [],
                  external_order_id: "",
                }))
              }
              shape="outlined"
            >
              Очистить фильтр
            </Button>
          ),
          permissionActions.post && (
            <Button
              size="medium"
              icon={AddIcon}
              onClick={() => history.push("/home/orders/create")}
            >
              {t("add")}
            </Button>
          ),
        ]}
      />
      {permissionActions.get && (
        <>
          <Filter extra={extraFilter}>
            <div className="flex gap-4">
              {/* <Input
                width={240}
                placeholder={t("search")}
                size="middle"
                onChange={(e) =>
                  setFiltersData((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                addonBefore={
                  <SearchIcon style={{ fill: "var(--color-primary)" }} />
                }
              /> */}
              <RangePicker
                hideTimePicker
                placeholder={t("order.period")}
                defaultValue={[
                  moment(filtersData.start_date),
                  moment(filtersData.end_date),
                ]}
                onChange={(e) => {
                  e[0] === null
                    ? setFiltersData((old) => ({
                        ...old,
                        start_date: moment().add(-1, "d").format("YYYY-MM-DD"),
                        end_date: moment().add(1, "d").format("YYYY-MM-DD"),
                      }))
                    : setFiltersData((old) => ({
                        ...old,
                        start_date: moment(e[0]).format("YYYY-MM-DD"),
                        end_date: moment(e[1]).format("YYYY-MM-DD"),
                      }))
                }}
              />
            </div>
          </Filter>
          <StatusBar
            filters={filters}
            extraFilterProp={extraFilterProp}
            setExtraFilterProp={setExtraFilterProp}
            statusId={statusId}
            setTab={setTab}
            setFilters={setFilters}
            filtersData={filtersData}
            setFiltersData={setFiltersData}
          />
        </>
      )}
    </div>
  )
}
