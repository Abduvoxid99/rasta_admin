import Card from "../../../../components/Card"
import Form from "../../../../components/Form/Index"
import { Input } from "alisa-ui"
import Select from "../../../../components/Select"
import Switch from "../../../../components/Switch"
import React from "react"
import { useTranslation } from "react-i18next"
import { isNumber } from "../../../../utils/inputHelpers"
import Gallery from "../../../../components/Gallery"
import TextArea from "../../../../components/Textarea"

export default function CreateCourier({ formik, regions, courierTypes }) {
  const { t } = useTranslation()
  const { values, handleChange, setFieldValue } = formik

  return (
    <Card title={t("general.information")} className="col-span-6">
      <div className="flex items-center">
        <span className="w-1/4 input-label">{t("img")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="image">
            <Gallery
              multiple={false}
              width={120}
              aspectRatio="1"
              gallery={values.image ? [values.image] : []}
              setGallery={(elm) => {
                setFieldValue("image", elm[0])
              }}
            />
          </Form.Item>
        </div>
      </div>

      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("first.name")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="first_name">
            <Input
              size="large"
              id="first_name"
              value={values.first_name}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("last.name")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="last_name">
            <Input
              size="large"
              id="last_name"
              value={values.last_name}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("description")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="description">
            <TextArea
              id="description"
              value={values.description}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("phone.number")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="phone">
            <Input
              size="large"
              prefix="+998"
              id="phone"
              type="number"
              value={values.phone}
              onChange={(e) => {
                setFieldValue("phone", String(e.target.value))
              }}
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("plastic.card")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik}>
            <Input disabled size="large" id="" type="number" />
          </Form.Item>
        </div>
      </div>

      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("courier.type")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="courier_type">
            <Select
              height={40}
              id="courier_type"
              options={courierTypes}
              value={values.courier_type}
              onChange={(val) => setFieldValue("courier_type", val)}
            />
          </Form.Item>
        </div>
      </div>

      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("regions")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="region">
            <Select
              height={40}
              id="region"
              options={regions}
              value={values.region}
              onChange={(val) => setFieldValue("region", val)}
            />
          </Form.Item>
        </div>
      </div>

      <div className="flex">
        <span className="w-1/4 input-label">{t("max.orders.count")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="max_orders_count">
            <Input
              size="large"
              id="max_orders_count"
              type="number"
              value={values.max_orders_count}
              onChange={handleChange}
              onKeyPress={isNumber}
              onKeyDown={(event) => {
                if (event.keyCode === 38 || event.keyCode === 40) {
                  event.preventDefault()
                }
              }}
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex item-baseline">
        <div className="w-1/4 input-label">
          <span className="mr-4">{t("status")}</span>
        </div>
        <div className="w-3/4">
          <Form.Item formik={formik} name="is_active">
            <Switch
              checked={values.is_active}
              onChange={(val) => setFieldValue("is_active", val)}
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  )
}
