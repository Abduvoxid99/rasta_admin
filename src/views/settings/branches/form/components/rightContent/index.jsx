import React from "react"
import { useTranslation } from "react-i18next"
//components
import { Input } from "alisa-ui"
import Form from "../../../../../../components/Form/Index"
import Card from "../../../../../../components/Card"
import Select from "../../../../../../components/Select"
import { isNumber } from "../../../../../../utils/inputHelpers"

export default function RightContent({
  formik,
  weekArray,
  faresOptions,
  menuOptions,
  regionsOptions,
  setWeekArray,
  validHours,
}) {
  const { t } = useTranslation()

  const { values, handleChange, setFieldValue } = formik

  const changeWeekArray = (e) => {
    setWeekArray((prev) =>
      prev.map((item) =>
        String(item.id) === e.target.value
          ? {
              ...item,
              isChecked: !item.isChecked,
              startDate: !item.isChecked ? item.startDate : "00:00",
              endDate: !item.isChecked ? item.endDate : "00:00",
            }
          : item
      )
    )
  }

  const changeTime = (e, id) => {
    setWeekArray((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [e.target.name]: e.target.value,
            }
          : item
      )
    )
  }

  return (
    <div className="col-span-5">
      <Card className="mb-4" title={t("schedule")}>
        {/* <div>
          <Form.Item
            formik={formik}
            name="work_hour_start"
            label={t("start.of.working.hours")}
          >
            <Input
              size="large"
              id="work_hour_start"
              type="time"
              value={values.work_hour_start}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            formik={formik}
            name="work_hour_end"
            label={t("end.of.working.hours")}
          >
            <Input
              size="large"
              id="work_hour_end"
              type="time"
              value={values.work_hour_end}
              onChange={handleChange}
            />
          </Form.Item>
        </div> */}

        {weekArray?.map((elm) => (
          <div className="flex w-full items-baseline" key={elm.id}>
            <div className="w-1/5 input-label">{t(elm.title)}</div>
            <div className="w-4/5 flex gap-x-3 items-center">
              <div className="w-2/5">
                <Input
                  disabled={!elm.isChecked}
                  value={elm.startDate}
                  onChange={(e) => changeTime(e, elm.id)}
                  name="startDate"
                  id="startDate"
                  type="time"
                  pattern="([1]?[0-9]|2[0-3]):[0-5][0-9]"
                />
                <div
                  className="min-h-6 w-full"
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.5715,
                    color: "#ff4d4f",
                  }}
                >
                  {validHours && elm.startDate === ""
                    ? t("required.field.error")
                    : ""}
                </div>
              </div>
              <div className="w-2/5">
                <Input
                  disabled={!elm.isChecked}
                  value={elm.endDate}
                  id="endDate"
                  onChange={(e) => changeTime(e, elm.id)}
                  name="endDate"
                  type="time"
                  pattern="([1]?[0-9]|2[0-3]):[0-5][0-9]"
                />
                <div
                  className="min-h-6 w-full"
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.5715,
                    color: "#ff4d4f",
                  }}
                >
                  {validHours && elm.endDate === ""
                    ? t("required.field.error")
                    : ""}
                </div>
              </div>
              <div className="w-1/5 pt-2" style={{ height: "58px" }}>
                <input
                  onChange={changeWeekArray}
                  checked={elm.isChecked}
                  className="h-5 rounded cursor-pointer"
                  value={elm.id}
                  type="checkbox"
                />
              </div>
            </div>
          </div>
        ))}
      </Card>

      <Card title={t("settings.branch")}>
        <div className="flex w-full items-baseline">
          <div className="w-2/5 input-label">
            <label htmlFor="order">{t("limit.order")}</label>
          </div>
          <div className="w-3/5">
            <Form.Item formik={formik} name="orders_limit">
              <Input
                size="large"
                id="orders_limit"
                suffix="Шт"
                type="number"
                name="orders_limit"
                onKeyPress={isNumber}
                value={values.orders_limit}
                onKeyDown={(event) => {
                  if (event.keyCode === 38 || event.keyCode === 40) {
                    event.preventDefault()
                  }
                }}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex w-full items-baseline">
          <div className="w-2/5 input-label">
            <label htmlFor="order">{t("Радиус обслуживания")}</label>
          </div>
          <div className="w-3/5">
            <Form.Item formik={formik} name="order_radius">
              <Input
                size="large"
                id="order_radius"
                suffix="м"
                type="number"
                name="order_radius"
                onKeyPress={isNumber}
                value={values.order_radius}
                onChange={handleChange}
                onKeyDown={(event) => {
                  if (event.keyCode === 38 || event.keyCode === 40) {
                    event.preventDefault()
                  }
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex w-full items-baseline">
          <div className="w-2/5 input-label">
            <label htmlFor="menu_id">{t("menu_list")}</label>
          </div>
          <div className="w-3/5">
            <Form.Item formik={formik} name="menu_id">
              <Select
                height={40}
                id="menu_id"
                options={menuOptions}
                value={menuOptions.find((elm) => elm.value === values.menu_id)}
                onChange={(elm) => setFieldValue("menu_id", elm.value)}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex w-full items-baseline">
          <div className="w-2/5 input-label">
            <label htmlFor="fare_id">{t("fares")}</label>
          </div>
          <div className="w-3/5">
            <Form.Item formik={formik} name="fare">
              <Select
                height={40}
                id="fare"
                options={faresOptions}
                value={values.fare}
                onChange={(val) => setFieldValue("fare", val)}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex w-full items-baseline">
          <div className="w-2/5 input-label">
            <label htmlFor="region">{t("cities")}</label>
          </div>
          <div className="w-3/5">
            <Form.Item formik={formik} name="region">
              <Select
                height={40}
                id="region"
                options={regionsOptions}
                value={values.region}
                onChange={(val) => setFieldValue("region", val)}
              />
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  )
}
