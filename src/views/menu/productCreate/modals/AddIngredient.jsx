import React, { useState } from "react"
import Form from "../../../../components/Form/Index"
import Modal from "../../../../components/Modal"
import Button from "../../../../components/Button"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import { StyledTab, StyledTabs } from "../../../../components/StyledTabs"
import RusFlag from "../../../../assets/icons/Ellipse 8.png"
import EngFlag from "../../../../assets/icons/Ellipse 9.png"
import FlagUz from "../../../../assets/icons/Ellipse 7.png"
import Filters from "../../../../components/Filters"
import CloseIcon from "@material-ui/icons/Close"
import Select from "../../../../components/Select"

export default function AddIngredientModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  ingredients,
  ...props
}) {
  const { t } = useTranslation()

  const [selectedTab, setSelectedTab] = useState("ru")

  const tabLabel = (text) => {
    return <span className="px-1">{text}</span>
  }

  // useEffect(() => {
  //   if (initialValues) {
  //     formik.setValues({
  //       ingredients: initialValues.ingredients.map((item) => ({
  //         label: item.name[selectedTab],
  //         value: item.id,
  //         name: item.name,
  //         price: item.price,
  //       })),
  //     })
  //   }
  // }, [initialValues])

  const formik = useFormik({
    initialValues: {
      ingredients: [],
    },
    validationSchema: yup.object().shape({
      ingredients: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit: (values) => {
      onSubmit(values)
      handleClose()
    },
  })

  const handleClose = () => {
    onClose()
    formik.resetForm()
  }

  const { setFieldValue } = formik

  return (
    <Modal
      title={null}
      footer={null}
      open={open}
      onClose={handleClose}
      {...props}
      style={{ padding: "0" }}
      header={
        <div className="flex justify-between items-center px-4 py-3 text-md font-medium">
          Добавить опцию
          <span className="cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </span>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        {/* <Filters className="mb-4" style={{ backgroundColor: "white" }}>
          <StyledTabs
            value={selectedTab}
            onChange={(_, value) => {
              setSelectedTab(value)
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
        </Filters> */}
        <div className="px-4 pt-2">
          <div>
            {/* <FieldArray
              name="ingredients"
              validateOnChange={false}
              render={() => (
                <>
                  {values?.ingredients?.map((item, index) => ( */}
            <>
              <span className="input-label block mb-1">Ингридиенты</span>
              <div className="flex">
                <div className="w-full">
                  <Form.Item name="ingredients" formik={formik}>
                    <Select
                      height={40}
                      id="ingredients"
                      value={formik.values.ingredients}
                      onChange={(e) => setFieldValue("ingredients", e)}
                      isMulti
                      menuPosition="fixed"
                      options={ingredients.map((item) => ({
                        label: item.name.ru,
                        value: item.id,
                        name: item.name,
                        price: item.price,
                      }))}
                      name="ingredients"
                    />
                  </Form.Item>
                </div>
                {/* {formik.values.ingredients.length > 1 && (
                  <div className="ml-2">
                    <IconButton
                      style={{ height: "40px", width: "40px" }}
                      color="red"
                      icon={<DeleteIcon />}
                      onClick={() => {
                        const newArrays = formik.values.ingredients.filter(
                          (_, number) => number !== index
                        )
                        formik.setFieldValue("ingredients", newArrays)
                      }}
                    />
                  </div>
                )} */}
              </div>
            </>
            {/* ))}
                </>
              )} */}
          </div>
          {/* <div className="">
            <IconButton
              icon={
                <span className="flex items-center">
                  <AddIcon fontSize="small" />
                  <span className="text-sm block ml-2 font-medium">
                    {t("Добавить ингридиент")}
                  </span>
                </span>
              }
              onClick={() => {
                formik.setFieldValue("ingredients", [
                  ...formik.values.ingredients,
                  {
                    label: "",
                    value: "",
                  },
                ])
              }}
              color="blue"
              style={{
                width: "100%",
                height: "100%",
                border: "1px dashed #0E73F6",
              }}
              className="w-full mb-3 h-9"
            />
          </div> */}
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 border-t">
          <Button
            classNameParent="w-full"
            size="medium"
            shape="outlined"
            style={{ width: "100%" }}
            onClick={handleClose}
            borderColor="bordercolor"
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            classNameParent="w-full"
            size="medium"
            style={{ width: "100%" }}
          >
            {t("save")}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
