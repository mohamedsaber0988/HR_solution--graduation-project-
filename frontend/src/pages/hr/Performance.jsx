import React, { useEffect, useState } from 'react';
import { Star, Loader2, RefreshCcw, Search, Filter } from 'lucide-react';
import axios from 'axios';

const Performance = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); 
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPerformance();
    }, []);

    // منطق البحث
    useEffect(() => {
        const filtered = data.filter((item) =>
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.department_name?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredData(filtered);
    }, [search, data]);

    const fetchPerformance = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token'); 
            const res = await axios.get('http://127.0.0.1:8000/api/performance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data.data);
            setFilteredData(res.data.data);
        } catch (error) {
            console.error("Fetch Error:", error);
            setError("Failed to load performance data.");
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (part, total) => {
        if (!total || total === 0) return 0;
        return Math.round((part / total) * 100);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500 space-y-6">
            
            {}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Performance Analytics</h1>
                    <p className="text-slate-500 font-medium">Real-time efficiency metrics and team rankings.</p>
                </div>
                <button 
                    onClick={fetchPerformance}
                    className="flex items-center justify-center gap-2 text-sm font-bold bg-white text-slate-600 border border-slate-200 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                >
                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* --- Search & Filters --- */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search employee or department..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 text-slate-700 placeholder:text-slate-400 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors">
                    <Filter size={20} />
                </button>
            </div>

            {}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                {error && (
                    <div className="p-4 bg-rose-50 text-rose-600 text-center text-sm font-bold border-b border-rose-100">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                        <Loader2 className="animate-spin mb-4" size={48} />
                        <p className="font-bold tracking-widest uppercase text-[10px]">Syncing Analytics...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-slate-200" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">No results found</h3>
                        <p className="text-slate-400">We couldn't find any matches for "{search}"</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Team Member</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Tasks</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Attendance</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Total Score</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredData.map((item) => {
                                    const taskTotal = item.stats.completed_tasks + item.stats.overdue_tasks;
                                    const taskPercentage = calculatePercentage(item.stats.completed_tasks, taskTotal);
                                    
                                    return (
                                        <tr key={item.user_id} className="hover:bg-indigo-50/30 transition-all group cursor-default">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium tracking-tight">
                                                        {item.department_name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-5 text-center">
                                                <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-black text-xs border border-blue-100">
                                                    {taskPercentage}%
                                                </div>
                                            </td>

                                            <td className="px-8 py-5 text-center text-sm font-black text-emerald-600">
                                                {item.scores.attendance_performance}
                                            </td>

                                            <td className="px-8 py-5 text-center text-sm font-bold">
                                                <span className={
                                                    parseFloat(item.scores.final_score) >= 80 ? 'text-emerald-600' :
                                                    parseFloat(item.scores.final_score) >= 60 ? 'text-amber-500' :
                                                    parseFloat(item.scores.final_score) >= 50 ? 'text-rose-500' :
                                                    'text-rose-700 font-black'
                                                }>
                                                    {item.scores.final_score}%
                                                </span>
                                            </td>

                                            <td className="px-8 py-5 text-right">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border
                                                    ${
                                                        item.rating === 'Excellent' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                        item.rating === 'Good' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                                                        item.rating === 'Average' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                        'bg-rose-100 text-rose-700 border-rose-200'
                                                    }`}>
                                                    {item.rating}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Performance;