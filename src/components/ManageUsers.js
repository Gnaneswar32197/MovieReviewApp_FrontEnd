import React, { useEffect, useState } from 'react';
import { FaUser, FaEdit, FaTrash, FaUserShield, FaUserSlash, FaSave, FaTimes, FaArrowLeft, FaPlay } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // const response = await fetch('http://localhost:5000/users');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users`);
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await fetch(`http://localhost:5000/users/edit/${editingUser}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(editForm),
    //   });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/edit/${editingUser}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editForm),
        }
      );
      
      if (response.ok) {
        setEditingUser(null);
        fetchUsers();
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleRoleChange = async (userId, newRole) => {
    // try {
    //   const response = await fetch(`http://localhost:5000/users/${userId}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ role: newRole }),
    //   });
        try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      
      if (response.ok) {
        fetchUsers();
      } else {
        console.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleSuspendUser = async (userId) => {
    // try {
    //   const response = await fetch(`http://localhost:5000/users/${userId}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ suspended: true }),
    //   });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ suspended: true }),
        }
      );
      
      if (response.ok) {
        fetchUsers();
      } else {
        console.error('Failed to suspend user');
      }
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const confirmDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    // try {
    //   const response = await fetch(`http://localhost:5000/users/${userToDelete}`, {
    //     method: 'DELETE',
    //   });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userToDelete}`,
        {
          method: 'DELETE',
        }
      );
      
      if (response.ok) {
        setUserToDelete(null);
        setShowDeleteDialog(false);
        fetchUsers();
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const closeDeleteDialog = () => {
    setUserToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleReturn = () => {
    window.location.href = '/AdminHome';
  };

  return (
    <div className="manage-users">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <FaPlay className="brand-icon" />
            <h1>StreamReview Admin</h1>
          </div>
          <button className="return-button" onClick={handleReturn}>
            <FaArrowLeft className="return-icon" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="welcome-section">
            <h2>User Management</h2>
            <p>Manage platform users efficiently</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <section className="users-section">
              <div className="users-table-container">
                <div className="table-wrapper">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) =>
                        editingUser === user._id ? (
                          <tr key={user._id} className="edit-row">
                            <td colSpan="5">
                              <div className="edit-form">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={editForm.firstName}
                                    onChange={handleEditChange}
                                    required
                                  />
                                  <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={editForm.lastName}
                                    onChange={handleEditChange}
                                    required
                                  />
                                  <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    required
                                  />
                                  <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    value={editForm.phone}
                                    onChange={handleEditChange}
                                  />
                                </div>
                                <div className="form-actions">
                                  <button type="button" onClick={handleEditSubmit} className="save-btn">
                                    <FaSave className="icon" />
                                    Save Changes
                                  </button>
                                  <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                                    <FaTimes className="icon" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={user._id}>
                            <td className="user-name">
                              <div className="user-avatar">
                                <FaUser />
                              </div>
                              <span>{user.firstName} {user.lastName}</span>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                              <span className={`role-badge ${user.role}`}>
                                {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                                {user.role}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  onClick={() => handleEditClick(user)}
                                  className="action-btn edit-btn"
                                  title="Edit User"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                  className="action-btn role-btn"
                                  title={user.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                                >
                                  <FaUserShield />
                                </button>
                                <button
                                  onClick={() => handleSuspendUser(user._id)}
                                  className="action-btn suspend-btn"
                                  title="Suspend User"
                                >
                                  <FaUserSlash />
                                </button>
                                <button
                                  onClick={() => confirmDeleteUser(user._id)}
                                  className="action-btn delete-btn"
                                  title="Delete User"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleDeleteUser} className="confirm-delete-btn">
                <FaTrash className="icon" />
                Yes, Delete
              </button>
              <button onClick={closeDeleteDialog} className="cancel-delete-btn">
                <FaTimes className="icon" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .manage-users {
          min-height: 100vh;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d1b69 100%);
          color: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .dashboard-header {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          font-size: 2rem;
          color: #e50914;
        }

        .brand h1 {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #e50914, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .return-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #4c9aff, #2196f3);
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(76, 154, 255, 0.3);
        }

        .return-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76, 154, 255, 0.4);
          background: linear-gradient(135deg, #2196f3, #4c9aff);
        }

        .return-icon {
          font-size: 1rem;
        }

        .dashboard-main {
          padding: 2rem;
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .welcome-section {
          text-align: center;
          margin-bottom: 3rem;
        }

        .welcome-section h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-section p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(229, 9, 20, 0.3);
          border-top: 4px solid #e50914;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .loading-container p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .users-section {
          margin-top: 2rem;
        }

        .users-table-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .users-table-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          background: transparent;
        }

        .users-table th {
          background: rgba(229, 9, 20, 0.1);
          color: #ffffff;
          padding: 20px 15px;
          text-align: left;
          font-size: 1.1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid rgba(229, 9, 20, 0.3);
        }

        .users-table td {
          padding: 20px 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #e0e0e0;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .users-table tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .user-name {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e50914, #ff6b6b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .role-badge.admin {
          background: linear-gradient(135deg, #e50914, #ff1744);
          color: #fff;
        }

        .role-badge.user {
          background: linear-gradient(135deg, #4c9aff, #2196f3);
          color: #fff;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          font-size: 1rem;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .edit-btn:hover {
          background: linear-gradient(135deg, #4c9aff, #2196f3);
          border-color: #4c9aff;
        }

        .role-btn:hover {
          background: linear-gradient(135deg, #ff9800, #f57c00);
          border-color: #ff9800;
        }

        .suspend-btn:hover {
          background: linear-gradient(135deg, #95a5a6, #7f8c8d);
          border-color: #95a5a6;
        }

        .delete-btn:hover {
          background: linear-gradient(135deg, #e50914, #ff1744);
          border-color: #e50914;
        }

        .edit-row {
          background: rgba(229, 9, 20, 0.1) !important;
        }

        .edit-form {
          padding: 30px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          margin: 10px 0;
        }

        .form-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .edit-form input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 15px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .edit-form input:focus {
          outline: none;
          border-color: #e50914;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 15px rgba(229, 9, 20, 0.3);
        }

        .edit-form input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .save-btn {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: #fff;
          border: none;
          border-radius: 25px;
          padding: 12px 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
        }

        .save-btn:hover {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(39, 174, 96, 0.4);
        }

        .cancel-btn {
          background: linear-gradient(135deg, #95a5a6, #7f8c8d);
          color: #fff;
          border: none;
          border-radius: 25px;
          padding: 12px 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 5px 15px rgba(149, 165, 166, 0.3);
        }

        .cancel-btn:hover {
          background: linear-gradient(135deg, #7f8c8d, #95a5a6);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(149, 165, 166, 0.4);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .delete-modal {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 40px;
          max-width: 450px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          animation: slideInDown 0.3s ease;
        }

        .modal-header h3 {
          color: #fff;
          font-size: 1.5rem;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #e50914, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modal-body p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          margin-bottom: 30px;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .confirm-delete-btn {
          background: linear-gradient(135deg, #e50914, #ff1744);
          color: #fff;
          border: none;
          border-radius: 25px;
          padding: 12px 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3);
        }

        .confirm-delete-btn:hover {
          background: linear-gradient(135deg, #ff1744, #e50914);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(229, 9, 20, 0.4);
        }

        .cancel-delete-btn {
          background: linear-gradient(135deg, #95a5a6, #7f8c8d);
          color: #fff;
          border: none;
          border-radius: 25px;
          padding: 12px 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 5px 15px rgba(149, 165, 166, 0.3);
        }

        .cancel-delete-btn:hover {
          background: linear-gradient(135deg, #7f8c8d, #95a5a6);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(149, 165, 166, 0.4);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 1rem;
          }

          .brand h1 {
            font-size: 1.4rem;
          }

          .return-button {
            padding: 10px 20px;
          }

          .return-button span {
            display: none;
          }

          .dashboard-main {
            padding: 1rem;
          }

          .welcome-section h2 {
            font-size: 2rem;
          }

          .users-table th,
          .users-table td {
            padding: 15px 10px;
            font-size: 0.9rem;
          }

          .action-buttons {
            justify-content: center;
          }

          .form-group {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .modal-actions {
            flex-direction: column;
            gap: 10px;
          }

          .delete-modal {
            padding: 30px 20px;
          }
        }

        @media (max-width: 480px) {
          .users-table {
            font-size: 0.8rem;
          }

          .action-btn {
            width: 35px;
            height: 35px;
            font-size: 0.9rem;
          }

          .user-avatar {
            width: 35px;
            height: 35px;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;