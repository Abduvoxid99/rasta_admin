import React, { useState } from "react"

import Form from "../../../components/Form/Index"
import Card from "../../../components/Card"
import TextArea from "../../../components/Textarea"
import { Input } from "alisa-ui"
import { useTranslation } from "react-i18next"
import Filters from "../../../components/Filters"
import { StyledTab, StyledTabs } from "../../../components/StyledTabs"

//icons
import RusFlag from "../../../assets/icons/Ellipse 8.png"
import EngFlag from "../../../assets/icons/Ellipse 9.png"
import FlagUz from "../../../assets/icons/Ellipse 7.png"
import Switch from "../../../components/Switch"
import { useParams } from "react-router"

export default function MainContent({ formik, saveLoading }) {
  const { t } = useTranslation()
  const { id } = useParams()
  const { values, setFieldValue } = formik
  const [selectedTab, setSelectedTab] = useState("ru")

  const tabLabel = (text) => {
    return <span className="px-1">{text}</span>
  }

  const onFieldChange = (name, e) => {
    setFieldValue(`${name}.${selectedTab}`, e.target.value)
  }

  return (
    <div className="w-1/2">
      <Card
        title={t("add.new.category")}
        filterStyle={{ padding: 0 }}
        filters={
          <Filters
            className="mb-4"
            style={{
              backgroundColor: "white",
              borderTop: "none",
              marginBottom: "0",
              borderBottom: "none",
            }}
          >
            <StyledTabs
              value={selectedTab}
              onChange={(_, value) => {
                setSelectedTab(value)
                console.log(value)
              }}
              indicatorColor="primary"
              textColor="primary"
              centered={false}
              aria-label="full width tabs example"
              TabIndicatorProps={{ children: <span className="w-2" /> }}
            >
              <StyledTab
                label={
                  <div className="flex items-center">
                    <img className="mr-2" src={RusFlag} width={16} alt="" />
                    {tabLabel(t("russian"))}
                  </div>
                }
                value="ru"
              />
              <StyledTab
                label={
                  <div className="flex items-center">
                    <img className="mr-2" src={EngFlag} width={16} alt="" />
                    {tabLabel(t("english"))}
                  </div>
                }
                value="en"
              />
              <StyledTab
                label={
                  <div className="flex items-center">
                    <img className="mr-2" src={FlagUz} width={16} alt="" />
                    {tabLabel(t("uzbek"))}
                  </div>
                }
                value="uz"
              />
            </StyledTabs>
          </Filters>
        }
      >
        <div className="w-full grid grid-cols-12 gap-8">
          {/* <div className="col-span-2 text-center">
            <Gallery
              width="100%"
              aspectRatio="1"
              gallery={values.image ? [values.image] : []}
              setGallery={(elm) => setFieldValue("image", elm[0])}
              multiple={false}
            />
            <div className="text-primary text-base mt-2 font-semibold">
              {t("Изображение товара")}
            </div>
          </div> */}

          <div className="col-span-12">
            <div className="grid grid-cols-2 gap-x-6">
              <div className="w-full">
                <Form.Item
                  formik={formik}
                  name={`name.${selectedTab}`}
                  label={t(`name.in.${selectedTab}`)}
                >
                  <Input
                    size="large"
                    value={values.name?.[selectedTab]}
                    onChange={(e) => onFieldChange("name", e)}
                  />
                </Form.Item>
              </div>

              {/* <div>
                <Form.Item
                  formik={formik}
                  name="discount_type"
                  label={t("discount.type")}
                >
                  <Select
                    height={40}
                    // id="discount_type"
                    value={values.discount_type}
                    onChange={(val) => setFieldValue("discount_type", val)}
                    options={discountTypes}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  formik={formik}
                  name="discount_value"
                  label={t("discount.value")}
                >
                  <Input
                    size="large"
                    // id="discount_value"
                    value={values.discount_value}
                    onChange={(e) =>
                      e.target.value >= 0 &&
                      setFieldValue("discount_value", e.target.value)
                    }
                    type="number"
                  />
                </Form.Item>
              </div> */}
              <div>
                <Form.Item
                  formik={formik}
                  name="order_no"
                  label={t("priority")}
                >
                  <Input
                    size="large"
                    id="order_no"
                    value={values.order_no}
                    onChange={(e) =>
                      e.target.value >= 0 &&
                      setFieldValue("order_no", e.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                    type="number"
                  />
                </Form.Item>
              </div>
            </div>

            {id && (
              <div className="w-full">
                <Form.Item formik={formik} name="is_active" label="Статус">
                  <Switch
                    id="is_active"
                    color="primary"
                    checked={values.is_active}
                    onChange={(e) => setFieldValue("is_active", e)}
                  />
                </Form.Item>
              </div>
            )}

            <div className="w-full">
              <Form.Item
                formik={formik}
                name="description.uz"
                label={t(`description.in.${selectedTab}`)}
              >
                <TextArea
                  id={`description.${selectedTab}`}
                  value={values.description?.[selectedTab]}
                  onChange={(e) => onFieldChange("description", e)}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
