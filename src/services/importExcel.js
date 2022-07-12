import { showAlert } from "../redux/reducers/alertReducer"
import request from "../utils/axios"
import { store } from "../redux/store"

export const importExcelShippers = (event) => {
  const file = event.target.files[0]
  const data = new FormData()
  data.append("file", file)
  request({
    method: "post",
    url: "/excel-import/shippers",
    data,
    headers: {
      "Content-Type": "mulpipart/form-data",
    },
  }).then(() => {
    store.dispatch(showAlert("Успешно!!!!", "success"))
  })
}
