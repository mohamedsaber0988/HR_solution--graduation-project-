import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { api } from '../../api/api';

const Attendance = () => {
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState({ present_days: 0, absent_days: 0, leave_days: 0, late_days: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('current');

    useEffect(() => {
        const fetchAttendance = async () => {
            setIsLoading(true);
            try {
                
                
                const endpoint = activeTab === 'current' 
                    ? '/current-attendance-history' 
                    : '/attendance-history'; 

                const data = await api.get(endpoint);
                
                setRecords(data.records || []);
                setSummary(data.summary || { present_days: 0, absent_days: 0, leave_days: 0, late_days: 0 });
            } catch (error) {
                console.error("Failed to fetch attendance:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendance();
    }, [activeTab]); 

    const formatTime = (time) => time ? time.substring(0, 5) : '--:--';
    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '--';

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance</h1>
                </div>

                {}
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-1 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Present ({summary.present_days})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-1 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-600">Late ({summary.late_days || 0})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-1 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">Absent ({summary.absent_days})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-1 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-600">Leave ({summary.leave_days})</span>
                    </div>
                </div>
            </div>

            {}
            <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-xl w-fit border border-gray-300 shadow-sm">
                <button
                    onClick={() => setActiveTab('current')}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                        activeTab === 'current' 
                        ? 'bg-white text-blue-600 shadow-sm scale-[1.02]' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Current Month
                </button>
                <button
                    onClick={() => setActiveTab('previous')}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                        activeTab === 'previous' 
                        ? 'bg-white text-blue-600 shadow-sm scale-[1.02]' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Previous Month
                </button>
            </div>

            {}
            <div className="bg-white shadow-md rounded-xl overflow-hidden min-h-[200px] border border-gray-100">
                {isLoading ? (
                    <div className="p-16 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Fetching records...</p>
                    </div>
                ) : records.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 font-medium">No records found for this period.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left font-sans">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                    <th className="px-6 py-4">Day</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Check In</th>
                                    <th className="px-6 py-4">Check Out</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {records.map((rec, idx) => {
                                    const inTime = formatTime(rec.in_time);
                                    const outTime = formatTime(rec.out_time);
                                    
                                    const duration = (rec.in_time && rec.out_time)
                                        ? `${Math.floor((new Date(`2000-01-01T${outTime}`) - new Date(`2000-01-01T${inTime}`)) / 3600000)}h ${Math.floor(((new Date(`2000-01-01T${outTime}`) - new Date(`2000-01-01T${inTime}`)) % 3600000) / 60000)}m`
                                        : '--';
                                    
                                    const status = capitalize(rec.status);

                                    return (
                                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-700">{rec.day.substring(0, 3)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(rec.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{inTime}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{outTime}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{duration}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border
                                                    ${status === 'Present' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                                                    ${status === 'Late' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''}
                                                    ${status === 'Absent' ? 'bg-red-100 text-red-700 border-red-200' : ''}
                                                    ${status === 'Leave' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;