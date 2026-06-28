import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Sparkles, Loader2 } from 'lucide-react';

const GenerateRoadmapPage = () => {
  const [targetRole, setTargetRole] = useState('');
  const [skillLevel, setSkillLevel] = useState('BEGINNER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/roadmap/generate', { targetRole, skillLevel });
      navigate(`/roadmap/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate roadmap. The AI might be busy.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="text-indigo-400 w-8 h-8" />
            AI Roadmap Generator
          </h1>
          <p className="text-slate-400 mt-2">Tell us what you want to learn, and we'll craft an 8-week plan just for you.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Role / Skill</label>
            <input
              type="text"
              required
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Java Backend Developer, Data Scientist, React Master"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Skill Level</label>
            <select
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              disabled={loading}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating with AI...
              </>
            ) : (
              'Generate Roadmap'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateRoadmapPage;
