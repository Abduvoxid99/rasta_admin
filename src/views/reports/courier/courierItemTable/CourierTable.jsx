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
import { getCourierOrdersReports } from "../../../../services/reports"
import { numberToPrice } from "../../../../utils/numberToPrice"
import EmptyData from "../../../../components/EmptyData"
import { useHistory, useParams } from "react-router"
import { getPaymentImg } from "../../../orders/paymentType"
import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined"
import Col from "../../../../components/Col"

export default function RestaurantTable({ filters, setShipper, shipper }) {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})

  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { id } = useParams()
  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, filters, limit])

  const getItems = (page) => {
    setLoader(true)
    getCourierOrdersReports({ limit, page, ...filters, courier_id: id })
      .then((res) => {
        setShipper({
          name: res.courier_name,
          shipper_settlement_rate: res.shipper_settlement_rate,
          total_debt: res.stats.total_debt || 0,
          total_salary: res.stats.total_salary || 0,
          salary_by_cash: res.stats.salary_by_cash || 0,
          total_debt_for_deliveries: res.stats.total_debt_for_deliveries || 0,
          debt_for_deliveries_by_cash:
            res.stats.debt_for_deliveries_by_cash || 0,
          debt_for_deliveries_by_card:
            res.stats.debt_for_deliveries_by_card || 0,
          debt_for_products: res.stats.debt_for_products || 0,
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
      title: "???",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * 10 + index + 1}</>,
    },
    {
      title: t("?????????? ID"),
      key: "external_order_id",
      dataIndex: "external_order_id",
    },
    {
      title: t("branch"),
      key: "branch",
      render: (record) => <>{record.steps[0].branch_name}</>,
    },
    {
      title: t("?????????? ??????????????????"),
      key: "products_cost",
      render: (record) => (
        <>{numberToPrice(record.order_report_details.products_cost, "??????")}</>
      ),
    },
    {
      title: t("?????????????????? ????????????????"),
      key: "delivery_cost",
      render: (record) => (
        <>{numberToPrice(record.order_report_details.delivery_cost, "??????")}</>
      ),
    },
    {
      title: t("?????? ????????????"),
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
      title: t("?????? ??????????"),
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
      title: t("???????????? ???????????? %"),
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
      title: t("?????????????????? ????????????"),
      key: "promotion_costs",
      render: (record) => (
        <>
          {record.order_report_details.promotion_costs
            ? record.order_report_details.promotion_costs
                .map((item) => `${numberToPrice(item, "??????")} `)
                .join(",")
            : ""}
        </>
      ),
    },
    {
      title: t("???? ??????????????"),
      key: "from_customer",
      render: (record) => (
        <>{numberToPrice(record.order_report_details.from_customer, "??????")}</>
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
      title: t("?????????????????? ??????????????????"),
      key: "promotion_costs_for_restaurant",
      render: (record) => (
        <>
          {record.order_report_details.promotion_costs_for_restaurant
            ? record.order_report_details.promotion_costs_for_restaurant
                .map((item) => `${numberToPrice(item, "??????")} `)
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
      title: t("?????????????????? Rasta"),
      key: "promotion_costs_for_rasta",
      render: (record) => (
        <>
          {record.order_report_details.promotion_costs_for_rasta
            ? record.order_report_details.promotion_costs_for_rasta
                .map((item) => `${numberToPrice(item, "??????")} `)
                .join(",")
            : ""}
        </>
      ),
    },

    {
      title: t("???????????? ????????????"),
      key: "delivery_promotion_discount_value",
      render: (record) => (
        <>
          {record.order_report_details.delivery_promotion_discount_value > 100
            ? numberToPrice(
                record.order_report_details.delivery_promotion_discount_value,
                "??????"
              )
            : `${record.order_report_details.delivery_promotion_discount_value} %`}
        </>
      ),
    },
    {
      title: t("?????????????????? ????????????"),
      key: "delivery_promotion_cost",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.delivery_promotion_cost,
            "??????"
          )}
        </>
      ),
    },
    {
      title: t("???? ??????????????"),
      key: "delivery_cost_for_client",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.delivery_cost_for_client,
            "??????"
          )}
        </>
      ),
    },
    {
      title: `${t("restaurant")} %`,
      key: "delivery_promotion_discount_value_for_restaurant",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details
              .delivery_promotion_discount_value_for_restaurant,
            "??????"
          )}
        </>
      ),
    },
    {
      title: t("?????????????????? ??????????????????"),
      key: "delivery_promotion_cost_for_restaurant",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.delivery_promotion_cost_for_restaurant,
            "??????"
          )}
        </>
      ),
    },
    {
      title: t("Rasta %"),
      key: "delivery_promotion_discount_value_for_rasta",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details
              .delivery_promotion_discount_value_for_rasta,
            "??????"
          )}
        </>
      ),
    },
    {
      title: t("?????????????????? Rasta"),
      key: "delivery_promotion_cost_for_rasta",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.delivery_promotion_cost_for_rasta,
            "??????"
          )}
        </>
      ),
    },

    {
      title: t("?????????????????? ??????????????????"),
      key: "total_cost_for_restaurant",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.total_cost_for_restaurant,
            "??????"
          )}
        </>
      ),
    },
    {
      title: t("?????????????????? Rasta"),
      key: "total_cost_for_rasta",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.total_cost_for_rasta,
            "??????"
          )}
        </>
      ),
    },
    {
      title: t("?????????????????? ??????????????????"),
      key: "restaurant_earnings",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.restaurant_earnings,
            "??????"
          )}
        </>
      ),
    },
    {
      title: t("?????????? ?????????????????? (???? ????????????????)"),
      key: "rasta_earnings",
      render: (record) => (
        <>{numberToPrice(record.order_report_details.rasta_earnings, "??????")}</>
      ),
    },
    {
      title: t("?????????????????? ?????????? ?????????????? (???? ?????????? + ???????????????? ??????????????)"),
      key: "restaurant_needs_to_pay",
      render: (record) => (
        <>
          {numberToPrice(
            record.order_report_details.restaurant_needs_to_pay,
            "??????"
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
      <div className="grid grid-cols-3 gap-4 font-medium mb-4">
        <Col>
          <div className="flex items-center">
            <span>
              <MonetizationOnOutlinedIcon style={{ color: "#38D9B9" }} />
            </span>
            <h3 className="ml-4 text-sm">?????????? ??????????????????????????</h3>
          </div>
          <span className="text-sm">
            {numberToPrice(shipper.total_debt, "??????")}
          </span>
        </Col>
        <Col>
          <div className="flex items-center">
            <span>
              <MonetizationOnOutlinedIcon style={{ color: "#38D9B9" }} />
            </span>
            <h3 className="ml-4 text-sm">?????????????????? ??????????????</h3>
          </div>
          <span className="text-sm">
            {numberToPrice(shipper.total_salary, "??????")}
          </span>
        </Col>
        <Col>
          <div className="flex items-center">
            <span>
              <MonetizationOnOutlinedIcon style={{ color: "#38D9B9" }} />
            </span>
            <h3 className="ml-4 text-sm">?????????????????? (????????????????)</h3>
          </div>
          <span className="text-sm">
            {numberToPrice(shipper.salary_by_cash, "??????")}
          </span>
        </Col>
        <Col>
          <div className="flex items-center">
            <span>
              <MonetizationOnOutlinedIcon style={{ color: "#38D9B9" }} />
            </span>
            <h3 className="ml-4 text-sm">?????????????????????????? ???? ???????????????? (??????????)</h3>
          </div>
          <span className="text-sm">
            {numberToPrice(shipper.total_debt_for_deliveries, "??????")}
          </span>
        </Col>
        <Col>
          <div className="flex items-center">
            <span>
              <MonetizationOnOutlinedIcon style={{ color: "#38D9B9" }} />
            </span>
            <h3 className="ml-4 text-sm">?????????????????????????? ???? ???????????????? (??????????)</h3>
          </div>
          <span className="text-sm">
            {numberToPrice(shipper.debt_for_deliveries_by_cash, "??????")}
          </span>
        </Col>
        <Col>
          <div className="flex items-center">
            <span>
              <MonetizationOnOutlinedIcon style={{ color: "#38D9B9" }} />
            </span>
            <h3 className="ml-4 text-sm">?????????????????????????? ???? ???????????????? (????????????)</h3>
          </div>
          <span className="text-sm">
            {numberToPrice(shipper.debt_for_deliveries_by_card, "??????")}
          </span>
        </Col>
        <Col>
          <div className="flex items-center">
            <span>
              <MonetizationOnOutlinedIcon style={{ color: "#38D9B9" }} />
            </span>
            <h3 className="ml-4 text-sm">?????????????????????????? ???? ????????????????</h3>
          </div>
          <span className="text-sm">
            {numberToPrice(shipper.debt_for_products, "??????")}
          </span>
        </Col>
      </div>
      {!loader && (
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell colspan="7"></TableCell>
                <TableCell colspan="7" className="bg-yellow-400">
                  <div className="text-center">
                    ?????????????????????? ?????????? ???? ????????????????
                  </div>
                </TableCell>
                <TableCell colspan="7" className="bg-red-200">
                  <div className="text-center">
                    ?????????????????????? ?????????? ???? ????????????????
                  </div>
                </TableCell>
                <TableCell colspan="4" className="bg-red-600">
                  <div className="text-center text-white">
                    ?????????????? ???? ????????????????
                  </div>
                </TableCell>
                <TableCell className="bg-teal-600">
                  <div className="text-center text-white">??????????</div>
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
                    {columns.map((col) => (
                      <TableCell key={col.key} className="whitespace-nowrap">
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
