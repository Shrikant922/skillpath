import api from './api'

// authService — handles registration, login, logout API calls
const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
}

export default authService
