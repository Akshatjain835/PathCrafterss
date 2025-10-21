import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send cookies
})

export const register = (payload) => api.post('/auth/register', payload)
export const login = (payload) => api.post('/auth/login', payload)
export const logout = () => api.post('/auth/logout')
export const me = () => api.get('/auth/me')

export default api
