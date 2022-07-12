import React from "react"
import { useTranslation } from "react-i18next"

//components
import Card from "../../../../components/Card"
import Form from "../../../../components/Form/Index"
import TextArea from "../../../../components/Textarea"
import Select from "../../../../components/Select"
import { Input } from "alisa-ui"
import { isNumber } from "../../../../utils/inputHelpers"

export default function BottomContent({
  formik,
  regionsOptions,
  menuOptions,
  faresOptions,
}) {
  const { values, handleChange, setFieldValue } = formik
  const { t } = useTranslation()

  return (
    <div className="col-span-6">
      <Card title={t("settings")}>
        <div>
          <Form.Item
            formik={formik}
            name="max_delivery_time"
            label={t("Макс.время доставки")}
          >
            <Input
              size="large"
              id="max_delivery_time"
              type="number"
              suffix="мин"
              onKeyPress={isNumber}
              value={values.max_delivery_time}
              onChange={handleChange}
              onKeyDown={(event) => {
                if (event.keyCode === 38 || event.keyCode === 40) {
                  event.preventDefault()
                }
              }}
            />
          </Form.Item>
        </div>
        {/* <div>
            <Form.Item
              formik={formik}
              name="courier_accept_radius"
              label={t("Радиус в котором курьер может принять заказ")}
            >
              <Input
                size="large"
                id="courier_accept_radius"
                suffix="км"
                type="number"
                value={values.courier_accept_radius}
                onChange={handleChange}
              />
            </Form.Item>
          </div> */}

        <div className="flex w-full">
          {/* <div className="w-1/6">
            <label htmlFor="description" className="input-label">
              {t("description")}
            </label>
          </div> */}
          <div className="w-full">
            <Form.Item
              formik={formik}
              name="description"
              label={t("description")}
            >
              <TextArea
                id="description"
                value={values.description}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>

        {/* <div className="flex w-full items-baseline">
          <div className="w-1/6">
            <label htmlFor="order" className="input-label">
              {t("limit.order")}
            </label>
          </div>
          <div className="w-5/6">
            <Form.Item formik={formik}>
              <Input size="large" id="order" suffix="Шт" type="number" />
            </Form.Item>
          </div>
        </div> */}

        {/* <div className="flex w-full items-baseline">
          <div className="w-1/6">
            <label htmlFor="menu_list" className="input-label">
              {t("menu_list")}
            </label>
          </div>
          <div className="w-5/6">
            <Form.Item formik={formik}>
              <Select
                height={40}
                id="menu_list"
                options={menuOptions}
                onChange={(val) => console.log(val)}
              />
            </Form.Item>
          </div>
        </div> */}

        <div className="flex w-full items-baseline">
          {/* <div className="w-1/6">
            <label htmlFor="region_ids" className="input-label">
              {t("cities")}
            </label>
          </div> */}
          <div className="w-full">
            <Form.Item formik={formik} name="region_ids" label={t("cities")}>
              <Select
                height={40}
                id="region_ids"
                isMulti
                value={
                  regionsOptions && regionsOptions.length
                    ? regionsOptions.filter((item) =>
                        values.region_ids.includes(item.value)
                      )
                    : []
                }
                onChange={(val) => {
                  setFieldValue(
                    "region_ids",
                    val && val.length ? val.map((item) => item.value) : []
                  )
                }}
                options={regionsOptions}
              />
            </Form.Item>
          </div>
        </div>

        {/* <div className="flex w-full items-baseline">
          <div className="w-1/6">
            <label htmlFor="fares" className="input-label">
              {t("fares")}
            </label>
          </div>
          <div className="w-5/6">
            <Form.Item formik={formik}>
              <Select
                height={40}
                id="fares"
                options={faresOptions}
                onChange={(val) => console.log(val)}
              />
            </Form.Item>
          </div>
        </div> */}
      </Card>
    </div>
  )
}
