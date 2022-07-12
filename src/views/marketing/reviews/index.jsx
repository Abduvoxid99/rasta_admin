import React from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"

import Header from "../../../components/Header"
import Button from "../../../components/Button"
import Filters from "../../../components/Filters"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"
import BannersTable from "./Table"

//icon
import AddIcon from "@material-ui/icons/Add"

export default function Reviews() {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <>
      <Header
        title={t("reviews")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/marketing/reviews/create")
              // setCreateModal(true)
            }}
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Filters>
        <Input
          // width={410}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon style={{ color: "var(--color-primary)" }} />}
          // onChange={onSearch}
        />
      </Filters>
      <BannersTable />
    </>
  )
}
