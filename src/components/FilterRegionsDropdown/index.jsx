import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getRegions } from "../../services/region"
import Select from "../Select"

export default function FilterRegionsDropdown({ filters, setFilters }) {
  const [regions, setRegions] = useState([])
  const { region_ids } = useSelector((state) => state.auth)
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { regions } = await getRegions({ limit: 1000 })
    setRegions(
      regions
        ? regions
            .filter((elm) => region_ids.includes(elm.id))
            .map((item) => ({ label: item.name, value: item.id }))
        : []
    )
  }

  return (
    <>
      <Select
        height={32}
        isMulti
        value={filters.region_ids}
        isSearchable
        onChange={(val) => {
          setFilters((prev) => ({
            ...prev,
            region_ids: val,
          }))
        }}
        value={filters.region_ids}
        placeholder="Выберите регион"
        options={regions}
        menuPortalTarget={document.querySelector("body")}
        menuPlacement="bottom"
      />
    </>
  )
}
