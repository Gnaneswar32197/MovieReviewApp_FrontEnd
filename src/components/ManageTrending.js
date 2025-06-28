import React, { useEffect, useState } from 'react';
import { FaFire, FaCheckCircle } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ManageTrending = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchAllMovies();
    // eslint-disable-next-line
  }, []);

  const fetchAllMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/all-movies`);
      const data = await res.json();
      setMovies(data);
    } catch {
      setMovies([]);
    }
    setLoading(false);
  };

  const toggleTrending = async (movieId) => {
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/movies/${movieId}/trending`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg('Trending status updated!');
        fetchAllMovies();
      } else {
        setActionMsg(data.message || 'Failed to update trending status');
      }
    } catch {
      setActionMsg('Failed to update trending status');
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <FaFire className="brand-icon" />
            <h1>Manage My Trending Movies</h1>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="welcome-section">
            <h2>My Added Movies & Shows</h2>
            <p>Mark your movies or shows as trending content.</p>
            {actionMsg && <div className="action-msg">{actionMsg}</div>}
          </div>
          {loading ? (
            <div className="loading">Loading movies...</div>
          ) : (
            <div className="movies-grid">
              {movies.length === 0 ? (
                <div className="no-movies">No movies found.</div>
              ) : (
                movies.map(movie => (
                  <div className="movie-card" key={movie._id}>
                    <div className="movie-poster">
                      {movie.posterUrl ? (
                        <img src={movie.posterUrl} alt={movie.title} />
                      ) : (
                        <span className="no-image">No Image</span>
                      )}
                    </div>
                    <div className="movie-info">
                      <h4>{movie.title}</h4>
                      <div className="movie-meta">
                        {movie.category && (
                          <span className="movie-category">{movie.category}</span>
                        )}
                        {movie.genres && (
                          <span className="movie-genres">
                            {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
                          </span>
                        )}
                      </div>
                      <button
                        className={`trending-btn${movie.trending ? ' active' : ''}`}
                        onClick={() => toggleTrending(movie._id)}
                      >
                        <FaFire />
                        {movie.trending ? 'Trending' : 'Mark as Trending'}
                        {movie.trending && <FaCheckCircle style={{ marginLeft: 8, color: '#ffd700' }} />}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
          color: #ffd700;
        }
        .brand h1 {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ffd700, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
        .action-msg {
          color: #ffd700;
          margin-top: 1rem;
          font-weight: 600;
        }
        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
          width: 100%;
        }
        .movie-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .movie-poster {
          width: 100%;
          height: 220px;
          background: #222;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .movie-poster img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          background: #222;
        }
        .no-image {
          color: #aaa;
          font-size: 1.2rem;
        }
        .movie-info {
          padding: 1.2rem;
        }
        .movie-info h4 {
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
          font-weight: 700;
        }
        .movie-meta {
          margin-top: 1rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .movie-category {
          background: rgba(229, 9, 20, 0.15);
          color: #e50914;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .movie-genres {
          background: rgba(76, 154, 255, 0.2);
          color: #4c9aff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .trending-btn {
          margin-top: 1.2rem;
          background: linear-gradient(135deg, #ffd700, #e50914);
          color: #222;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, color 0.2s;
        }
        .trending-btn.active {
          background: linear-gradient(135deg, #e50914, #ffd700);
          color: #fff;
        }
        .trending-btn:hover {
          background: linear-gradient(135deg, #ff1744, #ffd700);
          color: #fff;
        }
        @media (max-width: 900px) {
          .dashboard-main {
            padding: 1rem;
          }
          .dashboard-container {
            max-width: 100vw;
            padding: 0;
          }
          .movies-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 1.2rem;
          }
        }
        @media (max-width: 600px) {
          .dashboard-header {
            padding: 0.7rem 0.7rem;
          }
          .header-content {
            flex-direction: column;
            gap: 0.7rem;
          }
          .brand h1 {
            font-size: 1.2rem;
          }
          .brand-icon {
            font-size: 1.3rem;
          }
          .dashboard-main {
            padding: 0.5rem;
          }
          .movies-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.7rem;
          }
          .movie-poster {
            height: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageTrending;