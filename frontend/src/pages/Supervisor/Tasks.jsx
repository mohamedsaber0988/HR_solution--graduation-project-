import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User as UserIcon, Plus, X, Loader2, Calendar, Trash2 } from 'lucide-react';
import { api } from '../../api/api';
import './Pages.css';

const SupervisorTasks = () => {
    const [searchParams] = useSearchParams();
    const assigneeQuery = searchParams.get('assignee');

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAssignOpen, setIsAssignOpen] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        due_date: '',
        assigned_to: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/tasks/supervisor');
            setTasks(Array.isArray(res) ? res : res.data || []);
        } catch (err) {
            console.error(err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    
    const handleUpdateStatus = async (task_id, status) => {
        if (!task_id) return;

        try {
            await api.patch(`/tasks/${task_id}`, { status });

            setTasks(prev =>
                prev.map(t =>
                    t.task_id === task_id ? { ...t, status } : t
                )
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    
    const handleAssign = async () => {
        if (!form.title || !form.assigned_to) return;

        try {
            await api.post('/tasks', form);
            await fetchTasks();

            setForm({
                title: '',
                description: '',
                due_date: '',
                assigned_to: ''
            });

            setIsAssignOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to create task");
        }
    };

    // ✅ DELETE TASK (NEW)
    const handleDelete = async (task_id) => {
        if (!task_id) return;

        try {
            await api.delete(`/tasks/${task_id}`);

            setTasks(prev => prev.filter(t => t.task_id !== task_id));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    const displayedTasks = useMemo(() => {
        if (!assigneeQuery) return tasks;
        return tasks.filter(t => t.assigned_to === Number(assigneeQuery));
    }, [tasks, assigneeQuery]);

    if (loading) {
        return (
            <div className="loader-container">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Task Management</h1>
                <button className="btn-primary" onClick={() => setIsAssignOpen(true)}>
                    <Plus size={18} /> Assign Task
                </button>
            </div>

            {/* TASKS */}
            <div className="tasks-board">
                {displayedTasks.map(task => (
                    <div key={task.task_id} className="task-card">

                        {/* HEADER */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className={`status ${task.status}`}>
                            {task.status}
                            </span>

                            <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                    onClick={() => handleDelete(task.task_id)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} color="red" />
                                </button>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <UserIcon size={14} />
                                <span>
                                {task.first_name} {task.last_name}
                                </span>
                                </div>

                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                ID: {task.assigned_to}
                                </span>
                                </div>
                                </div>
                              </div>

                        {}
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>

                        {}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Calendar size={14} />
                                {task.due_date}
                            </div>

                            <select
                                value={task.status}
                                onChange={(e) => handleUpdateStatus(task.task_id, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {}
            {isAssignOpen && (
  <div
    className="modal-overlay"
    onClick={() => setIsAssignOpen(false)}
    style={{
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(8px)'
    }}
  >
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: '520px',
        borderRadius: '18px',
        padding: '28px',
        background: 'white',
        boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.25s ease'
      }}
    >

      {}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '22px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
            Assign New Task
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Create and assign work to your team
          </p>
        </div>

        <button
          onClick={() => setIsAssignOpen(false)}
          style={{
            background: '#f1f5f9',
            border: 'none',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {}
      <div style={{ display: 'grid', gap: '14px' }}>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="e.g. Prepare monthly report"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="3"
            placeholder="Task details..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={e => setForm({ ...form, due_date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="number"
              placeholder="Enter user ID"
              value={form.assigned_to}
              onChange={e => setForm({ ...form, assigned_to: e.target.value })}
            />
          </div>
        </div>

      </div>

      {}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '22px'
      }}>
        <button
          onClick={() => setIsAssignOpen(false)}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            background: 'white',
            color: '#334155',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleAssign}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 10px 20px rgba(59,130,246,0.25)'
          }}
        >
          Create Task
        </button>
      </div>

    </div>
  </div>
)}
        </div>
    );
};

export default SupervisorTasks;