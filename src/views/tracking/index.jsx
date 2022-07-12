//import "./style.scss"
import Header from "../../components/Header"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"
import AddIcon from "@material-ui/icons/Add"
import Button from "../../components/Button"
import React, { useState } from "react"
import usePermissions from "../../utils/usePermissions"
import MapCard from "./MapCard"
import moment from "moment"
import Filters from "../../components/Filters"
import { DownloadIcon, PlacemarkIcon } from "../../constants/icons"
import { Input } from "alisa-ui"
import RangePicker from "../../components/DatePicker/RangePicker"
import SearchIcon from "@material-ui/icons/Search"
import RightContent from "./RightContent"

export default function Tracking() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissions = usePermissions("clients")
  const [filters, setFilters] = useState({
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().add(1, "d").format("YYYY-MM-DD"),
  })

  console.log(filters)

  const extraFilter = (
    <div className="flex gap-4">
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
      <Button
        icon={DownloadIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button>
    </div>
  )
  return (
    <div>
      <Header
        title={t("Диспетчерская панель")}
        endAdornment={[
          permissions.post && (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() => history.push("/home/personal/clients/create")}
            >
              {t("Создать заказ")}
            </Button>
          ),
        ]}
      />
      <Filters extra={extraFilter}>
        <div className="flex gap-4">
          <Input
            width={240}
            placeholder={t("search")}
            size="middle"
            addonBefore={
              <SearchIcon style={{ fill: "var(--color-primary)" }} />
            }
          />
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
            onChange={(e) => {
              e[0] === null
                ? setFilters((old) => ({
                    ...old,
                    start_date: undefined,
                    end_date: undefined,
                  }))
                : setFilters((old) => ({
                    ...old,
                    start_date: moment(e[0]).format("YYYY-MM-DD"),
                    end_date: moment(e[1]).format("YYYY-MM-DD"),
                  }))
            }}
          />
        </div>
      </Filters>
      <div className="grid grid-cols-12 gap-4 m-4">
        <div className="col-span-9">
          <MapCard />
        </div>
        <div className="col-span-3">
          <RightContent />
        </div>
      </div>
    </div>
  )
}
