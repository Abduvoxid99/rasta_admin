/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import axios from "../../utils/axios"
import { useHistory } from "react-router"
import { Input } from "alisa-ui"

//components
import Pagination from "../../components/Pagination"
import LoaderComponent from "../../components/Loader"
import Card from "../../components/Card"
import ActionMenu from "../../components/ActionMenu"
import ClientCard from "../../components/ClientCard"
import Button from "../../components/Button"
import Filters from "../../components/Filters"

//icons
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import GroupIcon from "@material-ui/icons/Group"
import SearchIcon from "@material-ui/icons/Search"
import NotificationsIcon from "@material-ui/icons/Notifications"
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar"
import Modal from "../../components/Modal"
import { deleteCustomer } from "../../services"
import StatusTag from "../../components/Tag/StatusTag"
import TextFilter from "../../components/Filters/TextFilter"
import TableChartIcon from "@material-ui/icons/TableChart"
import { DownloadIcon, ExportIcon } from "../../constants/icons"
import { useSelector } from "react-redux"
import EmptyData from "../../components/EmptyData"
import FilterRegionsDropdown from "../../components/FilterRegionsDropdown"

const ApplicationTable = ({ permissions }) => {
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const history = useHistory()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({
    region_ids: [],
  })
  const [limit, setLimit] = useState(10)
  const { region_ids } = useSelector((state) => state.auth)
  let debounce = setTimeout(() => {}, 0)

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteCustomer(deleteModal.id)
      .then(() => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, search, limit, filters])

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }

  const getItems = (page) => {
    setLoader(true)
    clearItems()
    axios
      .get("/customers", {
        params: {
          limit,
          page,
          search,
          region_ids:
            filters.region_ids.length > 0
              ? filters.region_ids.map((item) => item.value).join(",")
              : region_ids.join(","),
        },
      })
      .then((res) => {
        setItems(res)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoader(false))
  }

  const onSearch = (e) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      setSearch(e.target.value)
    }, 300)
  }

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={ExportIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          console.log("clicked")
        }}
      >
        {t("import")}
      </Button>

      <Button
        icon={DownloadIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button>
    </div>
  )

  return (
    <div>
      <Filters extra={extraFilter}>
        <div className="flex gap-4 items-center">
          <Input
            onChange={onSearch}
            width={280}
            placeholder={t("search")}
            size="middle"
            addonBefore={
              <SearchIcon style={{ color: "var(--color-primary)" }} />
            }
          />
          <FilterRegionsDropdown setFilters={setFilters} filters={filters} />
        </div>
      </Filters>

      <ClientCard
        classNameCard="justify-center"
        classNameIcon="mr-8"
        cards={[
          {
            icon: <GroupIcon fontSize="large" />,
            count: items.count,
            title: t("clients"),
          },
        ]}
        inversely={true}
        columnNumber={1}
      />

      <Card
        className="m-4"
        footer={
          <Pagination
            title={t("general.count")}
            count={items?.count}
            onChange={(pageNumber) => setCurrentPage(pageNumber)}
            pageCount={limit}
            onChangeLimit={(limitNumber) => setLimit(limitNumber)}
            limit={limit}
          />
        }
      >
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>
                  <TextFilter title={t("name.client")} />
                </TableCell>
                <TableCell>
                  <TextFilter title={t("phone.number")} />
                </TableCell>
                <TableCell>
                  <TextFilter title={t("region")} />
                </TableCell>
                <TableCell>
                  <TextFilter title={t("status")} />
                </TableCell>
                <TableCell align="right">
                  <TableChartIcon className="text-primary" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.customers && items.customers.length ? (
                items.customers.map(
                  ({ id, name, phone, is_blocked, region_name }, index) => (
                    <TableRow
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                      key={id}
                      onClick={() =>
                        permissions.put &&
                        history.push(`/home/personal/clients/${id}`)
                      }
                    >
                      <TableCell>
                        <p>{(currentPage - 1) * 10 + index + 1}</p>
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>
                        <div>{phone}</div>
                      </TableCell>
                      <TableCell>{region_name}</TableCell>
                      <TableCell className="px-5">
                        {/*<CheckStatus*/}
                        {/*  status={!is_blocked}*/}
                        {/*/>*/}
                        <div className="w-10/12">
                          <StatusTag
                            status={!is_blocked}
                            color={is_blocked ? "#F2271C" : "#0E73F6"}
                          />
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <ActionMenu
                          id={id}
                          actions={[
                            permissions.put && {
                              icon: <EditIcon />,
                              color: "blue",
                              title: t("change"),
                              action: () => {
                                history.push(`/home/personal/clients/${id}`)
                              },
                            },
                            permissions.delete && {
                              icon: <DeleteIcon />,
                              color: "red",
                              title: t("delete"),
                              action: () => {
                                setDeleteModal({ id: id })
                              },
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
          {items.customers && items.customers.length === 0 && (
            <EmptyData loading={loader} />
          )}
        </TableContainer>

        <LoaderComponent isLoader={loader} />
        {/* <Pagination title={t("general.count")} count={items?.count}
                    onChange={pageNumber => setCurrentPage(pageNumber)} /> */}
        <Modal
          open={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDeleteItem}
          loading={deleteLoading}
        />
      </Card>
    </div>
  )
}

export default ApplicationTable
