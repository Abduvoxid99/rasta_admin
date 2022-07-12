import Card from "../../../../../components/Card"
import Form from "../../../../../components/Form/Index"
import { Input } from "alisa-ui"
import Select from "../../../../../components/Select"
import React from "react"
import { useTranslation } from "react-i18next"
import Gallery from "../../../../../components/Gallery"

export default function CreateTransport({ formik, vehicleClasses, colors }) {
  const { t } = useTranslation()

  const { values, setFieldValue } = formik
  console.log(values)
  return (
    <Card title={t("transport")} className="col-span-6">
      {/* <div className="flex items-center">
        <span className="w-1/4 input-label">{t("img")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="courier_vehicle.picture">
            <Gallery
              multiple={false}
              width={120}
              aspectRatio="1"
              gallery={
                values.courier_vehicle && values.courier_vehicle.picture
                  ? [values.courier_vehicle.picture]
                  : []
              }
              setGallery={(elm) => {
                setFieldValue("courier_vehicle.picture", elm[0])
              }}
            />
          </Form.Item>
        </div>
      </div> */}
      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("car.number")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="courier_vehicle.vehicle_number">
            <Input
              size="large"
              id="vehicle_number"
              name="courier_vehicle.vehicle_number"
              value={values?.courier_vehicle?.vehicle_number}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("brand.cars")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="courier_vehicle.car_brand">
            <Input
              size="large"
              id="car_brand"
              name="courier_vehicle.car_brand"
              onChange={formik.handleChange}
              value={values?.courier_vehicle?.car_brand}
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("model")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="courier_vehicle.model">
            <Input
              size="large"
              id="model"
              name="courier_vehicle.model"
              onChange={formik.handleChange}
              value={values?.courier_vehicle?.model}
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("type")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="courier_vehicle.car_class">
            <Select
              height={40}
              name="courier_vehicle.car_class"
              options={vehicleClasses}
              value={values?.courier_vehicle?.car_class}
              onChange={(val) =>
                setFieldValue("courier_vehicle.car_class", val)
              }
            />
          </Form.Item>
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="w-1/4 input-label">{t("color")}</span>
        <div className="w-3/4">
          <Form.Item formik={formik} name="courier_vehicle.car_colour">
            <Select
              height={40}
              name="courier_vehicle.car_colour"
              options={colors}
              value={values?.courier_vehicle?.car_colour}
              onChange={(val) =>
                formik.setFieldValue("courier_vehicle.car_colour", val)
              }
            />
          </Form.Item>
        </div>
      </div>
    </Card>
  )
}
