import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Calendar, FileText, List, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
        {children}
    </div>
);

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const [statusData, setStatusData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTodayStatus = async () => {
            try {
                // الربط مع الـ API الخاص بحالة اليوم
                const data = await api.get('/attendance/today-status');
                if (data) {
                    setStatusData(data);
                }
            } catch (error) {
                console.error("Failed to fetch status data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodayStatus();
    }, []);

    if (isLoading) {
        return <div className="text-center mt-20 text-gray-500 font-medium">Loading status...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Home</h1>

            <div className="space-y-6">
                
                {}
                <Card>
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">Today's Status</h2>
                    </div>
                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between">
                        {statusData && statusData.status !== 'not_checked_in' ? (
                            <>
                                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{statusData.label}</p>
                                        <p className="text-sm text-green-600 font-medium capitalize">
                                            {statusData.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-8">
                                    <div className="flex flex-col">
                                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                            <Clock className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium">Check-in</span>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">{statusData.check_in}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                            <Clock className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm font-medium">Check-out</span>
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">{statusData.check_out}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3 text-gray-500 py-4">
                                <AlertCircle className="w-8 h-8 text-orange-400" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 text-lg">Not Checked In Yet</span>
                                    <span className="text-sm">Please record your attendance to start your session.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <button 
                        onClick={() => navigate('/employee/leaves')}
                        className="flex flex-col items-center justify-center p-8 bg-blue-50 hover:bg-blue-100 transition-all rounded-2xl group shadow-sm"
                    >
                        <div className="w-14 h-14 bg-white text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                            <Calendar className="w-7 h-7" />
                        </div>
                        <span className="font-bold text-blue-900">Request Leave</span>
                    </button>

                    <button 
                        onClick={() => navigate('/employee/payslips')}
                        className="flex flex-col items-center justify-center p-8 bg-indigo-50 hover:bg-indigo-100 transition-all rounded-2xl group shadow-sm"
                    >
                        <div className="w-14 h-14 bg-white text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                            <FileText className="w-7 h-7" />
                        </div>
                        <span className="font-bold text-indigo-900">View Payslips</span>
                    </button>

                    <button 
                        onClick={() => navigate('/employee/tasks')}
                        className="flex flex-col items-center justify-center p-8 bg-emerald-50 hover:bg-emerald-100 transition-all rounded-2xl group shadow-sm"
                    >
                        <div className="w-14 h-14 bg-white text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                            <List className="w-7 h-7" />
                        </div>
                        <span className="font-bold text-emerald-900">My Tasks</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EmployeeDashboard;