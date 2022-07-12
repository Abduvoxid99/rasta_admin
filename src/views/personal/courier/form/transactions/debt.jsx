import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import Breadcrumb from "../../../../../components/Breadcrumb"
import Card from "../../../../../components/Card"
import LoaderComponent from "../../../../../components/Loader"
import TextFilter from "../../../../../components/Filters/TextFilter"
import Header from "../../../../../components/Header"
import Button from "../../../../../components/Button"
import {
  getCourierPromotionDebts,
  deductDebtBalance,
  coutierPromotionDebtsPay,
} from "../../../../../services"
import { useHistory, useParams } from "react-router"
import { numberToPrice } from "../../../../../utils/numberToPrice"

export default function DebtTable() {
  const [loader, setLoader] = useState(false)
  const { t } = useTranslation()
  const [items, setItems] = useState(null)
  const history = useHistory()
  const [currentPage, setCurrentPage] = useState(1)
  const [checkedOrder, setCheckedOrder] = useState([])
  const { courier_id } = useParams()
  const [selectAll, setSelectAll] = useState(false)

  const setOrder = (id) => {
    if (checkedOrder.map((item) => item.id).includes(id)) {
      setCheckedOrder((prev) => prev.filter((val) => val.id !== id))
    } else {
      setCheckedOrder((prev) => [
        ...prev,
        { ...items.data.find((val) => val.id === id) },
      ])
    }
  }

  useEffect(() => {
    if (selectAll) {
      setCheckedOrder(items.data)
    } else {
      setCheckedOrder([])
    }
  }, [selectAll])

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <div>{(currentPage - 1) * 10 + index + 1}</div>,
    },
    {
      title: t("Ид. заказа"),
      key: "name",
      render: (record) => <div>{record.order_external_id}</div>,
    },
    {
      title: t("sum"),
      key: "current.number",
      render: (record) => <div>{numberToPrice(record.amount, "сум")}</div>,
    },
    {
      title: t("Название ресторана"),
      key: "sum",
      render: (record) => <div>{record.shipper_name}</div>,
    },
    {
      title: (
        <div className="w-full flex items-center justify-center">
          <input
            checked={items && items.data.length === checkedOrder.length}
            className="w-4 h-4 cursor-pointer rounded"
            type="checkbox"
            onChange={() => setSelectAll((prev) => !prev)}
          />
        </div>
      ),
      key: "payment.type",
      render: (record) => (
        <div className="w-full flex items-center justify-center">
          <input
            checked={checkedOrder.map((item) => item.id).includes(record.id)}
            className="w-4 h-4 cursor-pointer rounded"
            type="checkbox"
            value={record.id}
            onChange={(e) => setOrder(e.target.value)}
          />
        </div>
      ),
    },
  ]

  const routes = [
    {
      title: t("personal"),
      link: true,
      route: `/home/courier/list`,
    },
    {
      title: t("couriers"),
      link: true,
      route: `/home/courier/list`,
    },
    {
      title: t("Погасить задолжность"),
    },
  ]

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage])

  const getItems = (page) => {
    setLoader(true)
    getCourierPromotionDebts({
      limit: 10,
      page,
      courier_id,
      only_by_paidness: true,
      paidness_state: false,
    })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.promotion_debts,
        })
      })
      .finally(() => setLoader(false))
  }

  const debtBalance = () => {
    const amount = checkedOrder.reduce((sum, { amount }) => sum + amount, 0)
    deductDebtBalance(courier_id, { amount }).then(() => {
      coutierPromotionDebtsPay({
        debt_ids: checkedOrder.map((item) => item.id),
      }).then(() => {
        history.go(-1)
      })
    })
  }

  return (
    <div className="w-full">
      <Header startAdornment={[<Breadcrumb routes={routes} />]} />
      <div className="p-4">
        <Card>
          <TableContainer className="rounded-lg border border-lightgray-1">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  {initialColumns.map((elm) => (
                    <TableCell key={elm.key}>
                      <TextFilter {...elm} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items && items.data && items.data.length ? (
                  items.data.map((item, index) => (
                    <TableRow
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                      key={item.id}
                    >
                      {initialColumns.map((col) => (
                        <TableCell key={col.key}>
                          {col.render
                            ? col.render(item, index)
                            : item[col.dataIndex]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
            <div className="px-4 py-3 border-t input-label">
              Общая сумма выбранных :{" "}
              {numberToPrice(
                checkedOrder.reduce((sum, { amount }) => sum + amount, 0),
                "сум"
              )}
            </div>
          </TableContainer>
          <div className="mt-12 flex justify-end">
            <div className="flex">
              <Button
                size="medium"
                shape="outlined"
                color="blue"
                borderColor="bordercolor"
                classNameParent="mr-4"
              >
                {t("cancel")}
              </Button>
              <Button size="medium" onClick={debtBalance}>
                {t("Погасить задолжность")}
              </Button>
            </div>
          </div>
          <LoaderComponent isLoader={loader} />
        </Card>
      </div>
    </div>
  )
}
