import {
  SET_AUTH_CREDENTIALS,
  SET_AUTH_TOKENS,
  CLEAR_ON_SIGNOUT,
  IS_LOADING,
  SET_USER_VERIFIED,
  SET_PERMISSIONS,
} from "../constants"

const INITIAL_STATE = {
  phoneNumber: "",
  accessToken: "",
  refreshToken: "",
  isLoading: false,
  permissions: null,
  login: "",
  region_ids: [],
  verified: true,
  statusPerission: false,
  nextStagePermission: false,
  shipper_user_id: null,
}

export default function authReducer(state = INITIAL_STATE, { payload, type }) {
  switch (type) {
    case IS_LOADING:
      return {
        ...state,
        isLoading: payload,
      }
    case SET_AUTH_CREDENTIALS:
      return {
        ...state,
        phoneNumber: payload,
      }
    case SET_AUTH_TOKENS:
      return {
        ...state,
        ...payload,
      }
    case SET_PERMISSIONS:
      return {
        ...state,
        permissions: payload,
      }
    case SET_USER_VERIFIED:
      return {
        ...state,
        verified: payload ?? false,
      }

    case CLEAR_ON_SIGNOUT:
      return INITIAL_STATE
    default:
      return state
  }
}
