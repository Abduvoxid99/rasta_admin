import React, { useCallback, useEffect, useState } from "react"
import Tag from "../../components/Tag/index"
import axios from "../../utils/axios"
import Modal from "../../components/Modal"
import EditIcon from "@material-ui/icons/Edit"
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar"
import CheckIcon from "@material-ui/icons/Check"
import Pagination from "../../components/Pagination"
import TableLoader from "../../components/TableLoader"
import { useHistory } from "react-router-dom"
import Textarea from "../../components/Textarea/index"
import { useTranslation } from "react-i18next"
import Card from "../../components/Card"
import moment from "moment"
import Select from "../../components/Select"

import {
  getOrders,
  getShippers,
  getCouriers,
  orderPayByCard,
  orderRemoveCouier,
  paymentSms,
  couriersLoadOptions,
  customersloadOptions,
  shipperLoadOptions,
} from "../../services"
import { statusCheck } from "./statuses"
import RefreshIcon from "@material-ui/icons/Refresh"
import ClearIcon from "@material-ui/icons/Clear"
import { useDispatch, useSelector } from "react-redux"
import ActionMenu from "../../components/ActionMenu"
import SwitchColumns from "../../components/Filters/SwitchColumns"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@material-ui/core"
import { numberToPrice } from "../../utils/numberToPrice"
import { setStatusId } from "../../redux/actions/orderAction"
import EnhancedTableHead from "./EnhancedTableHead"
import usePermissions from "../../utils/usePermissions"
import { reorder } from "./utils"
import { getPaymentImg } from "./paymentType"
import OrderTime from "./OrderTime"
import EmptyData from "../../components/EmptyData"
import { statusTabList } from "../../constants/statuses"
import EditModal from "./EditModal"
import useDebounce from "../../utils/useDebounce"
import { customStyles } from "../../components/Select"
import { AsyncPaginate } from "react-select-async-paginate"
import { Input } from "alisa-ui"
import FilterRegionsDropdown from "../../components/FilterRegionsDropdown"

const OrderTable = ({
  filtersData: { start_date, end_date, payment_type, tabValue },

  children,
  statusId,
  userId,
  setTabValue,
  setFilters,
  filters,
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(true)
  const [deleteModal, setDeleteModal] = useState(false)
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [msg, setMsg] = useState("")
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")
  const permissionActions = usePermissions("order")

  const debouncedValueOrderId = useDebounce(search, 500)

  const {
    region_ids,
    shipper_user_id,
    name: shipper_user_name,
  } = useSelector((state) => state.auth)

  useEffect(() => {
    if (currentPage !== 1 && debouncedValueOrderId) {
      setCurrentPage(1)
      return
    }
    setLoader(true)
    getItems(currentPage, tabValue, limit)
    let interval = null
    if (!userId) {
      interval = setInterval(() => {
        getItems(currentPage, tabValue, limit)
      }, 5000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [
    currentPage,
    filters,
    limit,
    start_date,
    end_date,
    debouncedValueOrderId,
    payment_type,
    tabValue,
  ])

  const createdTime = (created_at) => {
    let date = new Date(created_at)
    date.setHours(date.getHours() - new Date(date).getTimezoneOffset() / 60)
    return date
  }
  useEffect(() => {
    let _columns = makeColumns(filters)
    _columns = [
      ..._columns,
      {
        title: (
          <SwitchColumns
            columns={_columns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
          />
        ),
        key: "actions",
        render: (record) => (
          <div>
            <ActionMenu
              id={record.id}
              actions={[
                !record.paid &&
                  record.payment_type === "payme" && {
                    title: t("Повторить оплату"),
                    icon: <RefreshIcon />,
                    color: "yellow",
                    action: async () => {
                      await paymentSms({
                        order_id: record.id,
                        payment_type: "payme",
                        phone: record.client_phone_number,
                        shipper_user_id,
                        shipper_user_name,
                      })
                    },
                  },
                (tabValue === statusTabList[1].id ||
                  tabValue === statusTabList[2].id) &&
                record.courier &&
                record.courier.phone
                  ? {
                      title: t("courier.declined"),
                      icon: <DirectionsCarIcon />,
                      color: "indigo",
                      action: () => {
                        orderRemoveCouier(record.id).then(() => {
                          getItems(currentPage, tabValue, limit)
                        })
                      },
                    }
                  : undefined,
                permissionActions.put && {
                  title: t("edit"),
                  icon: <EditIcon />,
                  color: "blue",
                  action: () => {
                    history.push(`/home/orders/${record.id}`)
                    if (userId) {
                      setTabValue("main")
                    }
                  },
                },
                permissionActions.delete && {
                  title: t("cancel"),
                  icon: <ClearIcon />,
                  color: "red",
                  action: () =>
                    setDeleteModal({
                      id: record.id,
                      shipper_id: record.shipper_id,
                    }),
                },
                {
                  title: t("end.process"),
                  icon: <CheckIcon />,
                  color: "green",
                  action: () =>
                    changeStatus(
                      null,
                      "e665273d-5415-4243-a329-aee410e39465",
                      record.id,
                      record.shipper_id
                    ),
                },
              ]}
            />
          </div>
        ),
      },
    ]
    // setColumns(_columns)
    if (statusTabList[1].id === tabValue) {
      // const columnsTableHead = _columns
      _columns.splice(5, 0, {
        id: 127,
        title: t("Волна курьера"),
        key: "courier-wave",
        width: 100,
        render: (record) => (
          <div>
            {record.wave_courier.first_name &&
              `${record.wave_courier.first_name} ${record.wave_courier.last_name}`}
            <a
              href={`tel:${record.wave_courier.phone}`}
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="text-info cursor-pointer block"
            >
              {record.wave_courier.phone}
            </a>
          </div>
        ),
      })
      setColumns([..._columns])
    } else {
      setColumns([..._columns.filter((item) => item.id !== 127)])
    }
  }, [tabValue, currentPage, limit, filters, search])

  useEffect(() => {
    setCurrentPage(1)
  }, [tabValue, limit])

  useEffect(() => {
    if (statusId === "2" && tabValue === statusTabList[1].id) {
      getItems(currentPage, statusTabList[1].id, limit)
    }
  }, [statusId])

  const getItems = (page, el, limit) => {
    const isLast = el.length > 400
    const end_date2 =
      start_date === end_date
        ? new Date(
            new Date(end_date.split(".").reverse().join("-")).getTime() +
              86400000
          )
            .toISOString()
            .slice(0, 10)
        : end_date.split(".").reverse().join("-")

    const form = {
      page,
      limit,
      status_ids: el,
      start_date: start_date.split(".").reverse().join("-"),
      end_date: end_date2,
      with_wave_couriers: statusTabList[1].id === tabValue,
    }

    if (isLast && debouncedValueOrderId) {
      delete form.start_date
      delete form.end_date
    }

    getOrders({
      ...form,
      ...filters,
      customer_id: userId || (filters.customer_id && filters.customer_id.value),
      courier_id: filters.courier_id && filters.courier_id.value,
      payment_type: payment_type && payment_type?.value,
      shipper_id: filters.shipper_id && filters.shipper_id.value,
      external_order_id: debouncedValueOrderId,
      region_ids:
        filters.region_ids.length > 0
          ? filters.region_ids.map((item) => item.value).join(",")
          : region_ids.join(","),
    })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.orders || [],
        })
        dispatch(setStatusId(null))
      })
      .finally(() => setLoader(false))
  }

  const handleMsg = (e) => {
    setMsg(e.target.value)
  }

  useEffect(() => {
    if (deleteModal === null) {
      setMsg("")
    }
  }, [deleteModal])

  const changeStatus = (
    _,
    statusId = "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
    orderId,
    shipperId
  ) => {
    axios
      .patch(
        `/order/${deleteModal?.id || orderId}/change-status?shipper_id=${
          deleteModal?.shipper_id || shipperId
        }`,
        {
          description: msg,
          status_id: statusId,
        }
      )
      .then(() => {
        setDeleteModal(null)
        getItems(currentPage, tabValue, limit)
      })
  }

  // const openZendesk = (record) => {
  //   if (record.zen_id) {
  //     window.open(
  //       `${process.env.ZENDESK_URL}/agent/users/${record.zen_id}/requested_tickets`
  //     )
  //   } else {
  //     window.open(`${process.env.ZENDESK_URL}/agent/user_filters`)
  //   }
  // }

  const makeColumns = (filters) => [
    {
      id: 22,
      title: "№",
      key: "order-number",
      width: 20,
      render: (_, index) => {
        return (currentPage - 1) * limit + index + 1
      },
    },
    {
      id: 33,
      title: t("client.name"),
      key: "name",
      width: 100,
      filterOptions: true,
      filterComponent: () => {
        return (
          <AsyncPaginate
            value={filters.customer_id}
            loadOptions={customersloadOptions}
            placeholder="Номер телефона"
            styles={customStyles({ height: "32px" })}
            additional={{ page: 1 }}
            isClearable
            onChange={(val) => {
              setFilters((prev) => ({
                ...prev,
                customer_id: val,
              }))
            }}
            menuPortalTarget={document.querySelector("body")}
            menuPlacement="bottom"
          />
        )
      },
      render: (record) => (
        <div className="cursor-pointer">
          {record.client_name}
          <a
            href={`tel:${record.client_phone_number}`}
            className="text-info cursor-pointer block"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {record.client_phone_number}
          </a>
        </div>
      ),
    },
    {
      id: 44,
      title: t("order_id"),
      key: "order_id",
      sorter: false,
      width: 100,
      filterOptions: true,
      filterComponent: () => (
        <Input
          placeholder="Заказ ID"
          type="number"
          onChange={(event) => {
            console.log("search===>", event.target.value)
            setSearch(event.target.value)
          }}
          value={search}
        />
      ),
      render: (record) => <div>{record.external_order_id}</div>,
    },
    {
      id: 55,
      title: t("timer"),
      key: "timer",
      dataIndex: "timer",
      sorter: true,
      onSort: (val) => {
        if (val) {
          if (val === "asc") {
            setFilters((prev) => ({
              ...prev,
              sort_by: "created_at",
            }))
          } else {
            setFilters((prev) => ({
              ...prev,
              sort_by: "-created_at",
            }))
          }
        }
      },
      width: 100,
    },
    {
      id: 66,
      title: t("courier"),
      key: "courier",
      width: 100,
      filterOptions: true,
      filterComponent: () => (
        <AsyncPaginate
          value={filters.courier_id}
          loadOptions={couriersLoadOptions}
          placeholder="Курьер"
          styles={customStyles({ height: "32px" })}
          additional={{ page: 1 }}
          isClearable
          onChange={(val) => {
            setFilters((prev) => ({
              ...prev,
              courier_id: val,
            }))
          }}
          menuPortalTarget={document.querySelector("body")}
          menuPlacement="bottom"
        />
      ),

      render: (record) => (
        <div>
          {record.courier.first_name
            ? `${record.courier.first_name} ${record.courier.last_name}`
            : "----"}
          <a
            href={`tel:${record.courier.phone}`}
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="text-info cursor-pointer block"
          >
            {record.courier.phone}
          </a>
        </div>
      ),
    },
    {
      id: 77,
      title: t("restaurant"),
      key: "restaurant",
      width: 100,
      filterOptions: true,
      filterComponent: () => (
        <AsyncPaginate
          value={filters.shipper_id}
          loadOptions={shipperLoadOptions}
          placeholder="Ресторан"
          styles={customStyles({ height: "32px" })}
          additional={{ page: 1 }}
          isClearable
          onChange={(val) => {
            setFilters((prev) => ({
              ...prev,
              shipper_id: val,
            }))
          }}
          menuPortalTarget={document.querySelector("body")}
          menuPlacement="bottom"
        />
      ),
      render: (record) => (
        <div>{record.shipper_name ? record.shipper_name : "----"}</div>
      ),
    },
    {
      id: 88,
      title: t("branch"),
      key: "branch",
      width: 100,
      render: (record) => (
        <div>
          {record.steps[0].branch_name}
          <a
            href={`tel:${record.steps[0].phone_number}`}
            className="text-info cursor-pointer block"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            {record.steps[0].phone_number}
          </a>
        </div>
      ),
    },
    {
      id: 99,
      title: t("type.delivery"),
      key: "type.delivery",
      width: 120,
      // filterOptions: [
      //   { label: t("delivery"), value: "delivery" },
      //   { label: t("self-pickup"), value: "self-pickup" },
      // ],
      onFilter: (ids) => {
        setFilters((old) => ({
          ...old,
          delivery_type: ids.length ? ids.join(",") : undefined,
        }))
      },
      render: (record) => (
        <Tag color="yellow" size="large" shape="subtle">
          {t(
            record.delivery_type === "delivery"
              ? "type-delivery"
              : "type-self-pickup"
          )}
        </Tag>
      ),
    },
    {
      id: 100,
      title: t("price"),
      key: "price",
      sorter: true,
      width: 100,
      onSort: (val) => {
        if (val) {
          if (val === "asc") {
            setFilters((prev) => ({
              ...prev,
              sort_by: "order_amount",
            }))
          } else {
            setFilters((prev) => ({
              ...prev,
              sort_by: "-order_amount",
            }))
          }
        }
      },

      render: (record) => (
        <div className="font-medium flex items-center flex-col">
          <div>
            <img
              className="h-10 w-auto object-cover"
              src={getPaymentImg(record.payment_type)}
              alt="payment-img"
            />
          </div>
          <span
            className={
              record.paid
                ? "px-4 py-1 rounded-md mt-2 font-semibold bg-green-100 text-green-600 whitespace-nowrap"
                : ""
            }
          >
            {record.delivery_discount_value ? (
              record.delivery_discount_type === "percent" ? (
                <span className="mr-2">
                  {numberToPrice(
                    (record.co_delivery_price *
                      (100 - record.delivery_discount_value)) /
                      100 +
                      record.order_amount,
                    "сум "
                  )}
                </span>
              ) : (
                <span className="mr-2">
                  {numberToPrice(
                    record.order_amount +
                      (record.co_delivery_price -
                        record.delivery_discount_value >=
                      0
                        ? record.co_delivery_price -
                          record.delivery_discount_value
                        : 0),
                    " сум"
                  )}
                </span>
              )
            ) : (
              numberToPrice(
                record.order_amount + record.co_delivery_price,
                "сум"
              )
            )}
          </span>
        </div>
      ),
    },
    {
      id: 1123,
      title: t("region"),
      key: "region_name",
      dataIndex: "region_name",
      filterOptions: true,
      filterComponent: () => (
        <FilterRegionsDropdown setFilters={setFilters} filters={filters} />
      ),
    },
    {
      id: 110,
      title: t("client.address"),
      key: "client.address",
      width: 120,
      render: (record) => (
        <div className="truncate w-44">
          <Tooltip title={record.to_address} placement="top">
            <span>{record.to_address}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 1130,
      title: t("client.source"),
      key: "client.source",
      width: 120,
      render: (record) => (
        <div className="truncate w-44">
          <Tooltip title={t(`smartphone.${record.source}`)} placement="top">
            <span>{t(`smartphone.${record.source}`)}</span>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 11330,
      title: t("added.date"),
      key: "client.date",
      width: 120,
      render: (record) => (
        <div className="truncate w-44">
          <Tooltip
            title={moment(createdTime(record.created_at)).format(
              "YYYY.MM.DD HH:mm:ss"
            )}
            placement="top"
          >
            <span>
              {moment(createdTime(record.created_at)).format(
                "YYYY.MM.DD HH:mm:ss"
              )}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ]

  const [columns, setColumns] = useState([])

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }
    const columnData = reorder(
      [...columns],
      result.source.index,
      result.destination.index
    )

    setColumns(columnData)
  }

  const handleWidthChange = (columnId, width) => {
    setColumns((prev) => {
      const currentColumns = prev
      const currentColumnIndex = currentColumns.findIndex((column) => {
        return column.id === columnId
      })
      const columnToChange = currentColumns[currentColumnIndex]
      const changedColumn = { ...columnToChange, width }
      currentColumns.splice(currentColumnIndex, 1, changedColumn)
      return currentColumns
    })
  }

  return (
    <div className="p-4">
      <Card
        title={children}
        headerStyle={{ padding: 0 }}
        footer={
          <Pagination
            title={t("general.count")}
            count={items?.count}
            pageCount={limit}
            onChange={(pageNumber) => setCurrentPage(pageNumber)}
            currentPage={currentPage}
            onChangeLimit={(limitNumber) => {
              setLimit(limitNumber)
            }}
            limit={limit}
          />
        }
      >
        <TableContainer className="rounded-md border border-bordercolor">
          <Table aria-label="simple table" className="orders-table">
            <EnhancedTableHead
              handleReorderColumnData={onDragEnd}
              handleResizeColumn={handleWidthChange}
              columnData={columns}
              rowCount={columns.length}
            />
            {!loader && (
              <TableBody>
                {items.data &&
                  items.data.length > 0 &&
                  items.data.map((elm, index) => (
                    <TableRow
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                      onClick={
                        permissionActions.put
                          ? () => {
                              setModal(elm.id)
                              // history.push(`/home/orders/${elm.id}`)
                              // if (userId) {
                              //   setTabValue("main")
                              // }
                            }
                          : undefined
                      }
                      key={elm.id}
                    >
                      {columns.map((col, index2) => (
                        <TableCell
                          key={col.key + elm.id}
                          style={{
                            backgroundColor:
                              index % 2 === 0 && index2 === columns.length - 1
                                ? "#F4F6FA"
                                : "",
                          }}
                        >
                          {col.render ? (
                            col.render(elm, index)
                          ) : col.dataIndex === "timer" ? (
                            <div className="w-38">
                              <OrderTime elm={elm} />
                              <div className="text-center text-xs mt-2">
                                {statusCheck(elm.status_id, t)}
                              </div>
                            </div>
                          ) : (
                            elm[col.dataIndex]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
          {items.data && items.data.length === 0 && (
            <EmptyData loading={loader} width="1770px" />
          )}
        </TableContainer>
        <TableLoader isVisible={loader} />
      </Card>

      <EditModal
        open={modal}
        onClose={(fn) => {
          setModal(null)
          fn()
        }}
        onConfirm={changeStatus}
      />

      <Modal
        disable={!msg.length >= 1}
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={changeStatus}
      >
        <Textarea
          aria-label="minimum height"
          minRows={3}
          className="mb-6"
          placeholder="Причина"
          error={!msg.length >= 1}
          onChange={(e) => handleMsg(e)}
          value={msg}
        />
      </Modal>
    </div>
  )
}

export default OrderTable
