import React, { useEffect, useState } from 'react';
import { Plus, Briefcase, Search, X, ChevronRight, Filter, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';

const Recruitment = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newJob, setNewJob] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await api.get('/vacancies');
      setJobs(res.data || []);
      setFilteredJobs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    const filtered = jobs.filter((job) =>
      job.title?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [search, jobs]);

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.description) return;
    try {
      await api.post('/create-vacancy', newJob);
      fetchJobs();
      setNewJob({ title: '', description: '' });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Create job failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recruitment</h1>
          <p className="text-slate-500 font-medium">Post and manage job vacancies within the organization</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Plus size={20} />
          Post New Position
        </button>
      </div>

      {/* --- Stats Quick View (Only Total Vacancies) --- */}
      <div className="flex">
        <div className="bg-white p-6 pr-12 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <Briefcase size={26}/>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Vacancies</p>
            <p className="text-3xl font-black text-slate-800">{jobs.length}</p>
          </div>
        </div>
      </div>

      {/* --- Filters & Search --- */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by job title, keywords..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 text-slate-700 placeholder:text-slate-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* --- Jobs Table --- */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center gap-3">
             <Loader2 className="animate-spin text-indigo-600" size={40} />
             <p className="text-slate-500 font-medium italic">Syncing positions...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="text-slate-200" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No positions found</h3>
            <p className="text-slate-400">Try adjusting your filters or post a new vacancy.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Position Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Post Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredJobs.map((job) => (
                  <tr
                    key={job.vacancy_id}
                    className="group hover:bg-indigo-50/40 transition-all cursor-pointer"
                    onClick={() => navigate(`/hr/recruitment/${job.vacancy_id}`)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                          {job.title}
                        </span>
                        <span className="text-sm text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                          {job.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Open
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                       {job.created_at ? new Date(job.created_at).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="inline-flex p-2 text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-xl transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">Post New Vacancy</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  className="w-full border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Description</label>
                <textarea
                  placeholder="Describe the requirements..."
                  rows={4}
                  className="w-full border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 flex gap-3 justify-end border-t border-slate-100">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreateJob} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
                Create Vacancy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;