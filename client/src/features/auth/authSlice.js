import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authAPI from './authAPI'

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
}

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await authAPI.register(payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message })
  }
})

export const loginUser = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await authAPI.login(payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message })
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const res = await authAPI.logout()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message })
  }
})

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await authAPI.me()
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message })
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        if (action.payload.token) localStorage.setItem('token', action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        if (action.payload.token) localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle'
        state.user = null
        state.token = null
        localStorage.removeItem('token')
      })

      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload.user || action.payload?.user || action.payload?.user
      })
  },
})

export default authSlice.reducer
