import { useState, useEffect } from 'react'
import roadmapService from '../services/roadmapService'

export function useRoadmap(id = null) {
  const [roadmaps, setRoadmaps] = useState([])
  const [currentRoadmap, setCurrentRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: fetch roadmaps logic
    setLoading(false)
  }, [id])

  return { roadmaps, currentRoadmap, loading }
}
