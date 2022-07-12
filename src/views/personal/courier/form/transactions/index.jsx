import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
//components
import Pagination from "../../../../../components/Pagination"
import Card from "../../../../../components/Card"
import LoaderComponent from "../../../../../components/Loader"

//icons
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"

import TextFilter from "../../../../../components/Filters/TextFilter"
import StatusBadge from "../../../../../components/StatusBadge"
import Button from "../../../../../components/Button"
import {
  getCourierTransactions,
  getCourierBalance,
  deductBalance,
} from "../../../../../services/courier"
import moment from "moment"
import { numberToPrice } from "../../../../../utils/numberToPrice"
import DeductBalance from "./DeductBalance"

const data = [
  {
    id: "key",
    // orderNumber:"",
  },
]

export default function TransactionTable({ shipper_id }) {
  const [loader, setLoader] = useState(false)
  const { t } = useTranslation()
  const history = useHistory()
  const { id } = useParams()
  const [items, setItems] = useState({ data })
  const [currentPage, setCurrentPage] = useState(1)
  const [openDeductBalance, setOpenDeductBalance] = useState(false)
  const [balanceInfo, setBalanceInfo] = useState({
    balance: null,
    company_debt_balance: null,
  })
  // useEffect(() => {
  //   const _columns = [
  //     ...initialColumns,
  //     {
  //       title: (
  //         <SwitchColumns
  //           columns={initialColumns}
  //           onChange={(val) =>
  //             setColumns((prev) => [...val, prev[prev.length - 1]])
  //           }
  //         />
  //       ),
  //       key: t("actions"),
  //       render: (record, _) => (
  //         <ActionMenu
  //           id={record.id}
  //           actions={[
  //             {
  //               icon: <EditIcon />,
  //               color: "blue",
  //               title: t("change"),
  //               action: () => {
  //                 // history.push(`/home/company/users/${shipper_id}/${record.id}`)
  //                 console.log("click")
  //               },
  //             },
  //             {
  //               icon: <DeleteIcon />,
  //               color: "red",
  //               title: t("delete"),
  //               action: () => {
  //                 console.log("click")
  //                 // setDeleteModal({ id: record.id })
  //               },
  //             },
  //           ]}
  //         />
  //       ),
  //     },
  //   ]
  //   setColumns(_columns)
  // }, [])

  // const handleDeleteItem = () => {
  //   setDeleteLoading(true)
  //   deleteBranchUser(deleteModal.id)
  //     .then(res => {
  //       getItems(currentPage)
  //       setDeleteLoading(false)
  //       setDeleteModal(null)
  //     })
  //     .finally(() => setDeleteLoading(false))
  // }

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage])

  useEffect(() => {
    getBalance()
  }, [])

  const getBalance = () => {
    getCourierBalance(id).then((res) => {
      setBalanceInfo((prev) => ({
        ...prev,
        ...res,
      }))
    })
  }

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div>{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("Дата"),
      key: "name",
      render: (record) => (
        <div>{moment(record.created_at).format("DD.MM.YYYY")}</div>
      ),
    },
    {
      title: t("current.number"),
      key: "current.number",
      render: (record) => <div>1649273468</div>,
    },
    {
      title: t("sum"),
      key: "sum",
      render: (record) => (
        <div>{numberToPrice(record.transaction_amount, "сум")}</div>
      ),
    },
    {
      title: t("payment.type"),
      key: "payment.type",
      render: (record) => <div>Наличные</div>,
    },
    {
      title: t("status"),
      key: "status",
      filterOptions: [{ label: "status", value: "123" }],
      onFilter: (val) => console.log(val),
      render: (record) => <StatusBadge children="active" />,
    },
  ]

  const getItems = (page) => {
    setLoader(true)
    getCourierTransactions({ limit: 10, page, shipper_id, courier_id: id })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.transactions,
        })
      })
      .finally(() => setLoader(false))
  }

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  )

  const onModalSubmit = (values) => {
    deductBalance(id, values).then(() => {
      setOpenDeductBalance((prev) => !prev)
      getBalance()
    })
  }

  return (
    <div className="p-4">
      <Card footer={pagination}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-md border">
            <div className="flex justify-between">
              <div className="h-16 w-16 flex justify-center rounded-md items-center bg-blue-600">
                <AttachMoneyIcon fontSize="large" style={{ color: "#fff" }} />
              </div>
              <div className="flex flex-col items-end">
                <div className="input-label font-semibold text-sm">Баланс</div>
                <div
                  style={{ color: "var(--color-primary)" }}
                  className="text-xl font-semibold mt-3"
                >
                  {balanceInfo.balance &&
                    numberToPrice(balanceInfo.balance, "сум")}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button
                size="medium"
                onClick={() => setOpenDeductBalance((prev) => !prev)}
              >
                {t("Вывести")}
              </Button>
            </div>
          </div>
          <div className="p-4 rounded-md border">
            <div className="flex justify-between ">
              <div className="h-16 w-16 flex justify-center rounded-md items-center bg-red-600">
                <AttachMoneyIcon fontSize="large" style={{ color: "#fff" }} />
              </div>
              <div className="flex flex-col items-end">
                <div className="input-label font-semibold text-sm">
                  Задолжность перед курьером
                </div>
                <div className="text-xl font-semibold mt-3 text-red-600">
                  {balanceInfo.company_debt_balance &&
                    numberToPrice(balanceInfo.company_debt_balance, "сум")}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button
                size="medium"
                onClick={() => history.push(`/home/courier/list/${id}/debt`)}
              >
                {t("Погасить задолжность")}
              </Button>
            </div>
          </div>
        </div>
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
              {items.data && items.data.length ? (
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
        </TableContainer>

        <LoaderComponent isLoader={loader} />
        {/*<Modal*/}
        {/*  open={deleteModal}*/}
        {/*  onClose={() => setDeleteModal(null)}*/}
        {/*  onConfirm={handleDeleteItem}*/}
        {/*  loading={deleteLoading}*/}
        {/*/>*/}
      </Card>
      <DeductBalance
        title={null}
        footer={null}
        open={openDeductBalance}
        onClose={() => setOpenDeductBalance((prev) => !prev)}
        onSubmit={onModalSubmit}
        maxPrice={balanceInfo.balance}
      />
    </div>
  )
}
