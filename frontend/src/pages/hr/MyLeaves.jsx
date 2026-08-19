import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import { api } from '../../api/api';


const LeaveRequestModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        reason: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await api.post('/leave-request', formData);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">New Leave Request</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center font-medium">
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Leave Type</label>
                        <select 
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            value={formData.leave_type}
                            onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
                            required
                        >
                            <option value="annual">Vacation</option>
                            <option value="sick">Sick Leave</option>
                            <option value="casual">Casual Leave</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Start Date</label>
                            <input 
                                type="date" 
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.start_date}
                                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">End Date</label>
                            <input 
                                type="date" 
                                min={formData.start_date || new Date().toISOString().split('T')[0]}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.end_date}
                                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Reason</label>
                        <textarea 
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                            placeholder="Why are you taking this leave?"
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95
                            ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const HRMyLeaves = () => {
    const [balances, setBalances] = useState(null);
    const [requestHistory, setRequestHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchLeaves = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/leave-history');

            const history = data.leave_history;
            const remaining = data.leave_balance;

            
            const totals = {
                annual: 21,
                sick: 10,
                casual: 5
            };

            
            setBalances({
                casual: {
                    remaining: remaining.casual,
                    total: totals.casual
                },
                sick: {
                    remaining: remaining.sick,
                    total: totals.sick
                },
                vacation: {
                    remaining: remaining.annual,
                    total: totals.annual
                }
            });

            
            const formattedHistory = history.map((req) => ({
                id: `${req.start_date}-${req.end_date}`,
                type: capitalizeWords(req.leave_type),
                dateRange: `${req.start_date} - ${req.end_date}`,
                days: req.duration,
                status: capitalize(req.status)
            }));

            setRequestHistory(formattedHistory);

        } catch (error) {
            console.error("Failed to fetch leaves:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const capitalizeWords = (s) => s.split('_').map(capitalize).join(' ');

    if (isLoading) {
        return <div className="text-center mt-20 text-gray-500">Loading leave information...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Leaves</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Leave Request</span>
                </button>
            </div>

            <LeaveRequestModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchLeaves} 
            />

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="pro-card">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600 font-medium">Casual Leave</span>
                        <span className="px-2 py-1 bg-gray-100 text-xs font-bold rounded text-gray-700">
                            {balances ? `${balances.casual.remaining} / ${balances.casual.total}` : '-- / --'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: balances ? `${(balances.casual.remaining / balances.casual.total)*100}%` : '0%' }}></div>
                    </div>
                </div>

                <div className="pro-card">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600 font-medium">Sick Leave</span>
                        <span className="px-2 py-1 bg-gray-100 text-xs font-bold rounded text-gray-700">
                            {balances ? `${balances.sick.remaining} / ${balances.sick.total}` : '-- / --'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: balances ? `${(balances.sick.remaining / balances.sick.total)*100}%` : '0%' }}></div>
                    </div>
                </div>

                <div className="pro-card">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600 font-medium">Vacation</span>
                        <span className="px-2 py-1 bg-gray-100 text-xs font-bold rounded text-gray-700">
                            {balances ? `${balances.vacation.remaining} / ${balances.vacation.total}` : '-- / --'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: balances ? `${(balances.vacation.remaining / balances.vacation.total)*100}%` : '0%' }}></div>
                    </div>
                </div>
            </div>

            {}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8 min-h-[200px]">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Request History</h2>
                </div>
                <div className="p-0">
                    {requestHistory.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No leave requests found.</div>
                    ) : (
                        requestHistory.map((req) => (
                            <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-gray-50 border-b last:border-0 border-gray-100 transition-colors">
                                <div className="flex items-center space-x-4 w-full sm:w-auto">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0
                                        ${req.type === 'Sick Leave' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}
                                    `}>
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">{req.type}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{req.dateRange}</p>
                                    </div>
                                </div>

                                <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0 sm:space-x-8 pl-16 sm:pl-0">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-semibold text-gray-900">{req.days}</span> day(s)
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                                        ${req.status === 'Pending' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                                        ${req.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                                        ${req.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' : ''}
                                    `}>
                                        {req.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default HRMyLeaves;
