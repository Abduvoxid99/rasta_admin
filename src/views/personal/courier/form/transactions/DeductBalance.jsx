import { useMemo } from "react"
import Form from "../../../../../components/Form/Index"
import Modal from "../../../../../components/Modal"
import Button from "../../../../../components/Button"
import * as yup from "yup"
import { Input } from "alisa-ui"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import CloseIcon from "@material-ui/icons/Close"
import { isNumber } from "../../../../../utils/inputHelpers"

export default function DeductBalance({
  open,
  onClose,
  onSubmit,
  maxPrice,
  ...props
}) {
  const { t } = useTranslation()

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      amount: yup
        .number()
        .required(t("required.field.error"))
        .min(0, `Число должно находиться в интервале (0 - ${maxPrice})`)
        .max(maxPrice, `Число должно находиться в интервале (0 - ${maxPrice})`),
    })
  }, [maxPrice])

  const formik = useFormik({
    initialValues: {
      amount: null,
    },
    onSubmit: (values) => {
      onSubmit(values)
    },
    validationSchema,
  })

  const handleClose = () => {
    onClose()
    formik.resetForm()
  }

  const { values, handleChange } = formik

  return (
    <Modal
      title={null}
      footer={null}
      open={open}
      onClose={handleClose}
      {...props}
      style={{ padding: "0" }}
      header={
        <div className="flex justify-between items-center px-4 py-3 text-md font-medium border-b mb-4">
          Введите сумму для вывода
          <span className="cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </span>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="px-4 pt-0">
          <div>
            <Form.Item formik={formik} name="amount" label={t("sum")}>
              <Input
                size="large"
                type="number"
                value={values.amount}
                onChange={handleChange}
                onKeyDown={(event) => {
                  if (event.keyCode === 38 || event.keyCode === 40) {
                    event.preventDefault()
                  }
                }}
                id="amount"
                onKeyPress={isNumber}
              />
            </Form.Item>
          </div>
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
            {t("Вывести")}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
