import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { api } from '../../api/api';

const SupervisorAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/alerts');
      const rawData = res.data || res; 

      if (Array.isArray(rawData)) {
        const formattedAlerts = rawData.map(alert => ({
          id: alert.alert_id,
          type: alert.alert_type, 
          title: alert.alert_type.replace('_', ' ').toUpperCase(), 
          message: alert.content, 
          time: formatTime(alert.created_at)
        }));
        setAlerts(formattedAlerts);
      }
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="text-amber-500" size={24} />;
      case 'critical': return <AlertTriangle className="text-red-500" size={24} />;
      case 'success': return <CheckCircle className="text-emerald-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  const getBg = (type) => {
    switch(type) {
      case 'warning': return 'bg-amber-50/30 border-amber-100';
      case 'critical': return 'bg-red-50/30 border-red-100';
      case 'success': return 'bg-emerald-50/30 border-emerald-100';
      default: return 'bg-blue-50/30 border-blue-100';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
      
      {}
      <div className="border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <Bell size={24} />
            </div>
            System Alerts Log
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2 ml-14">A complete history of all system notifications and activities.</p>
      </div>

      {}
      <div className="space-y-4">
        {loading ? (
            <div className="flex flex-col items-center py-32 text-slate-400">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="text-xs font-black uppercase tracking-widest">Loading History...</p>
            </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Bell className="text-slate-200" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No History Found</h3>
            <p className="text-slate-400 text-sm">There are no alerts recorded in the system yet.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`p-6 rounded-[1.5rem] border transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 flex items-start gap-5 ${getBg(alert.type)}`}>
              <div className="shrink-0 p-2 bg-white rounded-xl shadow-sm">
                {getIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-extrabold text-slate-800 text-lg">
                    {alert.title}
                  </h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full border border-white/20 text-[10px] font-black text-slate-400 uppercase">
                    <Clock size={12} />
                    {alert.time}
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {alert.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupervisorAlerts;