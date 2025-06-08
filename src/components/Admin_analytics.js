import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const AdminAnalytics = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/all-favorites`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        const data = await res.json();
        setFavorites(Array.isArray(data) ? data : []);
      } catch {
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Count by category and genre
  const categoryCount = {};
  const genreCount = {};
  favorites.forEach(fav => {
    const movie = fav.movie;
    if (movie) {
      if (movie.category) {
        categoryCount[movie.category] = (categoryCount[movie.category] || 0) + 1;
      }
      if (Array.isArray(movie.genres)) {
        movie.genres.forEach(g => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
      }
    }
  });

  const categoryLabels = Object.keys(categoryCount);
  const categoryData = Object.values(categoryCount);
  const genreLabels = Object.keys(genreCount);
  const genreData = Object.values(genreCount);

  const chartColors = [
    '#e50914', '#ff6b6b', '#ffd700', '#4c9aff', '#00b894', '#fdcb6e', '#a29bfe', '#00bcd4', '#ff9800', '#8d6e63'
  ];

  return (
    <div className="manage-movies">
      {/* Header */}
      <header className="movies-header">
        <div className="header-content">
          <div className="brand">
            <FaArrowLeft className="brand-icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/AdminHome')} />
            <h1>Analytics & Insights</h1>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="movies-main">
        <div className="movies-container">
          <div className="section-header">
            <h2>Platform Analytics</h2>
            <p>Visualize user interests by Favorites (Category & Genre)</p>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading analytics...</p>
            </div>
          ) : (
            <div className="analytics-section">
              <div className="analytics-card">
                <h3>Favorite Categories</h3>
                {categoryLabels.length === 0 ? (
                  <p style={{ color: '#aaa' }}>No favorites data available.</p>
                ) : (
                  <Pie
                    data={{
                      labels: categoryLabels,
                      datasets: [{
                        data: categoryData,
                        backgroundColor: chartColors,
                        borderWidth: 1,
                      }]
                    }}
                    options={{
                      plugins: {
                        legend: { position: 'bottom', labels: { color: '#fff', font: { size: 16 } } }
                      }
                    }}
                  />
                )}
              </div>
              <div className="analytics-card">
                <h3>Favorite Genres</h3>
                {genreLabels.length === 0 ? (
                  <p style={{ color: '#aaa' }}>No favorites data available.</p>
                ) : (
                  <Bar
                    data={{
                      labels: genreLabels,
                      datasets: [{
                        label: 'Favorites',
                        data: genreData,
                        backgroundColor: chartColors,
                        borderWidth: 1,
                      }]
                    }}
                    options={{
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        x: { ticks: { color: '#fff', font: { size: 14 } } },
                        y: { ticks: { color: '#fff', font: { size: 14 } }, beginAtZero: true }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .manage-movies {
          min-height: 100vh;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d1b69 100%);
          color: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .movies-header {
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

        .movies-main {
          padding: 2rem;
        }

        .movies-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-header p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .analytics-section {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .analytics-card {
          background: rgba(255,255,255,0.05);
          border-radius: 18px;
          padding: 2rem 2rem 1.5rem 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          min-width: 350px;
          max-width: 500px;
          flex: 1 1 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .analytics-card h3 {
          color: #ffd700;
          font-size: 1.3rem;
          margin-bottom: 1.2rem;
          font-weight: 700;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left: 4px solid #e50914;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .movies-main {
            padding: 1rem;
          }
          .analytics-section {
            flex-direction: column;
            gap: 2rem;
          }
          .analytics-card {
            min-width: unset;
            max-width: 100vw;
            padding: 1rem 0.5rem 1rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;