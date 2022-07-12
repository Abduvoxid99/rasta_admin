import "./style.scss"
import React, { useState } from "react"
import Table from "./Table"
import Button from "../../../components/Button"
import Header from "../../../components/Header"
import AddIcon from "@material-ui/icons/Add"
import Filters from "../../../components/Filters"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { StyledTab, StyledTabs } from "../../../components/StyledTabs"
import Breadcrumb from "../../../components/Breadcrumb"
import { AsyncPaginate } from "react-select-async-paginate"
import axios from "../../../utils/axios"
import { customStyles } from "../../../components/Select"

export default function Catalog() {
  const { t } = useTranslation()
  const history = useHistory()
  const { menu_id, shipper_id } = useParams()
  const query = new URLSearchParams(history.location.search)
  const [category, setCategory] = useState(null)
  const [selectedTab, setSelectedTab] = useState(query.get("tab") || "category")
  const [search, setSearch] = useState("")
  const tabLabel = (text) => {
    return <span className="px-1">{text}</span>
  }

  const [optionModal, setOptionModal] = useState(false)

  const routes = [
    {
      title: t("restaurants"),
      link: true,
      route: `/home/company/shipper-company/${shipper_id}?tab=menu`,
    },
    {
      title: t("menu"),
      link: true,
      route: `/home/company/shipper-company/${shipper_id}?tab=menu`,
    },
    {
      title: t(selectedTab),
    },
  ]

  const getCategoriesData = async (search, limit, page, menuId) => {
    return axios.get("/category", {
      params: { all: true, menu_id: menuId, search, limit, page },
    })
  }

  const loadOptionsCategory = async (search, prevOptions, { page }) => {
    const res = await getCategoriesData(search, 10, page, menu_id)
    const hasMore = res.count > prevOptions.length + 10
    return {
      options: res.categories?.map((elm) => ({
        label: elm.name.ru,
        value: elm.id,
        elm,
      })),
      hasMore,
      additional: {
        page: page + 1,
      },
    }
  }

  return (
    <div>
      <Header
        startAdornment={[
          <Breadcrumb routes={routes} backWithUrl={routes[0].route} />,
        ]}
        endAdornment={[
          selectedTab !== "ingredients" && (
            <Input
              placeholder={t("search")}
              size="middle"
              onChange={(e) => setSearch(e.target.value)}
              addonBefore={
                <SearchIcon style={{ fill: "var(--color-primary)" }} />
              }
            />
          ),
          <Button
            color="blue"
            size="medium"
            icon={AddIcon}
            onClick={() => {
              if (selectedTab === "ingredients") {
                setOptionModal((prev) => !prev)
              } else {
                history.push(
                  `/home/company/shipper-company/${shipper_id}/menu/${menu_id}/${selectedTab}/create`
                )
              }
            }}
          >
            {t("add")}
          </Button>,
        ]}
      />

      <Filters
        extra={
          selectedTab === "product" && (
            <div className="w-60">
              <AsyncPaginate
                value={category}
                id="category"
                loadOptions={loadOptionsCategory}
                additional={{ page: 1 }}
                placeholder="Выберите категорию"
                isClearable
                styles={customStyles({ height: "32px" })}
                onChange={(val) => setCategory(val)}
              />
            </div>
          )
        }
      >
        <StyledTabs
          value={selectedTab}
          onChange={(_, value) => setSelectedTab(value)}
          indicatorColor="primary"
          textColor="primary"
          centered={false}
          aria-label="full width tabs example"
          TabIndicatorProps={{ children: <span className="w-2" /> }}
        >
          <StyledTab
            onClick={() => {
              history.push({
                pathname: history.location.pathname,
                search: "?tab=category",
              })
            }}
            label={tabLabel(t("categories"))}
            value="category"
          />
          <StyledTab
            label={tabLabel(t("products"))}
            onClick={() => {
              history.push({
                pathname: history.location.pathname,
                search: "?tab=product",
              })
            }}
            value="product"
          />
          <StyledTab
            label={tabLabel(t("ingredients"))}
            value="ingredients"
            onClick={() => {
              history.push({
                pathname: history.location.pathname,
                search: "?tab=ingredients",
              })
            }}
          />
        </StyledTabs>
      </Filters>
      <Table
        tab={selectedTab}
        optionModal={optionModal}
        search={search}
        categoryId={category?.value}
        setOptionModal={setOptionModal}
      />
    </div>
  )
}
