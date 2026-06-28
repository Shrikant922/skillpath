import api from './api'

// roadmapService — handles all roadmap API calls
const roadmapService = {
  getAll:   ()          => api.get('/roadmaps'),
  getById:  (id)        => api.get(`/roadmaps/${id}`),
  generate: (data)      => api.post('/roadmaps', data),
  remove:   (id)        => api.delete(`/roadmaps/${id}`),
  getMilestones: (id)   => api.get(`/milestones/roadmap/${id}`),
  completeMilestone:   (id) => api.put(`/milestones/${id}/complete`),
  uncompleteMilestone: (id) => api.put(`/milestones/${id}/uncomplete`),
}

export default roadmapService
