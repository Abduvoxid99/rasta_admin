import { useSelector } from "react-redux"

export default function usePermissions(value) {
  const permissions = useSelector((state) => state.auth.permissions)
  const onePermission = permissions?.find((item) => item.key === value)
  if (
    onePermission &&
    onePermission.actions &&
    onePermission.actions.length > 0
  ) {
    const actions = {}
    onePermission.actions.forEach((val) => {
      actions[val.key] = val.key
    })
    return actions
  }
  return {}
}
