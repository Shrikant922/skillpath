import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Trophy, Target, ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/progress/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading Dashboard...</div>;
  if (!stats) return <div className="text-red-500 text-center mt-20">Error loading data.</div>;

  const chartData = stats.roadmapProgress.map((rm) => ({
    name: rm.targetRole,
    completion: rm.completionPercentage
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
          <p className="text-slate-400 mt-1">Track your learning progress and streaks.</p>
        </div>
        <Link to="/generate" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center">
          New Roadmap <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Current Streak" value={`${stats.currentStreak} Days`} icon={Flame} colorClass="bg-orange-500" />
        <StatCard title="Longest Streak" value={`${stats.longestStreak} Days`} icon={Trophy} colorClass="bg-yellow-500" />
        <StatCard title="Total Milestones" value={stats.totalMilestonesCompleted} icon={Target} colorClass="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Completion by Roadmap</h2>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip
                    cursor={{ fill: '#334155' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.completion === 100 ? '#22c55e' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-400">No roadmaps generated yet.</p>
          )}
        </div>

        {/* Roadmap List Section */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">Your Roadmaps</h2>
          {stats.roadmapProgress.length > 0 ? (
            <div className="space-y-4">
              {stats.roadmapProgress.map((rm) => (
                <Link key={rm.roadmapId} to={`/roadmap/${rm.roadmapId}`} className="block bg-slate-700 hover:bg-slate-600 rounded-lg p-4 transition">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-white">{rm.targetRole}</h3>
                    <span className="text-sm text-indigo-400">{Math.round(rm.completionPercentage)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${rm.completionPercentage}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{rm.completedMilestones} of {rm.totalMilestones} Milestones</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">You haven't started any roadmaps yet.</p>
              <Link to="/generate" className="text-indigo-400 hover:text-indigo-300 font-medium">Create your first roadmap →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
