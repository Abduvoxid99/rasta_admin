import Form from "../../../components/Form/Index"
import Card from "../../../components/Card"
import { customStyles } from "../../../components/Select"
import Gallery from "../../../components/Gallery"
import TextArea from "../../../components/Textarea"
import { Input } from "alisa-ui"
import { useTranslation } from "react-i18next"
import React, { useState } from "react"
import Filters from "../../../components/Filters"
import { StyledTab, StyledTabs } from "../../../components/StyledTabs"
import RusFlag from "../../../assets/icons/Ellipse 8.png"
import EngFlag from "../../../assets/icons/Ellipse 9.png"
import FlagUz from "../../../assets/icons/Ellipse 7.png"
import { AsyncPaginate } from "react-select-async-paginate"
import { isNumber } from "../../../utils/inputHelpers"

export default function MainContent({
  formik,
  categories,
  loadOptions,
  relatedProducts,
  setRelatedProducts,
  loadOptionsCategory,
}) {
  const { t } = useTranslation()
  const { values, handleChange, setFieldValue } = formik

  const [selectedTab, setSelectedTab] = useState("ru")

  const tabLabel = (text) => {
    return <span className="px-1">{text}</span>
  }

  const onFieldChange = (name, e) => {
    setFieldValue(`${name}.${selectedTab}`, e.target.value)
  }

  return (
    <div className="w-full">
      <Card
        title={t("add.new.product")}
        filterStyle={{ padding: 0 }}
        filters={
          <Filters
            style={{
              backgroundColor: "#fff",
              borderTop: "none",
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
        <div className="w-full grid grid-cols-12 gap-8 mt-4">
          <div className="col-span-2 text-center">
            <Form.Item formik={formik} name="image">
              <Gallery
                width="100%"
                aspectRatio="1"
                gallery={values.image ? [values.image] : []}
                setGallery={(elm) => setFieldValue("image", elm[0])}
                multiple={false}
              />
            </Form.Item>
            <div className="text-primary text-base mt-2 font-semibold">
              {t("Изображение товара")}
            </div>
          </div>
          <div className="col-span-10">
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
            <div className="grid grid-cols-3 gap-x-6">
              <div>
                <Form.Item
                  formik={formik}
                  name="category"
                  label={t("category")}
                >
                  <AsyncPaginate
                    value={{
                      label: values?.category?.label,
                      value: values?.category?.value,
                    }}
                    id="category"
                    loadOptions={loadOptionsCategory}
                    additional={{ page: 1 }}
                    placeholder=""
                    styles={customStyles({ height: "40px" })}
                    onChange={(val) => setFieldValue("category", val)}
                  />
                  {/* <Select
                    height={40}
                    id="category"
                    value={{
                      label: values?.category?.label,
                      value: values?.category?.value,
                    }}
                    onChange={(val) => setFieldValue("category", val)}
                    options={categories}
                    name="category"
                  /> */}
                </Form.Item>
              </div>

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
                    onKeyPress={isNumber}
                    onChange={(e) =>
                      e.target.value >= 0 &&
                      setFieldValue("order_no", e.target.value)
                    }
                    type="number"
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item formik={formik} name="price" label={t("price")}>
                  <Input
                    size="large"
                    id="price"
                    value={values.price}
                    onChange={handleChange}
                    type="number"
                    name="price"
                    onKeyDown={(event) => {
                      if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                      }
                    }}
                    onKeyPress={isNumber}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="col-span-4">
              <Form.Item
                formik={formik}
                name="related_products"
                label={t("Похожие продукты")}
              >
                <AsyncPaginate
                  value={relatedProducts}
                  loadOptions={loadOptions}
                  additional={{ page: 1 }}
                  placeholder=""
                  styles={customStyles({ height: "40px" })}
                  isMulti
                  onChange={(val) => {
                    setRelatedProducts(val)
                  }}
                />
              </Form.Item>
            </div>
            <div className="w-full">
              <Form.Item
                formik={formik}
                name={`description.${selectedTab}`}
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
