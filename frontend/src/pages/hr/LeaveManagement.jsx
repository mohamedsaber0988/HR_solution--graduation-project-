import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Check, X, Calendar, User, AlertCircle } from 'lucide-react';
import { api } from '../../api/api';

const LeaveManagement = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ pending: 0, approved: 0 });

    
    const transformRequests = (apiResponse) => {
        
        const dataArray = Array.isArray(apiResponse?.data) ? apiResponse.data : [];
        
        return dataArray.map(req => ({
            id: req.id, 
            employeeName: `${req.first_name} ${req.last_name}`, 
            type: req.leave_type || 'General',
            startDate: req.start_date || 'N/A',
            endDate: req.end_date || 'N/A',
            reason: req.reason || 'No reason provided',
            status: req.status?.toLowerCase() || 'pending'
        }));
    };

    
    const fetchRequests = useCallback(async (signal) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/hr/leave-requests', { signal });
            const cleanedData = transformRequests(response); 
            
            setRequests(cleanedData);

            
            const pending = cleanedData.filter(r => r.status === 'pending').length;
            const approved = cleanedData.filter(r => r.status === 'approved').length;
            setStats({ pending, approved });
        } catch (err) {
            if (err.name !== 'CanceledError') {
                setError("Failed to load requests. Please try again.");
                console.error("Fetch error:", err);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchRequests(controller.signal);
        return () => controller.abort();
    }, [fetchRequests]);

    
    const handleAction = async (id, action) => {
        try {
            
            await api.put(`/leave/${id}/${action}`);
            fetchRequests(); 
        } catch (err) {
            alert(`Action failed: ${err.message}`);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-50 text-green-600 border-green-100';
            case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-orange-50 text-orange-600 border-orange-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Leave Management</h1>
                    <p className="text-gray-500 mt-1">Review and approve employee time off requests.</p>
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="pro-card flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                        <div className="text-sm text-gray-500 font-medium">Pending Requests</div>
                    </div>
                </div>
                <div className="pro-card flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <Check size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
                        <div className="text-sm text-gray-500 font-medium">Approved This Month</div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <div className="pro-table-wrap">
                <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <span className="font-bold text-gray-800">Recent Requests</span>
                    <button 
                        onClick={() => fetchRequests()} 
                        className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                        Refresh List
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-20 text-center text-gray-400">
                             <div className="animate-spin mb-4">...</div>
                             <p>Fetching leave history...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="p-20 text-center">
                             <Calendar className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                             <p className="text-gray-500 font-medium">No leave requests found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                    <th className="p-5">Employee</th>
                                    <th className="p-5">Type</th>
                                    <th className="p-5">Duration</th>
                                    <th className="p-5">Reason</th>
                                    <th className="p-5">Status</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {requests.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {r.employeeName.charAt(0)}
                                                </div>
                                                <div className="font-semibold text-gray-900 text-sm">{r.employeeName}</div>
                                            </div>
                                        </td>
                                        <td className="p-5 capitalize text-sm text-gray-600 font-medium">{r.type}</td>
                                        <td className="p-5">
                                            <div className="text-sm text-gray-900 font-medium">{r.startDate}</div>
                                            <div className="text-[11px] text-gray-400">until {r.endDate}</div>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-gray-500 max-w-xs truncate">{r.reason}</p>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusColor(r.status)} capitalize`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            {r.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleAction(r.id, 'approve')}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                                                    >
                                                        <Check size={18} strokeWidth={2.5} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(r.id, 'reject')}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <X size={18} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaveManagement;