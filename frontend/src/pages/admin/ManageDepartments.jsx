import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function ManageDepartments() {

  const API = "http://127.0.0.1:8000/api";

  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentDepartment, setCurrentDepartment] = useState({
    name: '',
    description: ''
  });

  // =========================
  // FETCH DEPARTMENTS
  // =========================
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API}/departments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // 🔥 mapping حسب dep_id / dep_name
      setDepartments(res.data.data.map(dep => ({
        id: dep.dep_id,
        name: dep.dep_name,
        description: dep.description
      })));

    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================
  // INPUT
  // =========================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDepartment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // CREATE
  // =========================
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post(`${API}/departments`, {
  dep_name: currentDepartment.name,
  description: currentDepartment.description
}, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

    setIsModalOpen(false);

    setCurrentDepartment({
      name: '',
      description: ''
    });

    fetchDepartments();

  } catch (err) {
  console.log("CREATE ERROR:", err.response?.data);
}
};

  // =========================
  // DELETE (frontend only)
  // =========================
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    await axios.delete(`${API}/departments/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    
    setDepartments(prev => prev.filter(d => d.id !== id));

  } catch (err) {
    console.log("DELETE ERROR:", err.response?.data);
  }
};
  return (
    <div className="page-container fade-in">

      {}
      <div className="page-header">
        <h1 className="page-title">Manage Departments</h1>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add Department
        </button>
      </div>

      {}
      <div className="table-card">

        <table className="custom-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Department Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dep, index) => (
              <tr key={dep.id ?? index}>

                <td>
                  <strong>#{dep.id}</strong>
                </td>

                <td>{dep.name}</td>

                <td>{dep.description || '-'}</td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(dep.id)}
                    >
                      🗑
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {}
      {isModalOpen && (
        <div className="modal-overlay">

          <div className="modal-content">

            <h2>Add Department</h2>

            <form onSubmit={handleSubmit} className="custom-form">

              <input
                name="name"
                placeholder="Department Name"
                value={currentDepartment.name}
                onChange={handleInputChange}
                required
              />

              <input
                name="description"
                placeholder="Description"
                value={currentDepartment.description}
                onChange={handleInputChange}
              />

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-submit">
                  Save
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default ManageDepartments;