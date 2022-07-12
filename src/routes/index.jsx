import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom"
import authRoutes from "./authRoutes"
import dashboardRoutes from "./dashboard-routes"
import fallbackRoutes from "./fallback-routes"
import FallbackLayout from "../layouts/FallbackLayout"
import DashboardLayout from "../layouts/DashboardLayout"
import { useDispatch, useSelector } from "react-redux"
import Fallback403 from "../views/exceptions/Fallback403.jsx"
import { useEffect } from "react"
import { getUserRolesOnePermissions } from "../services/userRoles"
import { setUserPermissions } from "../redux/actions"

const layouts = [
  {
    component: DashboardLayout,
    path: "/home",
    routes: dashboardRoutes,
    private: true,
  },
  {
    component: FallbackLayout,
    path: "/extra",
    routes: fallbackRoutes,
    private: false,
  },
]

const noAccessComponent = () => (
  <>
    <Fallback403 />
  </>
)

const AppRouter = () => {
  const token = useSelector((state) => state.auth.accessToken)
  const userRoleId = useSelector((state) => state.auth.user_role_id)
  const permissions = useSelector((state) => state.auth.permissions)

  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  useEffect(() => {
    if (userRoleId)
      getUserRolesOnePermissions(userRoleId).then((res) => {
        if (res.permissions && res.permissions.length === 0) {
          history.push("/extra/fallback-403")
        }
        dispatch(setUserPermissions(res.permissions))
      })
  }, [location])

  if (!token)
    return (
      <Switch>
        {authRoutes.map((route) => (
          <Route
            path={route.path}
            exact={route.exact}
            key={route.id}
            render={(routeProps) => (
              <route.layout history={routeProps.history}>
                <route.component {...routeProps} />
              </route.layout>
            )}
          />
        ))}
        <Redirect to="/auth/login" />
      </Switch>
    )

  return (
    permissions && (
      <Switch>
        {layouts.map((layout, index) => (
          <Route
            key={index}
            path={layout.path}
            render={() => (
              <layout.component>
                <Switch>
                  {layout.routes.map((route) => (
                    <Route
                      key={route.id}
                      path={route.path}
                      component={
                        layout.private
                          ? !permissions
                              .map((item) => item.key)
                              .includes(route.permission)
                            ? route.permission === "calls"
                              ? route.component
                              : noAccessComponent
                            : route.component
                          : route.component
                      }
                      exact
                    />
                  ))}
                </Switch>
              </layout.component>
            )}
          />
        ))}

        <Redirect from="/" to="/home/personal/clients" />
        <Redirect from="*" to="/extra/fallback-404" />
      </Switch>
    )
  )
}

export default AppRouter
