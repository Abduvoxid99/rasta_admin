import Header from "../../components/Header"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import FullScreenLoader from "../../components/FullScreenLoader"
import moment from "moment"
import RangePicker from "../../components/DatePicker/RangePicker"
import Filter from "../../components/Filters"
import Card from "../../components/Card"
import {
  getDashboardTopItems,
  getDashboarOrderInfo,
  getDashboarStatistic,
} from "../../services/dashboard"
import { useSelector } from "react-redux"
import StatisticsBarChart from "./charts/StatisticsBarChart"
import FilterRegionsDropdown from "../../components/FilterRegionsDropdown"
import { numberToPrice } from "../../utils/numberToPrice"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import TextFilter from "../../components/Filters/TextFilter"
import Skeleton from "@material-ui/lab/Skeleton"

const Dashboard = () => {
  const { t } = useTranslation()
  const { region_ids } = useSelector((state) => state.auth)
  const [loading, setLoader] = useState(true)
  const [filtersData, setFiltersData] = useState({
    start_date: moment().startOf("month").format("YYYY-MM-DD"),
    end_date: moment().endOf("month").format("YYYY-MM-DD"),
    region_ids: [],
  })
  const [dashboard, setDashboard] = useState(null)
  const [statistic, setStatistic] = useState([])
  const [topItems, setTopItems] = useState(null)
  const [statisticFilter, setStatisticFilter] = useState({
    start_date: moment().startOf("month").format("YYYY-MM-DD"),
    end_date: moment().endOf("month").format("YYYY-MM-DD"),
    filterColumns: ["selfPickup", "canceled", "delivery", "total", "name"],
  })
  useEffect(() => {
    setLoader(true)
    getDashboarOrderInfo({
      ...filtersData,
      region_ids:
        filtersData.region_ids.length > 0
          ? filtersData.region_ids.map((item) => item.value).join(",")
          : region_ids.join(","),
    })
      .then((res) => {
        setDashboard(res)
      })
      .finally(() => {
        setLoader(false)
      })
    getDashboardTopItems({
      ...filtersData,
      region_ids:
        filtersData.region_ids.length > 0
          ? filtersData.region_ids.map((item) => item.value).join(",")
          : region_ids.join(","),
    }).then((res) => {
      setTopItems(res)
    })
  }, [filtersData])

  useEffect(() => {
    getDashboarStatistic({
      start_date: statisticFilter.start_date,
      end_date: statisticFilter.end_date,
      region_ids:
        filtersData.region_ids.length > 0
          ? filtersData.region_ids.map((item) => item.value).join(",")
          : region_ids.join(","),
    }).then((res) => {
      setStatistic(
        res.daily_count
          ? res.daily_count.map((item, index) => ({
              name:
                moment(item.day).date() + " " + moment(item.day).format("MMMM"),
              selfPickup: item.self_pick_up,
              delivery: item.delivered_count,
              canceled: item.cancalled_count,
              total: item.finished_count,
            }))
          : []
      )
    })
  }, [filtersData, statisticFilter])

  return (
    <div>
      {/* {loading ? <FullScreenLoader /> : ""} */}

      <Header title={t("dashboard")} />

      <Filter>
        <div className="flex gap-4">
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
          <FilterRegionsDropdown
            filters={filtersData.region_ids}
            setFilters={setFiltersData}
          />
        </div>
      </Filter>

      <div className="p-4">
        <div className="grid grid-cols-12 gap-4">
          {/* {dashboard && ( */}
          <Card className="col-span-8">
            {loading ? (
              <div className="grid grid-cols-4 gap-3">
                {Array(8)
                  .fill("")
                  .map((_, index) => (
                    <div className="h-24">
                      <Skeleton
                        height="100%"
                        key={index}
                        width="100%"
                        style={{ transform: "scale(1)" }}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              dashboard && (
                <>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="flex flex-col py-5 h-24 bg-blue-100 items-center justify-center rounded-md">
                      <p className="font-bold text-2xl">
                        {dashboard.orders_count.count || 0}
                      </p>
                      <span className="text-sm mt-3">Заказы</span>
                    </div>
                    <div className="flex flex-col py-5 h-24 bg-pink-100 items-center justify-center rounded-md">
                      <p className="font-bold text-2xl">
                        {dashboard.new_customers_count.count || 0}
                      </p>
                      <span className="text-sm mt-3">Новые клиенты</span>
                    </div>
                    <div className="flex flex-col py-5 h-24 bg-purple-200 items-center justify-center rounded-md">
                      <p className="font-bold text-2xl">
                        {dashboard.now_free_couriers_count.count || 0}
                      </p>
                      <span className="text-sm mt-3">Доступные драйверы</span>
                    </div>
                    <div className="flex flex-col py-5 h-24 bg-pink-200 items-center justify-center rounded-md">
                      <p className="font-bold text-2xl">
                        {dashboard.acg_delivery_time.time || 0 + " мин"}
                      </p>
                      <span className="text-sm mt-3">Среднее время</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 mt-3 gap-3">
                    <div className="flex flex-col py-5 h-24 bg-green-100 items-center justify-center rounded-md">
                      <p className="font-bold text-2xl">
                        {dashboard.new_shippers_count.count || 0}
                      </p>
                      <span className="text-sm mt-3">Новые партнеры</span>
                    </div>
                    <div className="flex flex-col py-5 h-24 bg-blue-50 items-center justify-center rounded-md">
                      <p className="font-bold text-2xl">
                        {dashboard.total_price.price || 0}
                      </p>
                      <span className="text-sm mt-3">Общая сумма заказа</span>
                    </div>
                    <div className="flex flex-col py-5 h-24 bg-pink-100 items-center justify-center rounded-md">
                      <p className="font-bold text-2xl">
                        {dashboard.net_profit.price || 0}
                      </p>
                      <span className="text-sm mt-3">Чистая прибыль</span>
                    </div>
                    <div className="flex flex-col py-5 h-24 bg-blue-50 items-center justify-center rounded-md">
                      <p className="font-bold text-2xl">
                        {dashboard.total_price.co_delivery_price || 0}
                      </p>
                      <span className="text-sm mt-3">Общая сумма доставки</span>
                    </div>
                  </div>
                </>
              )
            )}
          </Card>
          <Card
            className="col-span-4"
            title={`Топ ${
              topItems?.top_shippers?.shippers?.length || 0
            } партнеров`}
          >
            {loading ? (
              <Skeleton
                height={150}
                width="100%"
                style={{ transform: "scale(1)" }}
              />
            ) : (
              topItems?.top_shippers?.shippers && (
                <>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6 flex flex-col gap-2">
                      {topItems.top_shippers.shippers
                        .slice(0, 5)
                        .map((item, index) => (
                          <div
                            className="flex gap-2 items-center"
                            key={item.id}
                          >
                            <span className="text-sm w-4">{index + 1}.</span>
                            <img
                              src={item.image}
                              className="w-6 h-6 object-cover rounded-full"
                            />
                            <span className="text-sm truncate">
                              {item.name}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="col-span-6 flex flex-col gap-2">
                      {topItems.top_shippers.shippers
                        .slice(5, 10)
                        .map((item, index) => (
                          <div
                            className="flex gap-2 items-center"
                            key={item.id}
                          >
                            <span className="text-sm w-4">{index + 6}.</span>
                            <img
                              src={item.image}
                              className="w-6 h-6 object-cover rounded-full"
                            />
                            <span className="text-sm truncate">
                              {item.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )
            )}
          </Card>

          <Card className="col-span-12">
            <StatisticsBarChart
              data={statistic}
              setStatisticFilter={setStatisticFilter}
              statisticFilter={statisticFilter}
            />
          </Card>
          <div className="col-span-8">
            <Card title="Топ 10 пользователей">
              {loading ? (
                <Skeleton
                  height={500}
                  width="100%"
                  style={{ transform: "scale(1)" }}
                />
              ) : (
                <TableContainer className="rounded-lg border border-lightgray-1">
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>№</TableCell>
                        <TableCell>
                          <TextFilter title={t("fio")} />
                        </TableCell>
                        <TableCell>
                          <TextFilter title={t("count.orders")} />
                        </TableCell>
                        <TableCell>
                          <TextFilter title={t("Сумма заказов")} />
                        </TableCell>
                        <TableCell>
                          <TextFilter title={t("Средний чек")} />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topItems?.top_users?.users &&
                        topItems?.top_users?.users.map(
                          (
                            {
                              client_id,
                              avg_order_amount,
                              count,
                              order_amount,
                              client_name,
                            },
                            index
                          ) => (
                            <TableRow
                              className={
                                index % 2 === 0 ? "bg-lightgray-5" : ""
                              }
                              key={client_id}
                            >
                              <TableCell>
                                <p>{index + 1}</p>
                              </TableCell>
                              <TableCell>{client_name}</TableCell>
                              <TableCell>
                                <div>{count}</div>
                              </TableCell>
                              <TableCell>
                                {numberToPrice(order_amount, "сум")}
                              </TableCell>
                              <TableCell>
                                {numberToPrice(avg_order_amount, "сум")}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          </div>

          <div className="col-span-4">
            <Card
              title={`Топ ${
                topItems?.top_products?.products?.length || 0
              } продуктов`}
            >
              {loading ? (
                <Skeleton
                  height={200}
                  width="100%"
                  style={{ transform: "scale(1)" }}
                />
              ) : (
                <>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6 flex flex-col gap-2">
                      {topItems?.top_products?.products
                        .slice(0, 5)
                        .map((item, index) => (
                          <div
                            className="flex gap-2 items-center"
                            key={item.id}
                          >
                            <span className="mr-2 text-sm">{index + 1}.</span>
                            <img
                              src={item.image}
                              className="w-6 h-6 object-cover rounded-full"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm">{item.name.ru}</span>
                              <span className="text-xs text-gray-400">
                                {item.shipper_name}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="col-span-6 flex flex-col gap-2">
                      {topItems?.top_products?.products
                        .slice(5, 10)
                        .map((item, index) => (
                          <div
                            className="flex gap-2 items-center"
                            key={item.id}
                          >
                            <span className="mr-2 text-sm">{index + 6}.</span>
                            <img
                              src={item.image}
                              className="w-6 h-6 object-cover rounded-full"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm">{item.name.ru}</span>
                              <span className="text-xs text-gray-400">
                                {item.shipper_name}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
