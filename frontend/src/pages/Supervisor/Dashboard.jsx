import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import {
  Users,
  CalendarDays,
  CheckSquare,
  DollarSign,
  TrendingUp
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const SupervisorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Debug: Initiating Supervisor API call...");
      const res = await api.get('/web-supervisor-dashboard');
      
      
      setData(res);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const stats = data.stats || {};
  const task_chart = data.task_chart || [];
  const leaves = data.recent_leaves || [];
  const team = data.team_members || [];

  const pendingLeaves = stats.pending_leaves ?? 0;
  const teamSize = stats.team_size ?? 0;

  
  const getChartColor = (name) => {
    switch (name) {
      case 'Completed': return '#10B981';
      case 'In Progress': return '#3B82F6';
      case 'Pending': return '#F59E0B';
      default: return '#E5E7EB';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-300">
            <Users size={100} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Team Size</p>
              <p className="text-3xl font-bold">{teamSize}</p>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-300">
            <CalendarDays size={100} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
              <CalendarDays size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase">Pending Leaves</p>
              <p className="text-3xl font-bold">{pendingLeaves}</p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Task Distribution
          </h2>
        </div>
        <div className="h-72 w-full">
          {isClient && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={task_chart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={45}>
                  {task_chart.map((entry, index) => (
                    <Cell key={index} fill={getChartColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {}
      <div className="bg-white/90 border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Leave Requests</h2>
        <div className="space-y-4">
          {leaves.slice(0, 4).map((leave) => (
            <div key={leave.leave_id} className="flex justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">
                  {leave.first_name} {leave.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  {leave.leave_type} • {leave.start_date}
                </p>
              </div>
              <span className="text-xs self-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                {leave.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="bg-white/90 border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Team Attendance</h2>
        <div className="space-y-3">
          {team.map((emp) => (
            <div key={emp.user_id} className="flex justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">
                  {emp.first_name} {emp.last_name}
                </p>
                <p className="text-sm text-gray-500">{emp.job_title}</p>
              </div>
              <span className={`text-xs self-center px-3 py-1 rounded-full font-medium ${
                emp.attendance_status === 'Present' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {emp.attendance_status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SupervisorDashboard;