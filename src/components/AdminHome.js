import React, { useState, useEffect } from 'react';
import { FaUser, FaFilm, FaComment, FaChartBar, FaCog, FaSignOutAlt, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'; // Move here

const AdminHome = () => {
  const [userCount, setUserCount] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [movieCount, setMovieCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
    // Fetch data from backend API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch total users and movies & shows from backend
        const res = await fetch(`${API_BASE_URL}/api/admin/dashboard/counts`);
        const data = await res.json();
        setUserCount(data.userCount || 0);
        setMovieCount(data.movieCount || 0);
        // You can fetch pending reviews similarly if you have an endpoint
        setPendingReviews(0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <FaPlay className="brand-icon" />
            <h1>StreamReview Admin</h1>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="welcome-section">
            <h2>Dashboard Overview</h2>
            <p>Manage your OTT platform efficiently</p>
          </div>

          {/* Stats Cards */}
          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon users">
                <FaUser />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : userCount}</h3>
                <p>Total Users</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon movies">
                <FaFilm />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : movieCount}</h3>
                <p>Movies & Shows</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon reviews">
                <FaComment />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : pendingReviews}</h3>
                <p>Pending Reviews</p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="actions-section">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-card" onClick={() => handleNavigation('/manage-users')}>
                <div className="action-icon">
                  <FaUser />
                </div>
                <div className="action-content">
                  <h4>Manage Users</h4>
                  <p>View and manage user accounts</p>
                </div>
              </button>
              
              <button className="action-card" onClick={() => handleNavigation('/ManageMovies')}>
                <div className="action-icon">
                  <FaFilm />
                </div>
                <div className="action-content">
                  <h4>Content Library</h4>
                  <p>Add and manage movies & shows</p>
                </div>
              </button>
              
              <button className="action-card" onClick={() => handleNavigation('/ManageReviews')}>
  <div className="action-icon">
    <FaComment />
  </div>
  <div className="action-content">
    <h4>Moderate Reviews</h4>
    <p>Moderate user reviews and comments</p>
  </div>
</button>
              
              <button className="action-card" onClick={() => handleNavigation('/Admin_analytics')}>
                <div className="action-icon">
                  <FaChartBar />
                </div>
                <div className="action-content">
                  <h4>Analytics</h4>
                  <p>View platform statistics</p>
                </div>
              </button>

              
              
              <button className="action-card" onClick={() => handleNavigation('/admin/trending')}>
                <div className="action-icon">
                  <FaCog />
                </div>
                <div className="action-content">
                  <h4>Manage Trending</h4>
                  <p>Configure platform settings</p>
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-dashboard {
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

        .logout-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #e50914, #ff1744);
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
        }

        .logout-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
          background: linear-gradient(135deg, #ff1744, #e50914);
        }

        .logout-icon {
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

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #e50914, #ff6b6b, #4c9aff);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .stat-icon {
          width: 70px;
          height: 70px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }

        .stat-icon.users {
          background: linear-gradient(135deg, #4c9aff, #2196f3);
        }

        .stat-icon.movies {
          background: linear-gradient(135deg, #e50914, #ff1744);
        }

        .stat-icon.reviews {
          background: linear-gradient(135deg, #ff9800, #f57c00);
        }

        .stat-content h3 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-content p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
        }

        .actions-section h3 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
          text-align: center;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .action-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e50914, #ff6b6b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .action-content h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .action-content p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 1rem;
          }

          .brand h1 {
            font-size: 1.4rem;
          }

          .logout-button {
            padding: 10px 20px;
          }

          .logout-button span {
            display: none;
          }

          .dashboard-main {
            padding: 1rem;
          }

          .welcome-section h2 {
            font-size: 2rem;
          }

          .stats-section {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminHome;