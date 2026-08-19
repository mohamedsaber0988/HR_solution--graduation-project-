import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Hash, Briefcase, MapPin } from 'lucide-react';
import { api } from '../../api/api';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-20 text-gray-500">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-20 text-gray-500">No profile data available.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {}
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Employee Profile</h1>

      {}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-12 text-center relative rounded-2xl shadow-md border border-gray-100">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 border-4 border-white/20">
            <span className="text-4xl font-bold text-blue-600">
              {profile?.name ? profile.name.trim().charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{profile.name || 'User'}</h2>
          <span className="inline-block bg-blue-700/50 text-blue-50 text-sm font-semibold px-4 py-1 rounded-full border border-blue-400/30">
            {profile.role || 'Employee'}
          </span>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 p-8 space-y-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Personal Information</h3>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {}
          <div className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" /> Full Name
          </div>
          <div className="md:col-span-2 text-gray-900 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-100">
            {profile.name || '---'}
          </div>

          {}
          <div className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400" /> Job Title
          </div>
          <div className="md:col-span-2 text-gray-900 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-100">
            {profile.job_title || '---'}
          </div>

          {}
          <div className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400" /> Employee ID
          </div>
          <div className="md:col-span-2 text-gray-900 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-100">
            {profile.id || '---'}
          </div>

          {}
          <div className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" /> Department
          </div>
          <div className="md:col-span-2 text-gray-900 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-100">
            {profile.department || '---'}
          </div>

          {}
          <div className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" /> Email
          </div>
          <div className="md:col-span-2 text-gray-900 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-100">
            {profile.email || '---'}
          </div>

          {}
          <div className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" /> Phone
          </div>
          <div className="md:col-span-2 text-gray-900 font-semibold bg-gray-50 p-3 rounded-lg border border-gray-100">
            {profile.phone || '---'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;