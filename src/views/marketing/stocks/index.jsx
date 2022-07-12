import React from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"
import RefreshIcon from "@material-ui/icons/Refresh"
import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icon
import AddIcon from "@material-ui/icons/Add"
import usePermissions from "../../../utils/usePermissions"

export default function Courier() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissions = usePermissions("marketing-promotions")
  return (
    <div>
      <Header
        title={t("list.stocks")}
        endAdornment={[
          // <Button
          //   icon={RefreshIcon}
          //   iconClassName="text-blue-600"
          //   shape="outlined"
          //   size="medium"
          //   className="bg-white"
          //   borderColor="bordercolor"
          //   onClick={() => {
          //     console.log("clicked")
          //   }}
          // >
          //   Обновить Telegram
          // </Button>,
          permissions.post && (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() => history.push(`/home/marketing/stocks/create`)}
            >
              {t("add")}
            </Button>
          ),
        ]}
      />
      {permissions.get && <Table permissions={permissions} />}
    </div>
  )
}
