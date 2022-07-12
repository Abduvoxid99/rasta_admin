import { useEffect } from "react"
import { HashRouter } from "react-router-dom"
import "./App.scss"
import AppRouter from "./routes/index.jsx"
import { store, persistor } from "./redux/store"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { ThemeProvider } from "styled-components"
import theme from "./theme"
import { connectSocket } from "./socket/socketInit"

export default function App() {
  useEffect(() => {
    document.addEventListener("wheel", () => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur()
      }
    })
  }, [])

  useEffect(() => {
    console.log("Socket connected ............")
    let ws = connectSocket()
    // setInterval(() => {
    //   ws.send("ping")
    // }, 60000)
    return () => ws.close()
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <HashRouter>
            <AppRouter />
          </HashRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
