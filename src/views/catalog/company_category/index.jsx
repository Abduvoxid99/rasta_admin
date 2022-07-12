import React from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icon
import AddIcon from "@material-ui/icons/Add"
import usePermissions from "../../../utils/usePermissions"

export default function CompanyCategory() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissions = usePermissions("marketing-company-category")
  return (
    <div>
      <Header
        title={t("company_category")}
        endAdornment={[
          permissions.post && (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() =>
                history.push("/home/marketing/company_category/create")
              }
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
