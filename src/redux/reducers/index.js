import storage from "redux-persist/lib/storage"
import { persistReducer } from "redux-persist"
import { combineReducers } from "redux"

import authReducer from "./authReducer"
import basicReducer from "./basicReducer"
import alertReducer from "./alertReducer"
import systemReducer from "./systemReducer"
import orderReducer from "./orderReducer"
import langReducer from "./langReducer"

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["permissions"],
}

const langPersistConfig = {
  key: "lang",
  storage,
}

const rootReducer = combineReducers({
  alert: alertReducer,
  basics: basicReducer,
  order: orderReducer,
  system: systemReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  lang: persistReducer(langPersistConfig, langReducer),
})

export default rootReducer
