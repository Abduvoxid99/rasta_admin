import { errorHandler } from "../utils/axios"
import { store } from "../redux/store"
import { setStatusId } from "../redux/actions/orderAction"

function connectSocket() {
  const token = store.getState().auth.accessToken
  const ws = new WebSocket(`wss://websocket.rasta.app/ws?token=${token}`)

  ws.onopen = function () {
    console.log("Connected to the websocket")
    ws.send("we have been connected to the web-socket :)")
  }

  ws.onmessage = function (mes) {
    try {
      if (mes.data.includes("tab_status_id")) {
        const data = JSON.parse(mes.data)
        if (data.tab_status_id) {
          store.dispatch(setStatusId(data.tab_status_id))
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  ws.onclose = function (e) {
    console.log(`Socket is closed.`)

    connectSocket()
  }

  ws.onerror = function (err) {
    console.error("Socket encountered error: ", err.message, "Closing socket")
    ws.close()
    errorHandler({ response: { status: 403 } })
  }
  return ws
}

export { connectSocket }
