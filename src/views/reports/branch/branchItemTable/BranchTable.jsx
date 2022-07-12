import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Card from "../../../../components/Card"
import Pagination from "../../../../components/Pagination"
import LoaderComponent from "../../../../components/Loader"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { getOrdersReports } from "../../../../services/reports"
import { numberToPrice } from "../../../../utils/numberToPrice"
import EmptyData from "../../../../components/EmptyData"
import { useHistory, useParams } from "react-router"
import { getPaymentImg } from "../../../orders/paymentType"
import moment from "moment"

export default function RestaurantTable({
  filters,
  setShipper,
  setCurrentPage,
  currentPage,
  limit,
  setLimit,
  search,
}) {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})

  const { id } = useParams()
  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, filters, limit, search])

  const getItems = (page) => {
    setLoader(true)
    getOrdersReports({ limit, page, ...filters, shipper_id: id, search })
      .then((res) => {
        setShipper({
          name: res.shipper_name,
          shipper_settlement_rate: res.shipper_settlement_rate,
          required_for_payment: res.required_for_payment || 0,
        })

        setItems({
          count: res.count,
          data: res.orders || [],
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
      title: t("Заказ ID"),
      key: "external_order_id",
      dataIndex: "external_order_id",
    },
    {
      title: t("branch"),
      key: "branch",
      render: (record) => <>{record.steps[0].branch_name}</>,
    },
    {
      title: t("Сумма продуктов"),
      key: "products_cost",
      render: (record) => (
        <>{numberToPrice(record.order_report_details.products_cost, "сум")}</>
      ),
    },
    {
      title: t("Стоимость доставки"),
      key: "delivery_cost",
      render: (record) => (
        <>{numberToPrice(record.order_report_details.delivery_cost, "сум")}</>
      ),
    },
    {
      title: t("Дата"),
      key: "created_at",
      render: (record) => {
        let date = new Date(record.created_at)
        date.setHours(date.getHours() - new Date(date).getTimezoneOffset() / 60)
        return <>{moment(date).format("DD.MM.YYYY HH:mm")}</>
      },
    },
    {
      title: t("Тип оплаты"),
      key: "payment_type",
      render: (record) => (
        <img
          className="h-10 w-auto object-cover"
          src={getPaymentImg(record.payment_type)}
          alt="payment-img"
        />
      ),
    },
    {
      title: t("Тип акции"),
      key: "discount",
      render: (record) => (
        <>
          {record.order_report_details.promotion_names &&
            record.order_report_details.promotion_names.length > 0 &&
            record.order_report_details.promotion_names[0].ru}
        </>
      ),
    },
    {
      title: t("Размер скидки %"),
      key: "value_of_discount",
      render: (record) => (
        <>
          {record.order_report_details.promotion_discount_values
            ? record.order_report_details.promotion_discount_values.join(",")
            : ""}
        </>
      ),
    },
    {
      title: t("Стоимость скидки"),
      key: "promotion_costs",
      render: (record) => (
        <>
          {record.order_report_details.promotion_costs
            ? record.order_report_details.promotion_costs
                .map((item) => `${numberToPrice(item, "сум")} `)
                .join(",")
            : ""}
        </>
      ),
    },
    {
      title: t("От клиента"),
      key: "from_customer",
      render: (record) => (
        <>{numberToPrice(record.order_report_details.from_customer, "сум")}</>
      ),
    },
    {
      title: `${t("restaurant")} %`,
      key: "promotion_discount_values_for_restaurant",
      render: (record) => (
        <>
          {record.order_report_details.promotion_discount_values_for_restaurant
            ? record.order_report_details.promotion_discount_values_for_restaurant.join(
                ","
              )
            : ""}
        </>
      ),
    },
    {
      title: t("Стоимость ресторана"),
      key: "promotion_costs_for_restaurant",
      render: (record) => (
        <>
          {record.order_report_details.promotion_costs_for_restaurant
            ? record.order_report_details.promotion_costs_for_restaurant
                .map((item) => `${numberToPrice(item, "сум")} `)
                .join(",")
            : ""}
        </>
      ),
    },
    {
      title: t("Rasta %"),
      key: "promotion_discount_values_for_rasta",
      render: (record) => (
        <>
          {record.order_report_details.promotion_discount_values_for_rasta
            ? record.order_report_details.promotion_discount_values_for_rasta.join(
                ","
              )
            : ""}
        </>
      ),
    },
    {
      title: t("Стоимость Rasta"),
      key: "promotion_costs_for_rasta",
      render: (record) => (
        <>
          {record.order_report_details.promotion_costs_for_rasta
            ? record.order_report_details.promotion_costs_for_rasta
                .map((item) => `${numberToPrice(item, "сум")} `)
                .join(",")
            : ""}
        </>
      ),
    },

    {
      title: t("Размер скидки"),
      key: "delivery_promotion_discount_value",
      render: (record) => (
        <>
          {record.order_report_details.delivery_promotion_discount_value > 100
            ? numberToPrice(
                record.order_report_details.delivery_promotion_discount_value,
                "сум"
              )
            : `${record.order_report_details.delivery_promotion_discount_value} %`}
        </>
      ),
    },
    {
      title: t("Стоимость скидки"),
      key: "delivery_promotion_cost",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.delivery_promotion_cost,
            "сум"
          )}
        </>
      ),
    },
    {
      title: t("От клиента"),
      key: "delivery_cost_for_client",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.delivery_cost_for_client,
            "сум"
          )}
        </>
      ),
    },
    {
      title: `${t("restaurant")} %`,
      key: "delivery_promotion_discount_value_for_restaurant",
      render: (record) => (
        <>
          {
            record.order_report_details
              .delivery_promotion_discount_value_for_restaurant
          }
        </>
      ),
    },
    {
      title: t("Стоимость ресторана"),
      key: "delivery_promotion_cost_for_restaurant",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.delivery_promotion_cost_for_restaurant,
            "сум"
          )}
        </>
      ),
    },
    {
      title: t("Rasta %"),
      key: "delivery_promotion_discount_value_for_rasta",
      render: (record) => (
        <>
          {
            record.order_report_details
              .delivery_promotion_discount_value_for_rasta
          }
        </>
      ),
    },
    {
      title: t("Стоимость Rasta"),
      key: "delivery_promotion_cost_for_rasta",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.delivery_promotion_cost_for_rasta,
            "сум"
          )}
        </>
      ),
    },

    {
      title: t("Стоимость ресторана"),
      key: "total_cost_for_restaurant",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.total_cost_for_restaurant,
            "сум"
          )}
        </>
      ),
    },
    {
      title: t("Стоимость Rasta"),
      key: "total_cost_for_rasta",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.total_cost_for_rasta,
            "сум"
          )}
        </>
      ),
    },
    {
      title: t("Заработок ресторана"),
      key: "restaurant_earnings",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.restaurant_earnings,
            "сум"
          )}
        </>
      ),
    },
    {
      title: t("Раста заработок (от продукта)"),
      key: "rasta_earnings",
      render: (record) => (
        <>{numberToPrice(record.order_report_details.rasta_earnings, "сум")}</>
      ),
    },
    {
      title: t("Ресторану нужно платить (за товар + доставка курьеру)"),
      key: "restaurant_needs_to_pay",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.restaurant_needs_to_pay,
            "сум"
          )}
        </>
      ),
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
                <TableCell colspan="7"></TableCell>
                <TableCell colspan="7" className="bg-yellow-400">
                  <div className="text-center">
                    Соотношение акции на продукты
                  </div>
                </TableCell>
                <TableCell colspan="7" className="bg-red-200">
                  <div className="text-center">
                    Соотношение акции на доставку
                  </div>
                </TableCell>
                <TableCell colspan="4" className="bg-red-600">
                  <div className="text-center text-white">
                    Растчет по продукту
                  </div>
                </TableCell>
                <TableCell className="bg-teal-600">
                  <div className="text-center text-white">Общий</div>
                </TableCell>
              </TableRow>
              <TableRow>
                {columns.map((elm) => (
                  <TableCell key={elm.key} className="whitespace-nowrap">
                    {elm.title}
                  </TableCell>
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
                    onClick={() => history.push(`/home/orders/${item.id}`)}
                  >
                    {columns.map((col, index2) => (
                      <TableCell
                        key={col.key}
                        className="whitespace-nowrap"
                        style={{
                          pointerEvents: index2 === 1 ? "none" : "auto",
                        }}
                      >
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
