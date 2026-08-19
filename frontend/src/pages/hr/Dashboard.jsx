import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../api/api';
import LoadingScreen from '../../components/ui/LoadingScreen'; 
import { 
  Users, 
  UserCheck, 
  CalendarClock, 
  AlertCircle, 
  TrendingUp, 
  Search,
  ChevronRight,
  RefreshCw
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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

const fetchDashboardData = async () => {
    try {
      

      const response = await api.get('/web-hr-dashboard');
      
      // Axios puts your JSON in response.data
      const backendData = response.data;

      

      // CHANGE: Check if the 'stats' or 'performance_details' exist 
      // instead of checking for a 'status' field that isn't there.
      if (backendData && (backendData.stats || backendData.performance_details)) {
        setData(backendData); // Map the entire backendData to state
        console.log("Debug: Success! Data mapped to state.");
      } else {
        console.error("Debug: Logic failed. Data structure unexpected:", backendData);
        setError("API returned data in an unexpected format.");
      }
    } catch (err) {
      console.error("Debug: Request Error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Loading State
  if (loading) return <LoadingScreen message="Fetching HR Data..." />;

  
  if (error || !data) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen text-center">
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-md">
        <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-red-800">Dashboard Error</h2>
        <p className="text-red-600 text-sm mt-2 mb-6">{error || "No data received from server"}</p>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 mx-auto px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          <RefreshCw size={18} /> Retry Connection
        </button>
      </div>
    </div>
  );

  const chartData = [
    { name: 'Excellent', count: data.performance_distribution.excellent, color: '#10b981' },
    { name: 'Good', count: data.performance_distribution.good, color: '#3b82f6' },
    { name: 'Average', count: data.performance_distribution.average, color: '#f59e0b' },
    { name: 'Needs Imp.', count: data.performance_distribution.needs_improvement, color: '#ef4444' },
  ];

  return (
    <div className="pro-page">
      
      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Employees" 
          value={data.stats.total_employees} 
          icon={<Users className="text-blue-600" />} 
          bgColor="bg-blue-50" 
        />
        <StatCard 
          title="Present Today" 
          value={data.stats.present_today} 
          icon={<UserCheck className="text-emerald-600" />} 
          bgColor="bg-emerald-50" 
        />
        <StatCard 
          title="On Leave" 
          value={data.stats.on_leave_today} 
          icon={<CalendarClock className="text-amber-600" />} 
          bgColor="bg-amber-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 pro-card">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            Performance Distribution
          </h3>
          <div className="w-full h-[300px] flex">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                  {chartData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {}
        <div className="pro-card">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            Supervisor Requests
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
            {data.pending_supervisor_leaves.length > 0 ? (
              data.pending_supervisor_leaves.map((leave) => (
                <div key={leave.leave_id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{leave.first_name} {leave.last_name}</p>
                      <p className="text-xs text-gray-500">{leave.dep_name}</p>
                    </div>
                    <button className="text-blue-600 hover:bg-blue-100 p-1 rounded-lg transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-10 text-sm italic">No pending requests</p>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="pro-table-wrap">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between gap-4">
          <h3 className="font-bold text-gray-800">Employee Performance Details</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="pro-table">
            <thead>
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Task Score</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.performance_details
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase">{user.department_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{width: user.scores.task_performance}} />
                      </div>
                      <span className="text-xs text-gray-600">{user.scores.task_performance}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.stats.present_days} Days
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                    {user.scores.final_score}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getRatingStyles(user.rating)}`}>
                      {user.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bgColor }) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    className="pro-card-interactive flex items-center justify-between"
  >
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
    <div className={`rounded-xl p-3 ${bgColor}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
  </motion.div>
);

const getRatingStyles = (rating) => {
  switch (rating.toLowerCase()) {
    case 'excellent': return 'bg-emerald-100 text-emerald-700';
    case 'good': return 'bg-blue-100 text-blue-700';
    case 'average': return 'bg-amber-100 text-amber-700';
    case 'needs_improvement': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default Dashboard;