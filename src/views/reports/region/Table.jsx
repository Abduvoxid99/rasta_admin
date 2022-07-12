import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Card from "../../../components/Card"
import Pagination from "../../../components/Pagination"
import LoaderComponent from "../../../components/Loader"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { getRegionReports } from "../../../services/reports"
import { numberToPrice } from "../../../utils/numberToPrice"
import EmptyData from "../../../components/EmptyData"

function convertMinsToHrsMins(minutes) {
  var h = Math.floor(minutes / 60)
  var m = minutes % 60
  return h + " ч. " + m + " мин."
}

export default function RestaurantTable({
  filters,
  searchValue,
  currentPage,
  setCurrentPage,
  limit,
  setLimit,
}) {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const [items, setItems] = useState({})

  useEffect(() => {
    getItems(currentPage, searchValue)
  }, [currentPage, filters, searchValue, limit])

  const getItems = (page, searchValue) => {
    setLoader(true)
    getRegionReports({ limit, page, ...filters, search: searchValue })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.regions_report || [],
        })
      })
      .finally(() => setLoader(false))
  }

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * 10 + index + 1}</>,
    },
    {
      title: t("name"),
      key: "region_name",
      dataIndex: "region_name",
    },
    {
      title: t("Кол-во активных пользователей"),
      key: "active_users_count",
      dataIndex: "active_users_count",
      render: (record) => <>{record.active_users_count || 0}</>,
    },
    {
      title: t("Кол-во выполненных заказов"),
      key: "finished_orders",
      dataIndex: "finished_orders",
    },
    {
      title: t("Кол-во отклоненных заказов"),
      key: "cancelled_orders",
      dataIndex: "cancelled_orders",
    },
    {
      title: t("Кол-во отмененных заказов пользователем"),
      key: "cancelled_orders_by_users",
      dataIndex: "cancelled_orders_by_users",
    },
    {
      title: t("Средняя сумма"),
      render: (record) => (
        <>
          {record.avg_amount
            ? numberToPrice(record.avg_amount, "сум")
            : "0 сум"}
        </>
      ),
    },
    {
      title: t("Общая сумма доходов"),
      render: (record) => (
        <>
          {record.total_income
            ? numberToPrice(record.total_income, "сум")
            : "0 сум"}
        </>
      ),
    },

    {
      title: t("Среднее время доставки"),

      render: (record) => (
        <>
          {record.avg_delivery_time && record.avg_delivery_time !== 0
            ? convertMinsToHrsMins(record.avg_delivery_time)
            : "0 мин"}
        </>
      ),
    },
    {
      title: t("Время заказа"),
      render: (record) => (
        <>
          {record.delivery_time && record.delivery_time !== 0
            ? convertMinsToHrsMins(record.delivery_time)
            : "0 мин"}
        </>
      ),
    },
    {
      title: t("Общая продажа"),
      render: (record) => (
        <>
          {record.all_sale_amount
            ? numberToPrice(record.all_sale_amount, "сум")
            : "0 сум"}
        </>
      ),
    },
    {
      title: t("Общая прибыль"),
      render: (record) => (
        <>
          {record.total_profit
            ? numberToPrice(record.total_profit, "сум")
            : "0 сум"}
        </>
      ),
    },
    {
      title: t("Средний процент прибыли"),
      render: (record) => <>{record.avg_profit_percentage || 0} %</>,
    },
  ]

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
    >
      {!loader && (
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.data &&
                items.data.length > 0 &&
                items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render
                          ? col.render(item, index)
                          : item[col.dataIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {items.data && items.data.length === 0 && (
            <EmptyData loading={loader} />
          )}
        </TableContainer>
      )}

      <LoaderComponent isLoader={loader} />
    </Card>
  )
}
