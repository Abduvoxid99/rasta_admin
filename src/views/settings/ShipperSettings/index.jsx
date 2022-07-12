import React from "react"
import "./style.scss"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

//components
import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icons
import AddIcon from "@material-ui/icons/Add"
import usePermissions from "../../../utils/usePermissions"

export default function ShipperSettings() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissions = usePermissions("shipper-company")
  return (
    <div>
      <Header
        title={t("restaurants")}
        endAdornment={[
          permissions.post && (
            <Button
              onClick={() =>
                history.push("/home/company/shipper-company/create")
              }
              icon={AddIcon}
              size="medium"
            >
              {t("add")}
            </Button>
          ),
        ]}
      />
      <Table permissions={permissions} />
    </div>
  )
}
