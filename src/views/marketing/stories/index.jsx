import React from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"

import Header from "../../../components/Header"
import Button from "../../../components/Button"
import BannersTable from "./Table"

//icon
import AddIcon from "@material-ui/icons/Add"
import usePermissions from "../../../utils/usePermissions"

export default function Stories() {
  const { t } = useTranslation()
  const history = useHistory()

  const permissions = usePermissions("marketing-stories")
  return (
    <>
      <Header
        title={t("Сторис")}
        endAdornment={[
          permissions.post && (
            <Button
              icon={AddIcon}
              size="medium"
              onClick={() => {
                history.push("/home/marketing/stories/create")
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </Filters> */}
      {permissions.get && <BannersTable permissions={permissions} />}
    </>
  )
}
