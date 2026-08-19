import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Clock, Loader2, FileText, AlertCircle } from 'lucide-react';
import { api } from '../../api/api';

const JobDetailsApply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cv, setCv] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  
  
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await api.get(`/public-vacancy/${jobId}`);
        setJob(res.data || res); 
      } catch (err) {
        console.error("Fetch Job Error:", err);
        setError("Could not load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  
  
  
const handleApply = async () => {
    if (!cv) {
      alert("Please upload your CV (PDF only)");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("vacancy_id", jobId); 
      formData.append("cv", cv);

      
      const res = await api.post("/apply", formData);

      console.log("APPLY SUCCESS:", res);
      alert("Applied successfully!");
      navigate('/Portal/OpenPosition');

    } catch (err) {
      
      console.error("Validation Errors:", err.errors);
      
      if (err.errors) {
        const messages = Object.values(err.errors).flat().join("\n");
        alert("Validation Error:\n" + messages);
      } else {
        alert(err.message || "Failed to submit application");
      }
    } finally {
      setUploading(false);
    }
};

  
  
  
  if (loading) {
    return (
      <div className="p-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Job Details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-20 text-center space-y-4">
        <AlertCircle className="mx-auto text-rose-500" size={48} />
        <h2 className="text-xl font-bold text-slate-800">{error || "Job not found"}</h2>
        <button onClick={() => navigate('/Portal/OpenPosition')} className="text-indigo-600 font-bold underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      
      {}
      <button
        onClick={() => navigate('/Portal/OpenPosition')}
        className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Open Vacancies
      </button>

      {}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
        
        {}
        <div className="absolute -right-12 -bottom-12 opacity-[0.03] pointer-events-none">
          <Briefcase size={250} />
        </div>

        <div className="relative z-10 space-y-8">
          
          {}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                    Active Listing
                </span>
                <span className="text-slate-300 text-xs font-medium">ID: #{job.vacancy_id}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight">
                {job.title}
            </h1>
            <div className="flex flex-wrap gap-5 text-slate-500 font-bold text-sm">
                <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-indigo-500" /> {job.location || 'Remote / Office'}
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-indigo-500" /> {job.type || 'Full Time'}
                </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" />
                Job Description
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
                {job.description}
            </p>
          </div>

          {}
          <div className="bg-slate-50 rounded-3xl p-8 border-2 border-dashed border-slate-200 space-y-4">
            <div className="space-y-1">
                <h3 className="font-black text-slate-800">Submit Your Application</h3>
                <p className="text-xs text-slate-400 font-medium">Please upload your CV in PDF format (Max 2MB)</p>
            </div>

            <div className="relative">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCv(e.target.files[0])}
                    className="block w-full text-sm text-slate-500 
                    file:mr-4 file:py-3 file:px-6 
                    file:rounded-2xl file:border-0 
                    file:text-sm file:font-black
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-700 file:cursor-pointer file:transition-colors
                    bg-white rounded-2xl border border-slate-100 p-2 shadow-sm"
                />
            </div>

            {cv && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 w-fit px-3 py-1.5 rounded-xl border border-emerald-100">
                    <CheckCircle size={14} />
                    <span className="text-xs font-bold">{cv.name}</span>
                </div>
            )}
          </div>

          {}
          <button
            onClick={handleApply}
            disabled={uploading}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2
              ${uploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              "Submit Application"
            )}
          </button>

        </div>
      </div>
    </div>
  );
};


const CheckCircle = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default JobDetailsApply;