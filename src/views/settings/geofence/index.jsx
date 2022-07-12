import React from "react"
import Header from "../../../components/Header"
import Table from "./Table"
import { useTranslation } from "react-i18next"
import Button from "../../../components/Button"
import { useHistory } from "react-router-dom"
import AddIcon from "@material-ui/icons/Add"
import "./style.scss"
import usePermissions from "../../../utils/usePermissions"

export default function Geofence() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissions = usePermissions("settings-region")
  return (
    <>
      <Header
        title={t("menu.regions")}
        endAdornment={[
          permissions.post && (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() => history.push("/home/settings/geofence/create")}
            >
              {t("add")}
            </Button>
          ),
        ]}
      />
      {permissions.get && <Table permissions={permissions} />}
    </>
  )
}
