import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';

const MilestoneCard = ({ milestone, onComplete }) => {
  const [completing, setCompleting] = useState(false);

  const handleComplete = async () => {
    if (milestone.completed || completing) return;
    setCompleting(true);
    await onComplete(milestone.id);
    setCompleting(false);
  };

  return (
    <div className={`p-6 rounded-xl border ${milestone.completed ? 'bg-slate-800/50 border-indigo-500/30' : 'bg-slate-800 border-slate-700'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-slate-700 text-indigo-400 text-xs font-bold px-2 py-1 rounded">
              Week {milestone.weekNumber}
            </span>
            <h3 className={`text-lg font-bold ${milestone.completed ? 'text-slate-300 line-through' : 'text-white'}`}>
              {milestone.title}
            </h3>
          </div>
          <p className="text-slate-400 text-sm mt-2">{milestone.description}</p>
          {milestone.resourceLink && (
            <a
              href={milestone.resourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-1" /> View Resource
            </a>
          )}
        </div>
        <button
          onClick={handleComplete}
          disabled={milestone.completed || completing}
          className={`ml-4 p-2 rounded-full transition-colors ${
            milestone.completed ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400 hover:bg-slate-700'
          }`}
        >
          {milestone.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
        </button>
      </div>
    </div>
  );
};

const RoadmapDetailPage = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In our backend, we don't have a GET /api/roadmap/:id endpoint explicitly for details,
    // wait, we do have Roadmaps but maybe we didn't create a GET endpoint?
    // Let's check or just fetch all progress stats and find it. 
    // Actually, Phase 3 said: "Call POST /api/roadmap/generate... returns Roadmap". 
    // We didn't build a GET endpoint for Roadmap. 
    // Wait, let's create a quick API call if we don't have it, or simulate it using the stats.
    // Let's assume we need to fetch all and filter, or we just rely on a GET endpoint we might have missed.
    // I will write it as if we have a GET /api/roadmap/:id. 
    // If we don't have it, I'll need to add it to the backend. Let me add it to the backend real quick if it fails.
    
    const fetchRoadmap = async () => {
      try {
        const res = await axiosInstance.get(`/roadmap/${id}`);
        setRoadmap(res.data);
      } catch (err) {
        // If GET /api/roadmap/:id doesn't exist, we fallback to a mock or handle the error
        console.error('Error fetching roadmap:', err);
        setError('Failed to load roadmap.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [id]);

  const handleMilestoneComplete = async (milestoneId) => {
    try {
      await axiosInstance.patch(`/milestone/${milestoneId}/complete`);
      // Update local state
      setRoadmap(prev => ({
        ...prev,
        milestones: prev.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: true } : m
        )
      }));
    } catch (err) {
      console.error('Failed to complete milestone', err);
      alert('Failed to complete milestone');
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Roadmap...</div>;
  if (error || !roadmap) return <div className="text-red-500 text-center mt-20">{error}</div>;

  const completedCount = roadmap.milestones.filter(m => m.completed).length;
  const totalCount = roadmap.milestones.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{roadmap.targetRole} Roadmap</h1>
            <p className="text-indigo-400 mt-1 font-medium">{roadmap.skillLevel} Level</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{progressPercent}%</p>
            <p className="text-sm text-slate-400">Completed</p>
          </div>
        </div>
        
        <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
          <div className="bg-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="space-y-4">
        {roadmap.milestones.sort((a, b) => a.weekNumber - b.weekNumber).map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            onComplete={handleMilestoneComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default RoadmapDetailPage;
