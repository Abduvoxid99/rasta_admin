import React from "react"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"

//icon
import AddIcon from "@material-ui/icons/Add"
import usePermissions from "../../../utils/usePermissions"

export default function Operator() {
  const { t } = useTranslation()
  const history = useHistory()
  const permissions = usePermissions("operator-list")
  return (
    <>
      {permissions.get && <Table permissions={permissions} />}
    </>
  )
}
