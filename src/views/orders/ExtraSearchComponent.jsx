import Button from "../../components/Button"
import Select, { customStyles } from "../../components/Select"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { AsyncPaginate } from "react-select-async-paginate"
import { couriersLoadOptions, customersloadOptions } from "../../services"
import { Input } from "alisa-ui"
import { paymentList } from "../../constants/paymentTypes"
import FilterRegionsDropdown from "../../components/FilterRegionsDropdown"
const ExtraSearchFilterComponent = ({ setFilters, filters }) => {
  const [searchState, setSearchState] = useState()

  const { t } = useTranslation()

  const searchHandler = () => {}

  const getPhoneList = () => {}

  const getOrderIdList = () => {}

  const getCourieList = () => {}

  return (
    <div className="grid grid-cols-4 bg-background_2 w-full space-x-2 flex-row row-auto px-5 py-3 items-center">
      {/* <div>
        <AsyncPaginate
          value={filters.customer_id}
          loadOptions={customersloadOptions}
          placeholder="Номер телефона"
          styles={customStyles({ height: "32px" })}
          additional={{ page: 1 }}
          isClearable
          onChange={(val) => {
            setFilters((prev) => ({
              ...prev,
              customer_id: val,
            }))
          }}
        />
      </div>
      <div>
        <Input
          placeholder="Заказ ID"
          type="number"
          onChange={(event) => {
            setFilters((prev) => ({
              ...prev,
              external_order_id: event.target.value,
            }))
          }}
        />
      </div> */}

      {/* <FilterRegionsDropdown setFilters={setFilters} filters={filters} /> */}
      {/* <AsyncPaginate
          value={filters.courier_id}
          loadOptions={couriersLoadOptions}
          placeholder="Курьер"
          styles={customStyles({ height: "32px" })}
          additional={{ page: 1 }}
          isClearable
          onChange={(val) => {
            setFilters((prev) => ({
              ...prev,
              courier_id: val,
            }))
          }}
        /> */}

      <div>
        <Select
          placeholder="Тип оплаты"
          options={paymentList}
          isClearable
          onChange={(val) => {
            setFilters((prev) => ({
              ...prev,
              payment_type: val,
            }))
          }}
          value={filters.payment_type}
        />
      </div>
      {/* <div>
        <Button size="small">{t("search")}</Button>
      </div> */}
    </div>
  )
}

export default ExtraSearchFilterComponent
