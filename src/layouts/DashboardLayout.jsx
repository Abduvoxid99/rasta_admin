// import { useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
import ChangePasswordAlert from "../components/Alert/ChangePasswordAlert.jsx"
import AlertComponent from "../components/Alert/index.jsx"
import GlobalAlert from "../components/GlobalAlert/index.jsx"
// import Layout from "../components/Layout/index.jsx"
import Sidebar from "../components/Sidebar/index.jsx"
// import { fetchAnnouncement } from "../redux/reducers/alertReducer.js"
// import Sidebar from "../components/Sidebar2/index.jsx"
import "./style.scss"

export default function DashboardLayout({ children }) {
  // const dispatch = useDispatch()
  // const globalAlertHeight = useSelector(
  //   (state) => state.alert.globalAlertHeight
  // )

  // useEffect(() => {
  //   dispatch(fetchAnnouncement())
  // }, [])

  return (
    <>
      <AlertComponent />
      <ChangePasswordAlert />

      <div className="DashboardLayout">
        <Sidebar />
        <div
          className="content-wrapper bg-background"
        >
          <GlobalAlert />
          <div style={{position: 'relative'}} >{children}</div>
        </div>
      </div>

      {/* <div >
        <GlobalAlert />
        <Layout sidebar={<Sidebar globalAlertHeight={globalAlertHeight} />} globalAlertHeight={globalAlertHeight} >{children}</Layout>
      </div> */}
    </>
  )
}
