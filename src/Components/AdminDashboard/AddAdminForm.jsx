import React, { useState, useEffect } from 'react';
import './AddAdminForm.css';

const AddAdminForm = () => {
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const [admins, setAdmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8083/api/pharmacy/admin/showAdmins`)
      .then(res => res.json())
      .then(data => setAdmins(data))
      .catch(err => setAdmins([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.password) return;

    if (editingId !== null) {
      alert("Update functionality needs backend support.");
      setEditingId(null);
      setFormData({ userName: '', password: '' });
      return;
    }

    try {
      const res = await fetch(`http://localhost:8083/api/pharmacy/admin/addAdmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to add admin");

      const newAdmin = await res.json();
      setAdmins([...admins, newAdmin]);
      setFormData({ userName: '', password: '' });

    } catch (err) {
      alert("Error adding admin");
    }
  };

  const handleUpdate = (user) => {
    setFormData({ username: user.username, password: '' });
    setEditingId(user.id);
  };

  const handleDelete = (id) => {
    alert("Delete functionality needs backend support.");
  };

  return (
    <div className="page-center">
      <div className="user-management">
        <div className="admin-form-container">
          <h2>Admin Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({...formData, userName: e.target.value})}
                required
              />
            </div>
            <div className="form-group password-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>
            <button type="submit" className="submit-btn">
              {editingId !== null ? 'Update' : 'Add Admin'}
            </button>
          </form>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id || admin.adminId}>
                  <td>{admin.id || admin.adminId}</td>
                  <td>{admin.userName}</td>
                  <td>{'•'.repeat(8)}</td>
                  {/* Uncomment below when update/delete is supported in backend
                  <td className="actions">
                    <button 
                      className="update-btn"
                      onClick={() => handleUpdate(admin)}
                    >
                      UPDATE
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(admin.id || admin.adminId)}
                    >
                      DELETE
                    </button>
                  </td>
                  */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddAdminForm;