import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/api';

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/vacancies/${jobId}/applications`);
      setApplicants(res.data || res);
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">

      {}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-bold">
          Applicants
        </h1>

        {}
        <button
          onClick={() => navigate(`/hr/vacancies/${jobId}/ai-filter`)}
          className="
            px-5 py-2 rounded-xl font-semibold text-black
            bg-gradient-to-r from-lime-300 via-green-300 to-emerald-400
            shadow-[0_0_20px_rgba(57,255,20,0.6)]
            hover:shadow-[0_0_30px_rgba(57,255,20,0.9)]
            hover:scale-105 transition-all duration-200
          "
        >
          🤖 AI Filter CVs
        </button>

      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 text-xs text-gray-500">Application ID</th>
              <th className="p-4 text-xs text-gray-500">Applied At</th>
              <th className="p-4 text-xs text-gray-500">CV</th>
            </tr>
          </thead>

          <tbody>
            {applicants.map((app) => (
              <tr key={app.application_id} className="border-b hover:bg-gray-50">

                <td className="p-4 font-medium text-gray-900">
                  #{app.application_id}
                </td>

                <td className="p-4 text-gray-500">
                  {app.applied_at}
                </td>

                <td className="p-4">
                  <a
                    href={app.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View CV
                  </a>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Applicants;