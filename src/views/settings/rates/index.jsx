import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import Table from "./Table"
import Header from "../../../components/Header"
import Button from "../../../components/Button"
import Filters from "../../../components/Filters"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"

//icon
import AddIcon from "@material-ui/icons/Add"
import usePermissions from "../../../utils/usePermissions"

export default function Rates() {
  const { t } = useTranslation()
  const history = useHistory()
  const [createModal, setCreateModal] = useState(null)
  const permissions = usePermissions("settings-tariff")
  return (
    <>
      <Header
        title={t("fares")}
        endAdornment={[
          permissions.post && (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() => {
                history.push("/home/settings/fares/create")
                // setCreateModal(true)
              }}
            >
              {t("add")}
            </Button>
          ),
        ]}
      />
      {/* <Filters>
        <Input
          // width={410}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon style={{ color: "var(--color-primary)" }} />}
          // onChange={onSearch}
        />
      </Filters> */}
      {permissions.get && (
        <Table
          createModal={createModal}
          setCreateModal={setCreateModal}
          permissions={permissions}
        />
      )}
    </>
  )
}
