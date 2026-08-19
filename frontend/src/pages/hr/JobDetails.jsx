import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { api } from '../../api/api';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/vacancy/${jobId}`);

      
      setJob(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!job) {
    return <div className="p-8 text-center text-red-500">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">

      {}
      <button
        onClick={() => navigate('/hr/recruitment')}
        className="mb-6 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="pro-card">

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {job.title}
        </h1>

        <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs bg-green-50 text-green-600">
          Open
        </span>

        <p className="text-gray-600 mb-6">
          {job.description}
        </p>

        <div className="text-sm text-gray-500 mb-6">
          Job ID: {job.vacancy_id}
        </div>

        <button
          onClick={() => navigate(`/hr/recruitment/${job.vacancy_id}/applicants`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <Users size={16} />
          View Applicants
        </button>

      </div>
    </div>
  );
};

export default JobDetails;