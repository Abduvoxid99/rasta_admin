import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import Breadcrumb from "../../../components/Breadcrumb"
import Header from "../../../components/Header"
import Card from "../../../components/Card"
import Button from "../../../components/Button"
import CustomSkeleton from "../../../components/Skeleton"
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import {
  getCustomers,
  getOrders,
  orderWithAveragePrice,
} from "../../../services"
import StatusTag from "../../../components/Tag/StatusTag"
import { statusCheck } from "../../orders/statuses"

export default function Calls() {
  const history = useHistory()

  const { t } = useTranslation()
  const [loader, setLoader] = useState(true)
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const query = new URLSearchParams(history.location.search)

  const getItem = () => {
    setLoader(true)
    getCustomers({
      search: query.get("phone"),
    })
      .then((res) => {
        if (res.customers.length > 0) {
          setCustomer(res.customers[0])
          getOrders({ customer_id: res.customers[0].id }).then((res) => {
            console.log(res)
            setOrders(res.orders)
          })
        }
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    if (query && query.get("phone")) {
      getItem()
    } else {
      setLoader(false)
    }
  }, [query.get("phone")])

  if (loader) return <CustomSkeleton />

  const routes = [
    {
      title: t("Информация о клиенте"),
      link: true,
      route: `/home/orders`,
    },
  ]

  console.log(customer)

  return (
    <div className="w-full">
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={[
          <Button
            size="large"
            type="button"
            onClick={() => {
              history.push("/home/orders/create")
            }}
          >
            Оформить заказ
          </Button>,
        ]}
      />

      <div className="p-4">
        <Card title={`Новый звонок от: ${customer && customer.phone}`}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 rounded-lg border">
              <div className="border-b px-2 py-3 text-md font-medium">
                Информация о клиенте
              </div>
              <div className="flex justify-center py-10">
                <div className="bg-gray-200 rounded-full flex items-center justify-center w-52 h-52">
                  <PersonOutlineOutlinedIcon
                    style={{ fontSize: "120px", color: "#fff" }}
                  />
                </div>
              </div>
              {customer && (
                <>
                  <div className="px-4 py-3">
                    <div className="flex justify-between mb-3">
                      <span className="text-md font-semibold">Название:</span>
                      <span className="text-md">{customer.name}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-md font-semibold">
                        Номер телефона:
                      </span>
                      <span className="text-md">{customer.phone}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-md font-semibold">Статус:</span>
                      <span className="text-md">
                        <StatusTag
                          status={!customer.is_blocked}
                          color={customer.is_blocked ? "#F2271C" : "#0E73F6"}
                        />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-md font-semibold">
                        Дата создания:
                      </span>
                      <span className="text-md">{customer.created_at}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="col-span-8 rounded-md border">
              <div className="border-b px-2 py-3 text-md font-medium">
                Заказы клиентов
              </div>
              <div className="px-2 py-3">
                <table className="w-full rounded-lg border overflow-hidden">
                  <TableContainer className="rounded-lg border border-lightgray-1">
                    <Table aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ид.заказа</TableCell>
                          <TableCell>Адрес</TableCell>
                          <TableCell>Итоговая сумма</TableCell>
                          <TableCell>Статус</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((item) => (
                          <TableRow
                            key={item.id}
                            onClick={() =>
                              history.push(`/home/orders/${item.id}`)
                            }
                          >
                            <TableCell>{item.external_order_id}</TableCell>
                            <TableCell>{item.to_address}</TableCell>
                            <TableCell>
                              {item.order_amount + item.co_delivery_price}
                            </TableCell>
                            <TableCell>
                              {statusCheck(item.status_id, t)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </table>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
