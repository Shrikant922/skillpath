import api from './api'

// progressService — handles progress log API calls
const progressService = {
  getAll:         ()   => api.get('/progress'),
  getByRoadmap:   (id) => api.get(`/progress/roadmap/${id}`),
  log:            (data) => api.post('/progress', data),
}

export default progressService
