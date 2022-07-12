import "./style.scss"
import Table from "./Table"
import Header from "../../components/Header"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"
import AddIcon from "@material-ui/icons/Add"
import Button from "../../components/Button"
import React from "react"
import usePermissions from "../../utils/usePermissions"

export default function Clients() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissions = usePermissions("clients")
  return (
    <div>
      <Header
        title={t("clients")}
        endAdornment={[
          permissions.post && (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() => history.push("/home/personal/clients/create")}
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
