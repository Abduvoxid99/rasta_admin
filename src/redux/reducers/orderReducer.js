import { SET_STATUS_ID } from "../constants"

const INITIAL_STATE = {
  status_id: null,
}

export default function orderReducer(state = INITIAL_STATE, { payload, type }) {
  switch (type) {
    case SET_STATUS_ID:
      return {
        ...state,
        status_id: payload,
      }
    default:
      return state
  }
}
