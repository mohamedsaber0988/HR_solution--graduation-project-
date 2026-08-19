import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminAttendanceSettings() {

  const API = "http://127.0.0.1:8000/api";

  const [settings, setSettings] = useState({
    baseLatitude: '',
    baseLongitude: '',
    workStartTime: '',
    workEndTime: '',
    requiredWorkingHours: '',
    allowedRadius: '',
    lateGraceMinutes: ''
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // GET SETTINGS
  // =========================
  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/attendance-settings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = res.data.data;

      setSettings({
        baseLatitude: data.base_latitude || '',
        baseLongitude: data.base_longitude || '',
        workStartTime: data.work_start_time || '',
        workEndTime: data.work_end_time || '',
        requiredWorkingHours: data.required_working_hours || '',
        allowedRadius: data.allowed_radius_meters || '',
        lateGraceMinutes: data.late_grace_minutes || ''
      });

    } catch (err) {
      console.log("GET ERROR:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  // =========================
  // UPDATE SETTINGS
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API}/attendance-settings`, {
        base_latitude: settings.baseLatitude,
        base_longitude: settings.baseLongitude,
        work_start_time: settings.workStartTime,
        work_end_time: settings.workEndTime,
        required_working_hours: settings.requiredWorkingHours,
        allowed_radius_meters: settings.allowedRadius,
        late_grace_minutes: settings.lateGraceMinutes
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert("Saved successfully ✅");

    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data);
      alert("Error saving settings ❌");
    }
  };

  
  
  
  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance Settings</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} className="custom-form">

          <div className="form-grid">

            <div className="form-group">
              <label>Work Start Time</label>
              <input type="time" name="workStartTime" value={settings.workStartTime} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Work End Time</label>
              <input type="time" name="workEndTime" value={settings.workEndTime} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Required Working Hours</label>
              <input type="number" name="requiredWorkingHours" value={settings.requiredWorkingHours} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Late Grace Minutes</label>
              <input type="number" name="lateGraceMinutes" value={settings.lateGraceMinutes} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Base Latitude</label>
              <input type="text" name="baseLatitude" value={settings.baseLatitude} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Base Longitude</label>
              <input type="text" name="baseLongitude" value={settings.baseLongitude} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Allowed Radius (meters)</label>
              <input type="number" name="allowedRadius" value={settings.allowedRadius} onChange={handleInputChange} required />
            </div>

          </div>

          <div className="modal-actions" style={{ borderTop: 'none', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminAttendanceSettings;