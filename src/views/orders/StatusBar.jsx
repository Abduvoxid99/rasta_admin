import React, { useState, useEffect } from "react"
import { StyledTab, StyledTabs } from "../../components/StyledTabs/index"
import { useTranslation } from "react-i18next"
import OrderTable from "./Table"
import { getCountOrder } from "../../services/order"
import { statusTabList } from "../../constants/statuses"
import { useDispatch, useSelector } from "react-redux"
import { setStatusId } from "../../redux/actions/orderAction"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { defineCount, reorder } from "./utils"
import ExtraSearchFilterComponent from "./ExtraSearchComponent"
import moment from "moment"

const StatusBar = ({
  filters,
  statusId,
  setTab,
  extraFilterProp,
  filtersData,
  setFiltersData,
  setFilters,
}) => {
  const { t } = useTranslation()
  const [tabs, setTabs] = useState([...statusTabList])
  const [tabValue, setTabValue] = useState(tabs[0].id)
  const [ordersCount, setOrdersCount] = useState([])
  const { region_ids } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const interval = setInterval(() => {
      getCount()
    }, 5000)
    return () => clearInterval(interval)
  }, [filtersData])

  useEffect(() => {
    getCount()
  }, [filtersData.end_date, filtersData.start_date, filtersData.tabValue])

  useEffect(() => {
    setTab(tabValue)
  }, [tabValue])

  //console.log(filters.start_date)

  const getCount = () => {
    const formatStatusList = Array.from(
      new Set(
        statusTabList
          .map((elm) => elm.id.split(","))
          .reduce((acc, curr) => [...acc, ...curr], [])
          .map((el) => el.trim())
      )
    )

    const end_date =
      filtersData.start_date === filtersData.end_date
        ? new Date(
            new Date(
              filtersData.end_date.split(".").reverse().join("-")
            ).getTime() + 86400000
          )
            .toISOString()
            .slice(0, 10)
        : filtersData.end_date.split(".").reverse().join("-")
    getCountOrder({
      status_ids: formatStatusList.join(","),
      start_date: filtersData.start_date.split(".").reverse().join("-"),
      end_date: end_date,
      region_ids: region_ids.join(","),
    }).then((res) => {
      setOrdersCount(res.orders_count)
      dispatch(setStatusId(null))
    })
  }

  const TabLabel = ({ isActive = false, count, children }) => {
    return (
      <div className="flex items-center">
        <span
          className={`px-1 ${isActive ? "text-blue-600" : "text-secondary"}`}
        >
          {children}
        </span>
        {count > 0 && (
          <span
            className={`inline-flex items-center 
                justify-center px-1.5 py-1 ml-2 text-xs 
                font-bold leading-none text-white
                ${isActive ? "bg-blue-600" : "bg-secondary"} rounded-full`}
          >
            {count}
          </span>
        )}
      </div>
    )
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }
    const columnData = reorder(
      [...tabs],
      result.source.index,
      result.destination.index
    )
    setTabs(columnData)
  }

  useEffect(() => {
    if (!extraFilterProp) {
      setFiltersData((prev) => ({
        ...prev,
        customer_id: null,
        external_order_id: null,
        courier_id: null,
        payment_type: null,
      }))
    }
  }, [extraFilterProp])

  return (
    <OrderTable
      // tabValue={tabValue}
      filters={filters}
      statusId={statusId}
      setFilters={setFilters}
      setFiltersData={setFiltersData}
      filtersData={filtersData}
    >
      {extraFilterProp ? (
        <ExtraSearchFilterComponent
          setFilters={setFiltersData}
          filters={filtersData}
        />
      ) : (
        ""
      )}
      <div className="px-4 mui-tab-drag">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, _) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <StyledTabs
                  value={tabValue}
                  onChange={(e, val) => {
                    setTabValue(val)
                    if (val && val?.length > 400) {
                      setFiltersData((prev) => ({
                        ...prev,
                        start_date: moment().add(-7, "d").format("YYYY-MM-DD"),
                        end_date: moment().add(1, "d").format("YYYY-MM-DD"),
                        tabValue: val,
                      }))
                    } else {
                      setFiltersData((prev) => ({
                        ...prev,
                        start_date: moment().add(-1, "d").format("YYYY-MM-DD"),
                        end_date: moment().add(1, "d").format("YYYY-MM-DD"),
                        tabValue: val,
                      }))
                    }
                  }}
                  variant="scrollable"
                  centered={false}
                >
                  {tabs.map((elm, index) => (
                    <StyledTab
                      key={"tab-" + elm.id}
                      value={elm.id}
                      label={
                        <Draggable
                          key={elm.id + "-draggableId"}
                          draggableId={elm.id + "-draggableId"}
                          index={index}
                        >
                          {(provided, _) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                cursor: "pointer",
                              }}
                            >
                              <TabLabel
                                isActive={elm.id === tabValue}
                                count={defineCount(elm.id, ordersCount)}
                              >
                                {t(elm.label)}
                              </TabLabel>
                            </div>
                          )}
                        </Draggable>
                      }
                    />
                  ))}
                </StyledTabs>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </OrderTable>
  )
}

export default StatusBar
