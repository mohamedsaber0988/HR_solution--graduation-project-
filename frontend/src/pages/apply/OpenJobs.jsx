import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, Loader2 } from 'lucide-react';
import { api } from '../../api/api';

const ApplyRecruitment = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔥 FETCH FROM API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res = await api.get('/openjobs');

        console.log("Jobs API:", res);

        setJobs(res || []);

      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  
  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          Open Positions
        </h1>
        <p className="text-gray-500 mt-1">
          Find and apply for your next opportunity
        </p>
      </div>

      {}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border shadow-sm">
        <Search size={18} className="text-gray-400" />
        <input
          className="w-full outline-none"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      ) : (
        <>
          {}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No jobs found
            </div>
          ) : (

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {filtered.map(job => (
                <div
                  key={job.vacancy_id}
                  onClick={() => navigate(`/Portal/OpenPosition/${job.vacancy_id}`)}
                  className="group bg-white border rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
                >

                  {}
                  <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform">
                    <Briefcase size={120} />
                  </div>

                  <div className="relative z-10 space-y-3">

                    {}
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
                      Open Position
                    </span>

                    {}
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h2>

                    {}
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {job.description}
                    </p>

                    {}
                    <div className="flex justify-between items-center pt-2 text-xs text-gray-400">
                      <span>ID: {job.vacancy_id}</span>
                      <Briefcase size={16} />
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}
        </>
      )}

    </div>
  );
};

export default ApplyRecruitment;