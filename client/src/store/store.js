import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cityReducer from '../features/auth/citySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    city: cityReducer,
  },
})

export default store
