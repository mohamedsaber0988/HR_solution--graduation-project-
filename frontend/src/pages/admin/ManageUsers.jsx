import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function AdminManageUsers() {
  const API = "http://127.0.0.1:8000/api";
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    id: null, firstName: '', lastName: '', email: '', password: '', 
    phone: '', role: 'employee', department_id: '', baseSalary: '', jobTitle: '', supervisorId: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data.data.map(u => ({
        id: u.user_id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        jobTitle: u.job_title,
        baseSalary: u.base_salary,
        department: u.department_name,
        department_id: u.department_id || '',
        supervisorId: u.supervisor_id || ''
      })));
    } catch (err) { console.log('FETCH ERROR:', err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUser({ ...user, password: '' });
      setIsEditing(true);
    } else {
      setCurrentUser({ id: null, firstName: '', lastName: '', email: '', password: '', phone: '', role: 'employee', department_id: '', baseSalary: '', jobTitle: '', supervisorId: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const format = (val) => (val === '' ? null : val);
    
    try {
      const payload = {
        first_name: currentUser.firstName, last_name: currentUser.lastName,
        email: currentUser.email, phone: currentUser.phone, role: currentUser.role,
        job_title: currentUser.jobTitle, base_salary: format(currentUser.baseSalary),
        department_id: format(currentUser.department_id), supervisor_id: format(currentUser.supervisorId)
      };

      if (!isEditing || currentUser.password) payload.password = currentUser.password;

      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

      if (isEditing) {
        await axios.put(`${API}/update-users/${currentUser.id}`, payload, config);
      } else {
        await axios.post(`${API}/add-users`, payload, config);
      }

      fetchUsers();
      setIsModalOpen(false);
    } catch (err) {
      alert("Error: " + JSON.stringify(err.response?.data?.errors || "Server Error"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API}/delete-users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) { console.log('DELETE ERROR:', err); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>HR Management - Users</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add User</button>
      </div>

      <div className="table-card" style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Job Title</th>
              <th>Phone</th>
              <th>Salary</th>
              <th>Role</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong>#{u.id}</strong></td>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.jobTitle || '-'}</td>
                <td>{u.phone || '-'}</td>
                <td>{u.baseSalary ? `${u.baseSalary} EGP` : '0'}</td>
                <td><span className="role-badge">{u.role}</span></td>
                <td>{u.department || 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleOpenModal(u)}>✎</button>
                    <button className="btn-delete" onClick={() => handleDelete(u.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? 'Update Employee' : 'New Employee'}</h2>
            <form onSubmit={handleSubmit} className="custom-form">
              <div className="form-group-row">
                <input name="firstName" placeholder="First Name" value={currentUser.firstName} onChange={handleInputChange} required />
                <input name="lastName" placeholder="Last Name" value={currentUser.lastName} onChange={handleInputChange} required />
              </div>
              
              <input name="email" placeholder="Email Address" type="email" value={currentUser.email} onChange={handleInputChange} required />
              <input name="password" placeholder={isEditing ? "--PASSWORD--" : "Password"} type="password" value={currentUser.password} onChange={handleInputChange} required={!isEditing} />
              
              <div className="form-group-row">
                <input name="jobTitle" placeholder="Job Title" value={currentUser.jobTitle} onChange={handleInputChange} />
                <input name="phone" placeholder="Phone Number" value={currentUser.phone} onChange={handleInputChange} />
              </div>

              <div className="form-group-row">
                <input name="baseSalary" placeholder="Base Salary" type="number" value={currentUser.baseSalary} onChange={handleInputChange} />
                <input name="department_id" placeholder="Dept ID" type="number" value={currentUser.department_id} onChange={handleInputChange} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManageUsers;