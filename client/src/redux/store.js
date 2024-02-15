import { configureStore, combineReducers } from '@reduxjs/toolkit'
import  userReducer from './user/userSlice.js'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'

const rootReducer = combineReducers({
  user:userReducer
})

const persistConfig = {
  key:"root",
  version:1,
  storage
}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    { serializableCheck: false } // Immutable data warning in Redux Toolkit
  )
})

export const persistor = persistStore(store);