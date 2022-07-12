import React from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

//components
import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icons
import AddIcon from "@material-ui/icons/Add"
import usePermissions from "../../../utils/usePermissions"

export default function ProductsCollection() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissions = usePermissions("marketing-company-collection")
  return (
    <div>
      <Header
        title={t("product.collection")}
        endAdornment={[
          permissions.post && (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() => history.push("/home/marketing/products-collection/create")}
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
