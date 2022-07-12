import React from "react"
import Modal from "../../../../components/Modal"
import { useTranslation } from "react-i18next"
import CloseIcon from "@material-ui/icons/Close"
import { numberToPrice } from "../../../../utils/numberToPrice"
import Switch from "../../../../components/Switch"
import Button from "../../../../components/Button"

export default function ProductModal({
  open,
  onClose,
  categories,
  products,
  onSubmit,
  switchCategory,
  categoryId,
  setCheckedProducts,
  checkedProducts,
  ...props
}) {
  const { t } = useTranslation()

  const onChange = (id) => {
    const product = checkedProducts.find((item) => item === id)
    if (product) {
      setCheckedProducts((prev) => [...prev.filter((item) => item !== id)])
    } else {
      setCheckedProducts((prev) => [...prev, id])
    }
  }

  const isAll = products
    .map((item) => item.id)
    .every((elem) => checkedProducts.includes(elem))

  return (
    <Modal
      title={null}
      footer={null}
      open={open}
      onClose={onClose}
      {...props}
      style={{ padding: "0" }}
      width={600}
      header={
        <div className="flex justify-between items-center px-4 py-3 text-md font-medium">
          Добавить продукт
          <span className="cursor-pointer" onClick={onClose}>
            <CloseIcon />
          </span>
        </div>
      }
    >
      <div className="px-4 pb-4">
        <div className="flex">
          <div
            onClick={() => switchCategory(null)}
            className={`mr-2 text-sm px-3 cursor-pointer py-1 border rounded-md ${
              !categoryId ? "bg-blue-600 text-white" : ""
            }`}
          >
            Все
          </div>
          {categories.map((item) => (
            <div
              onClick={() => switchCategory(item.id)}
              className={`mr-2 text-sm px-3 cursor-pointer py-1 border rounded-md ${
                item.id === categoryId ? "bg-blue-600 text-white" : ""
              }`}
            >
              {item.name.ru}
            </div>
          ))}
        </div>
        <div
          className="mt-4"
          style={{ maxHeight: "300px", overflow: "auto", marginRight: "-10px" }}
        >
          <div className="pb-2 flex justify-between" key="all-id">
            <span>Все</span>
            <span>
              <Switch
                id="all-id"
                color="primary"
                checked={checkedProducts && isAll}
                onChange={() => {
                  if (products.length > 0)
                    if (isAll) {
                      let unique1 = products
                        .map((item) => item.id)
                        .filter((o) => checkedProducts.indexOf(o) === -1)
                      let unique2 = checkedProducts.filter(
                        (o) => products.map((item) => item.id).indexOf(o) === -1
                      )
                      const unique = unique1.concat(unique2)
                      setCheckedProducts(unique)
                    } else {
                      const set = new Set([
                        ...checkedProducts,
                        ...products.map((item) => item.id),
                      ])
                      setCheckedProducts(Array.from(set))
                    }
                }}
              />
            </span>
          </div>
          {products.map((el) => (
            <div className="pb-2 flex justify-between" key={el.id}>
              <span>
                {el.name.ru} ({numberToPrice(el.price, "сум")})
              </span>
              <span>
                <Switch
                  id={el.id}
                  color="primary"
                  checked={checkedProducts && checkedProducts.includes(el.id)}
                  onChange={() => onChange(el.id)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t p-4">
        <Button
          classNameParent="w-full"
          size="large"
          shape="outlined"
          style={{ width: "100%" }}
          onClick={() => {
            onClose()
          }}
          borderColor="bordercolor"
        >
          {t("cancel")}
        </Button>
        <Button
          classNameParent="w-full"
          size="large"
          style={{ width: "100%" }}
          onClick={onClose}
        >
          {t("save")}
        </Button>
      </div>
    </Modal>
  )
}
