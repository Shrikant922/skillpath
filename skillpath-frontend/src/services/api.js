import axios from 'axios'

// Base Axios instance — all API calls go through here
const api = axios.create({
  baseURL: '/api',         // proxied to http://localhost:8080/api via Vite
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
