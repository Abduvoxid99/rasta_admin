import React from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icon
import AddIcon from "@material-ui/icons/Add"
import usePermissions from "../../../utils/usePermissions"

export default function Courier() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissions = usePermissions("courier-list")
  return (
    <div>
      <Header
        title={t("courier")}
        endAdornment={[
          permissions.post && (
            !history?.location?.pathname.includes('offer') ? <Button
              icon={AddIcon}
              size="medium"
              onClick={() => history.push("/home/courier/list/create")}
            >
              {t("add")}
            </Button> : ''
          ),
        ]}
      />
      {permissions.get && <Table permissions={permissions} />}
    </div>
  )
}
