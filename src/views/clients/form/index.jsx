import Card from "../../../components/Card"
import Form from "../../../components/Form/Index"
import { Input } from "alisa-ui"
import React from "react"
import { useTranslation } from "react-i18next"
import { numberToPrice } from "../../../utils/numberToPrice"
import ClientCreateCard from "../../../components/ClientCard/Create"
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import FunctionsIcon from "@material-ui/icons/Functions"
import Switch from "../../../components/Switch"
import Gallery from "../../../components/Gallery"
import { useParams } from "react-router-dom"

export default function Client({ formik, customerTypeOption, clientInfo }) {
  const { t } = useTranslation()
  const { values, handleChange, setFieldValue } = formik
  const { id } = useParams()
  return (
    <div>
      <ClientCreateCard
        cards={[
          {
            icon: <FunctionsIcon fontSize="large" />,
            count: numberToPrice(clientInfo.totalAmount, "сум"),
            title: t("all.sum.order"),
          },
          {
            icon: <AttachMoneyOutlinedIcon fontSize="large" />,
            count: numberToPrice(Math.round(clientInfo.averageMoney), "сум"),
            title: t("Средний чек"),
          },
          {
            icon: <ShoppingCartIcon fontSize="large" />,
            count: clientInfo.deliveryCount,
            title: t("count.orders"),
          },
          // {
          //   icon: <MoneyOffIcon fontSize="large" />,
          //   count: numberToPrice(23500, "сум"),
          //   title: t("LTV"),
          // },
        ]}
      />

      <Card className="m-4" title={t("client")} style={{ width: "600px" }}>
        {/* <div className="col-span-3 ">
            <div className="w-full h-full flex mt-6 items-center flex-col">
              <Gallery
                rounded
                width={120}
                height={120}
                gallery={values.logo ? [values.logo] : []}
                setGallery={(elm) => console.log(elm)}
                multiple={false}
              />
              <span className="mt-2 text-primary text-base cursor-pointer hover:underline">
                Изменить фото
              </span>
            </div>
          </div> */}

        {id && (
          <div className="w-full flex items-baseline mb-8">
            <div className="w-1/4 input-label">
              <span>{t("photo")}</span>
            </div>
            <div className="w-3/4">
              <Gallery
                multiple={false}
                width={120}
                aspectRatio="1"
                disabled
                gallery={values.image ? [values.image] : []}
                // setGallery={(elm) => {
                //   setFieldValue("image", elm[0])
                // }}
              />
            </div>
          </div>
        )}

        <div className="w-full flex items-baseline ">
          <div className="w-1/4 input-label">
            <span>{t("fullName")}</span>
          </div>
          <div className="w-3/4">
            <div>
              <Form.Item formik={formik} name="name">
                <Input
                  size="large"
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* <div className="w-full flex items-baseline">
              <div className="w-1/4 input-label">
                <span>{t("last.name")}</span>
              </div>
              <div className="w-3/4">
                <div>
                  <Form.Item formik={formik}>
                    <Input
                      size="large"
                      // id="lastname"
                      // value={values.lastname}
                      // onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </div> */}

        <div className="w-full flex items-baseline">
          <div className="w-1/4 input-label">
            <span>{t("phone.number")}</span>
          </div>
          <div className="w-3/4 flex">
            <div className="w-full">
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
            {/* <IconButton icon={<AddIcon />} /> */}
          </div>
        </div>

        {/* <div className="flex w-full items-baseline">
              <div className="w-1/4 input-label">
                <label>{t("client.type")}</label>
              </div>
              <div className="w-3/4">
                <Form.Item formik={formik}>
                  <Select
                    height={40}
                    options={customerTypeOption}
                    onChange={(val) => {
                      console.log(val)
                    }}
                  />
                </Form.Item>
              </div>
            </div> */}
        <div className="flex w-full items-baseline">
          <div className="w-1/4 input-label">
            <label>{t("status")}</label>
          </div>
          <div className="w-3/4">
            <Form.Item formik={formik} name="is_blocked">
              <Switch
                color="primary"
                checked={!values.is_blocked}
                onChange={(val) => {
                  setFieldValue("is_blocked", !val)
                }}
              />
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  )
}
