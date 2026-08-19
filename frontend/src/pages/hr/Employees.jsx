import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, X, Mail, Phone, Briefcase, Shield } from 'lucide-react';
import { api } from '../../api/api';

const AddEmployeeModal = ({ isOpen, onClose, onSuccess, departments }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        department_id: '',
        job_title: '',
        phone: '',
        role: 'employee'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await api.post('/admin/employees', formData);
            onSuccess();
            onClose();
            setFormData({
                first_name: '', last_name: '', email: '', password: '',
                department_id: '', job_title: '', phone: '', role: 'employee'
            });
        } catch (err) {
            setError(err.message || 'Failed to create employee');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {error && (
                        <div className="col-span-full p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center font-medium">
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">First Name</label>
                        <input 
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.first_name}
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Last Name</label>
                        <input 
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.last_name}
                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 font-flex items-center gap-2">
                           <Mail size={14}/> Email
                        </label>
                        <input 
                            type="email"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <input 
                            type="password"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Department</label>
                        <select 
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.department_id}
                            onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                                <option key={d.dep_id} value={d.dep_id}>{d.dep_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 font-flex items-center gap-2">
                            <Briefcase size={14}/> Job Title
                        </label>
                        <input 
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.job_title}
                            onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 font-flex items-center gap-2">
                            <Phone size={14}/> Phone
                        </label>
                        <input 
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 font-flex items-center gap-2">
                            <Shield size={14}/> Role
                        </label>
                        <select 
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            required
                        >
                            <option value="employee">Employee</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <div className="col-span-full pt-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-xl text-white font-bold transition-all
                                ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'}`}
                        >
                            {isSubmitting ? 'Creating Employee...' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [empData, depData] = await Promise.all([
                api.get('/admin/employees'),
                api.get('/departments')
            ]);
            setEmployees(empData);
            setDepartments(depData);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredEmployees = employees.filter(e => {
        const fullName = `${e.first_name || ''} ${e.last_name || ''}`.toLowerCase();
        const email = (e.email || '').toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    });


    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Employees</h1>
                    <p className="text-gray-500 mt-1">Manage your team members and their information.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Add Employee
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search employees..." 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500">Loading employees...</div>
                    ) : filteredEmployees.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="text-gray-400" size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                            <p className="text-sm">Try adjusting your search or add a new employee.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Employee</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Department</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp) => (
                                    <tr key={emp.user_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {(emp.first_name?.charAt(0) || '')}{(emp.last_name?.charAt(0) || '')}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{emp.first_name || 'No'} {emp.last_name || 'Name'}</div>
                                                    <div className="text-xs text-gray-500">{emp.email || 'No Email'}</div>
                                                </div>

                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                                {emp.department?.dep_name || 'N/A'}
                                            </span>
                                            <div className="text-[10px] text-gray-400 mt-1">{emp.job_title}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                                ${emp.role === 'admin' ? 'bg-purple-50 text-purple-600' : 
                                                  emp.role === 'supervisor' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}
                                            `}>
                                                {emp.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                                            <button className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <AddEmployeeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchData}
                departments={departments}
            />
        </div>
    );
};

export default Employees;
