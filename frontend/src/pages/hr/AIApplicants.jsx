import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api/api';
import AILoading from '../../components/AILoading';

const AIApplicants = () => {
  const { jobId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  
  
  
  const fetchAIResults = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/vacancies/${jobId}/ai-filter`);

      
      const responseData = res?.data?.data || res?.data || res;

      setData(responseData);

    } catch (err) {
      console.error('AI Fetch Error:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIResults();
  }, [jobId]);

  
  
  
  if (loading) {
    return <AILoading />;
  }

  
  
  
  if (!data || !data.candidates || data.candidates.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No AI results available
      </div>
    );
  }

  
  
  
  return (
    <div className="max-w-5xl mx-auto">

      {}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          🤖 AI Ranked Candidates
        </h1>

        <p className="text-gray-500 mt-1">
          Vacancy: <span className="font-medium">{data.vacancy}</span> •
          Total: <span className="font-medium">{data.total_found}</span>
        </p>
      </div>

      {}
      <div className="space-y-4">

        {data.candidates.map((c, index) => (
          <div
            key={c.application_id}
            className="
              bg-white border rounded-xl p-5 shadow-sm
              hover:shadow-md transition-all
            "
          >

            <div className="flex items-center justify-between">

              {}
              <div>
                <p className="font-semibold text-gray-900">
                  #{index + 1} • Application {c.application_id}
                </p>

                <p className="text-sm text-gray-500">
                  Applied: {c.applied_at}
                </p>
              </div>

              {}
              <div
                className={`
                  px-4 py-2 rounded-xl font-bold text-black
                  ${
                    c.ai_score >= 80
                      ? 'bg-green-300'
                      : c.ai_score >= 50
                      ? 'bg-yellow-300'
                      : 'bg-red-300'
                  }
                  shadow-md
                `}
              >
                AI Score: {c.ai_score}
              </div>

            </div>

            {}
            <div className="mt-3">
              <a
                href={c.cv_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View CV
              </a>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default AIApplicants;