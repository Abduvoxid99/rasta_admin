import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
//import "./style.scss"
import { StyledTab, StyledTabs } from "../../components/StyledTabs"
import EditIcon from "@material-ui/icons/Edit"
import Button from "../../components/Button"
import DeleteIcon from "@material-ui/icons/Delete"
import RefreshIcon from "@material-ui/icons/Refresh"
import { getData } from "./mockData"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"

export default function CourierTable() {
  const { t } = useTranslation()

  const [selectedTab, setSelectedTab] = useState("orders")
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const tabLabel = (text) => {
    return <span className="px-1">{text}</span>
  }
  const TabBody = useCallback(
    ({ tab, children }) => {
      if (tab === selectedTab) return children
      return <></>
    },
    [selectedTab]
  )

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage])

  const getItems = (page) => {
    getData({ limit: 10, page }).then((res) => {
      setItems({
        count: res.count,
        data: res.data,
      })
    })
  }

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => <>{(currentPage - 1) * 10 + index + 1}</>,
    },
    {
      title: t("Водитель"),
      key: "client_name",
      render: (record, index) => (
        <div>
          <div>{record.client_name}</div>
          <a href="#" className="text-blue-600">
            {record.client_phone}
          </a>
        </div>
      ),
    },
    {
      title: t("Ид.заказа"),
      key: "order_id",
      dataIndex: "order_id",
    },
    {
      title: t("Местоположение"),
      key: "location",
      dataIndex: "location",
    },
    {
      title: t("Продолжительность"),
      key: "duration",
      dataIndex: "duration",
    },
  ]

  return (
    <div className="w-full">
      <div className="border-b">
        <StyledTabs
          value={selectedTab}
          onChange={(_, value) => setSelectedTab(value)}
          indicatorColor="primary"
          textColor="primary"
          centered={false}
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab label={tabLabel(t("Заказы"))} value="orders" />
          <StyledTab label={tabLabel(t("Маршруты"))} value="routes" />
          <StyledTab label={tabLabel(t("График"))} value="schedule" />
        </StyledTabs>
      </div>
      <TabBody tab="orders">
        <div className="flex items-center my-3 gap-4">
          <Button
            size="large"
            icon={EditIcon}
            type="submit"
            shape="outlined"
            color="black"
            borderColor="bordercolor"
            iconClassName="text-blue-600"
          >
            {t("Изменить заказы")}
          </Button>
          <Button
            size="large"
            icon={DeleteIcon}
            type="submit"
            shape="outlined"
            color="black"
            borderColor="bordercolor"
            iconClassName="text-blue-600"
          >
            {t("Удалить заказы")}
          </Button>
          <Button
            size="large"
            icon={RefreshIcon}
            type="submit"
            shape="outlined"
            color="black"
            borderColor="bordercolor"
            iconClassName="text-blue-600"
          >
            {t("Снять заказы с плана")}
          </Button>
        </div>
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
              {items.data && items.data.length
                ? items.data.map((item, index) => (
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
                  ))
                : ""}
            </TableBody>
          </Table>
        </TableContainer>
      </TabBody>
    </div>
  )
}
