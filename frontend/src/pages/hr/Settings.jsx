import React, { useState, useRef } from 'react';
import {
    User, Bell, Clock, Sliders, Shield, HelpCircle,
    Camera, Mail, Lock, AlertCircle, MessageSquare, Bug
} from 'lucide-react';

const Toggle = ({ enabled, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
        <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

const Section = ({ id, title, icon: Icon, children }) => (
    <div id={id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6 scroll-mt-24">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center">
            {Icon && <Icon className="text-gray-400 mr-3" size={20} />}
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const Settings = ({ userProfilePicture, setUserProfilePicture }) => {
    const [notifications, setNotifications] = useState({
        email: true,
        reminders: false,
        alerts: true,
        announcements: true
    });

    const [qrEnabled, setQrEnabled] = useState(true);
    const [loginAlerts, setLoginAlerts] = useState(false);
    const fileInputRef = useRef(null);

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            if (setUserProfilePicture) {
                setUserProfilePicture(imageUrl);
            }
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
                </div>
            </div>

            {}
            <Section id="account-settings" title="Account Settings" icon={User}>
                <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full bg-gray-200 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                            {userProfilePicture ? (
                                <img src={userProfilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-gray-400" size={32} />
                            )}
                        </div>
                        <button
                            onClick={triggerFileInput}
                            className="absolute bottom-0 right-0 h-8 w-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm cursor-pointer"
                        >
                            <Camera size={14} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">Profile Picture</h3>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <input type="text" placeholder='Full Name' className="pl-10 w-full rounded-lg border border-gray-300 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <input type="email" placeholder='example@gmail.com' className="pl-10 w-full rounded-lg border border-gray-300 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button className="flex items-center text-sm font-medium text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <Lock size={16} className="mr-2 text-gray-500" />
                        Change Password
                    </button>
                </div>
            </Section>

            {}
            <Section id="notification-settings" title="Notification Settings" icon={Bell}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block text-sm font-medium text-gray-900">Email Notifications</span>
                            <span className="block text-sm text-gray-500 mt-1">Receive daily summary emails.</span>
                        </div>
                        <Toggle enabled={notifications.email} onChange={() => toggleNotification('email')} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block text-sm font-medium text-gray-900">Task Reminders</span>
                            <span className="block text-sm text-gray-500 mt-1">Get notified about upcoming task deadlines.</span>
                        </div>
                        <Toggle enabled={notifications.reminders} onChange={() => toggleNotification('reminders')} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block text-sm font-medium text-gray-900">Attendance Alerts</span>
                            <span className="block text-sm text-gray-500 mt-1">Alerts for late check-ins and absences.</span>
                        </div>
                        <Toggle enabled={notifications.alerts} onChange={() => toggleNotification('alerts')} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block text-sm font-medium text-gray-900">System Announcements</span>
                            <span className="block text-sm text-gray-500 mt-1">Important updates and maintenance notices.</span>
                        </div>
                        <Toggle enabled={notifications.announcements} onChange={() => toggleNotification('announcements')} />
                    </div>
                </div>
            </Section>

            {}
            <Section title="Attendance Settings" icon={Clock}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Work Start Time</label>
                        <input type="time" defaultValue="09:00" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Work End Time</label>
                        <input type="time" defaultValue="17:00" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Late Threshold (minutes)</label>
                        <input type="number" defaultValue="15" min="0" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="block text-sm font-medium text-gray-900">QR Code Attendance</span>
                        <span className="block text-sm text-gray-500 mt-1">Allow employees to check in using QR codes.</span>
                    </div>
                    <Toggle enabled={qrEnabled} onChange={() => setQrEnabled(!qrEnabled)} />
                </div>
            </Section>

            {}
            <Section title="System Preferences" icon={Sliders}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                        <select className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                        <select className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                            <option>12-hour (AM/PM)</option>
                            <option>24-hour</option>
                        </select>
                    </div>

                </div>
            </Section>

            {}
            <Section title="Security Settings" icon={Shield}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <input type="number" defaultValue="30" min="5" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Password Length</label>
                        <input type="number" defaultValue="12" min="8" className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="block text-sm font-medium text-gray-900 border-gray-100 flex items-center mb-1">
                            <AlertCircle size={14} className="mr-1.5 text-orange-500" />
                            Login Alerts
                        </span>
                        <span className="block text-sm text-gray-500">Get notified of logins from new devices or locations.</span>
                    </div>
                    <Toggle enabled={loginAlerts} onChange={() => setLoginAlerts(!loginAlerts)} />
                </div>
            </Section>

            {}
            <Section title="Help & Support" icon={HelpCircle}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 flex items-center justify-center text-sm font-medium text-blue-700 bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-lg hover:bg-blue-100 transition-colors">
                        <MessageSquare size={16} className="mr-2 text-blue-500" />
                        Contact Support
                    </button>
                    <button className="flex-1 flex items-center justify-center text-sm font-medium text-gray-700 bg-white border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                        <Bug size={16} className="mr-2 text-gray-500" />
                        Report a Bug
                    </button>
                </div>

            </Section>
        </div>
    );
};

export default Settings;
