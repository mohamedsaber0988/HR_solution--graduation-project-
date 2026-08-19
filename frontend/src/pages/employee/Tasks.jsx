import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, PlayCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../api/api';

const EmployeeTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. جلب المهام من الـ API
    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/my-tasks');
            const data = res.data || res;
            const tasksData = Array.isArray(data) ? data : [];

            const formattedTasks = tasksData.map(task => ({
                id: task.task_id,
                title: task.title || "No Title",
                description: task.description || "No description available.",
                status: formatStatus(task.status),
                assignedBy: "Management",
                deadline: task.due_date
                    ? new Date(task.due_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                      })
                    : 'Open',
            }));

            setTasks(formattedTasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            
            await api.patch(`/tasks/${taskId}`, {
                status: newStatus 
            });

            
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId 
                        ? { ...task, status: formatStatus(newStatus) } 
                        : task
                )
            );
        } catch (error) {
            console.error('Error updating task:', error);
            alert(error.response?.data?.message || 'Failed to update task status');
        }
    };

    
    const formatStatus = (status) => {
        const s = (status || '').toLowerCase();
        if (['pending', 'pinding', 'binding'].includes(s)) return 'Pending';
        if (['progress', 'in_progress'].includes(s)) return 'In Progress';
        if (['completed'].includes(s)) return 'Completed';
        return 'Pending';
    };

    
    const filteredTasks = useMemo(() => {
        return tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tasks, searchTerm]);

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {tasks.length} Total Tasks
                </div>
            </header>

            {}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Search tasks..."
                    />
                </div>
                <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {}
            <div className="min-h-[300px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Loading your tasks...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
                                        ${task.status === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-100' : ''}
                                        ${task.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border border-blue-100' : ''}
                                        ${task.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' : ''}
                                    `}
                                    >
                                        {task.status}
                                    </span>
                                    <Clock className="w-4 h-4 text-gray-300" />
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{task.title}</h3>
                                <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">{task.description}</p>

                                <div className="space-y-3 pt-4 border-t border-gray-50 mb-6 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 font-medium">Due Date</span>
                                        <span className="text-gray-900 font-bold">{task.deadline}</span>
                                    </div>
                                </div>

                                {}
                                <button
                                    onClick={() => {
                                        if (task.status === 'Pending') updateTaskStatus(task.id, 'progress');
                                        else if (task.status === 'In Progress') updateTaskStatus(task.id, 'completed');
                                    }}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all
                                        ${task.status === 'Pending' 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95' 
                                            : ''}
                                        ${task.status === 'In Progress' 
                                            ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-lg shadow-green-100' 
                                            : ''}
                                        ${task.status === 'Completed' 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : ''}
                                    `}
                                    disabled={task.status === 'Completed'}
                                >
                                    {task.status === 'Pending' && (
                                        <>
                                            <PlayCircle className="w-4 h-4" />
                                            <span>Start Task</span>
                                        </>
                                    )}
                                    {task.status === 'In Progress' && (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Complete Task</span>
                                        </>
                                    )}
                                    {task.status === 'Completed' && (
                                        <span>Finished</span>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeTasks;