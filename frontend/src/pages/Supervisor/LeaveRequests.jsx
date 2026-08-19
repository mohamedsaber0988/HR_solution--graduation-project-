import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Loader2, Calendar, User, FileText, Info, ClipboardList } from 'lucide-react';
import { api } from '../../api/api'; 
import CustomSelect from '../data/CustomSelect';

const leaveTypeLabel = { 
    annual: 'Annual', sick: 'Sick', casual: 'Casual', emergency: 'Emergency' 
};

const SupervisorLeaveRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get('/supervisor/leave-requests');
            const fetchedData = response.data.data || response.data || [];
            setRequests(fetchedData);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            if (status === 'approved') {
                await api.put(`/leave/${id}/approve`);
            }

            if (status === 'rejected') {
                await api.put(`/leave/${id}/reject`);
            }

            setRequests(prev =>
                prev.map(req =>
                    req.id === id ? { ...req, status } : req
                )
            );

            if (selectedRequest?.id === id) {
                setSelectedRequest(prev => ({ ...prev, status }));
            }

        } catch (err) {
            console.error(err);
            alert('Action failed');
        }
    };

    const truncateText = (text, limit = 20) => {
        if (!text) return '---';
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved':  return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected':  return 'bg-red-100 text-red-700 border-red-200';
            default:          return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getLeaveTypeBadge = (type) => {
        const colors = {
            annual: 'bg-blue-50 text-blue-600',
            sick: 'bg-red-50 text-red-600',
            casual: 'bg-purple-50 text-purple-600',
            emergency: 'bg-orange-50 text-orange-600',
        };
        return colors[type] || 'bg-gray-50 text-gray-600';
    };

    /* ── Skeleton ── */
    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {[...Array(7)].map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                </td>
            ))}
        </tr>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Leaves Control</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Review and manage leave requests from your team</p>
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                {loading ? (
                    <table className="min-w-full text-left font-sans">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Start Date</th>
                                <th className="px-6 py-4">End Date</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
                        </tbody>
                    </table>
                ) : requests.length === 0 ? (
                    <div className="p-16 text-center">
                        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No leave requests found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left font-sans">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Start Date</th>
                                    <th className="px-6 py-4">End Date</th>
                                    <th className="px-6 py-4">Reason</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {requests.map(req => (
                                    <tr key={req.id} className="hover:bg-blue-50/30 transition-colors">

                                        {/* Employee */}
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{req.first_name} {req.last_name}</p>
                                            <p className="text-xs text-blue-500 font-medium">{req.dep_name}</p>
                                        </td>

                                        {/* Type */}
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getLeaveTypeBadge(req.leave_type)}`}>
                                                {leaveTypeLabel[req.leave_type] || req.leave_type}
                                            </span>
                                        </td>

                                        {/* Start Date */}
                                        <td className="px-6 py-4 text-sm text-gray-600">{req.start_date}</td>

                                        {/* End Date */}
                                        <td className="px-6 py-4 text-sm text-gray-600">{req.end_date}</td>

                                        {/* Reason */}
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-[180px] truncate">
                                            {truncateText(req.reason)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusStyle(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* View */}
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {/* Approve/Reject */}
                                                {req.status === 'pending' ? (
                                                    <div className="flex gap-1.5">
                                                        <button
                                                            onClick={() => handleAction(req.id, 'approved')}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors"
                                                        >
                                                            <Check size={14} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req.id, 'rejected')}
                                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={14} /> Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="min-w-[120px]">
                                                        <CustomSelect
                                                            value={req.status}
                                                            onChange={(val) => handleAction(req.id, val)}
                                                            options={[
                                                                { value: 'approved', label: 'Approved' },
                                                                { value: 'rejected', label: 'Rejected' },
                                                                { value: 'pending', label: 'Pending' },
                                                            ]}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Modal ── */}
            {selectedRequest && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setSelectedRequest(null)}
                >
                    <div 
                        className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Leave Request</h2>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Employee Info */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                                {selectedRequest.first_name[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{selectedRequest.first_name} {selectedRequest.last_name}</p>
                                <p className="text-xs text-gray-500">{selectedRequest.dep_name}</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <Calendar size={16} className="text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Date</p>
                                    <p className="text-sm text-gray-700 font-medium">{selectedRequest.start_date} → {selectedRequest.end_date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <Info size={16} className="text-gray-400 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Type</p>
                                    <p className="text-sm text-gray-700 font-medium">{leaveTypeLabel[selectedRequest.leave_type]}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <FileText size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Reason</p>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                        {selectedRequest.reason || "No reason provided."}
                                    </p>
                                </div>
                            </div>

                            {selectedRequest.sick_pdf && (
                                <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Eye size={16} className="text-gray-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Medical Report</p>
                                            <p className="text-sm text-gray-700">Attachment attached</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={`http://127.0.0.1:8000/${selectedRequest.sick_pdf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        View File
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className="mt-5 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${getStatusStyle(selectedRequest.status)}`}>
                                {selectedRequest.status}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisorLeaveRequests;