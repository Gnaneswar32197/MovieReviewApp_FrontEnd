import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaArrowLeft, FaEdit, FaSave, FaTimes, FaPlay } from 'react-icons/fa';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState({ username: '', _id: '' });
  const [editingIdx, setEditingIdx] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/movies/${id}`);
        const data = await res.json();
        setMovie(data);
        // If user has already rated, set their rating
        if (data && data.ratings && localStorage.getItem('user')) {
          const userData = JSON.parse(localStorage.getItem('user'));
          const userRating = data.ratings.find(r => r.userId === userData._id);
          if (userRating) setRating(userRating.value);
        }
      } catch {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    const userData = JSON.parse(localStorage.getItem('user')) || { username: '', _id: '' };
    setUser(userData);

    fetchMovie();
  }, [id]);

  // Rate movie
  const handleRating = async (num) => {
    setRating(num);
    setMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/movies/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, value: num }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Rating submitted!');
        setMovie(prev => ({ ...prev, rating: data.rating })); // update average
      } else {
        setMsg(data.message || 'Failed to submit rating');
      }
    } catch {
      setMsg('Failed to submit rating');
    }
  };

  // Post comment
  const handleComment = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/movies/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username || 'User', text: comment }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Comment added!');
        setComment('');
        setMovie(prev => ({ ...prev, comments: data.comments }));
      } else {
        setMsg(data.message || 'Failed to add comment');
      }
    } catch {
      setMsg('Failed to add comment');
    }
  };

  // Edit comment
  const handleEditComment = (idx, text) => {
    setEditingIdx(idx);
    setEditingText(text);
  };

  // Save edited comment
  const handleSaveEdit = async (idx, commentObj) => {
    setMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/movies/${id}/comments/${idx}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username || 'User', text: editingText }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Comment updated!');
        setEditingIdx(null);
        setEditingText('');
        setMovie(prev => ({ ...prev, comments: data.comments }));
      } else {
        setMsg(data.message || 'Failed to update comment');
      }
    } catch {
      setMsg('Failed to update comment');
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingIdx(null);
    setEditingText('');
  };

  if (loading) {
    return (
      <div className="movie-details-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-container">
        <p>Movie not found.</p>
      </div>
    );
  }

  return (
  <div className="movie-details-dashboard">
    <header className="dashboard-header">
      <div className="header-content">
        <div className="brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/UserHome')}>
          <FaArrowLeft style={{ marginRight: 8 }} /> 
          <FaPlay className="brand-icon" />
          <h1>StreamReview</h1>
        </div>
      </div>
    </header>
    <main className="dashboard-main">
      
        {loading ? (
          <div className="movie-details-container">
            <p>Loading...</p>
          </div>
        ) : !movie ? (
          <div className="movie-details-container">
            <p>Movie not found.</p>
          </div>
        ) : (
          <div className="movie-details-container">
            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 32 }}>
              <div style={{ minWidth: 200, minHeight: 300, background: '#222', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} style={{ width: 200, height: 300, objectFit: 'contain' }} />
                ) : (
                  <span style={{ color: '#aaa' }}>No Image</span>
                )}
              </div>
              <div>
                <h2 style={{ marginBottom: 8 }}>{movie.title}</h2>
                <p>
                  <strong>Director:</strong> {movie.director}<br />
                  <strong>Actor:</strong> {movie.actor}<br />
                  <strong>Actress:</strong> {movie.actress}<br />
                  <strong>Genre:</strong> {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genre}<br />
                  <strong>Release:</strong> {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : ''}<br />
                  <strong>Duration:</strong> {movie.duration} min<br />
                  <strong>Average Rating:</strong> {movie.rating}/10<br />
                  <strong>Description:</strong> {movie.description}
                </p>
              </div>
            </div>

            {/* Rating Section */}
            <div style={{ marginBottom: 32 }}>
              <h3>Rate this Movie</h3>
              <div style={{ fontSize: 32, margin: '12px 0' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <span
                    key={num}
                    style={{ cursor: 'pointer', color: rating >= num ? '#ffd700' : '#ccc' }}
                    onClick={() => handleRating(num)}
                  >
                    {rating >= num ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>
              {msg && <div style={{ marginTop: 8, color: msg.includes('success') ? 'green' : 'red' }}>{msg}</div>}
            </div>

            {/* Comment Section */}
            <div style={{ marginBottom: 32 }}>
              <h3>Leave a Comment</h3>
              <form onSubmit={handleComment}>
                <textarea
                  rows={3}
                  placeholder="Write your comment..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  required
                  style={{ width: '100%', margin: '12px 0', padding: 10, borderRadius: 8, border: '1px solid #ccc', color: '#222' }}
                />
                <button type="submit" style={{ padding: '10px 24px', borderRadius: 6, background: '#e50914', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                  Submit Comment
                </button>
              </form>
            </div>

            {/* Comments List */}
            <div>
              <h3>Comments</h3>
              {(!movie.comments || movie.comments.length === 0) ? (
                <p>No comments yet.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {movie.comments.map((c, idx) => (
                    <li key={idx} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 10, marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                      {editingIdx === idx ? (
                        <>
                          <input
                            type="text"
                            value={editingText}
                            onChange={e => setEditingText(e.target.value)}
                            style={{ flex: 1, marginRight: 8, borderRadius: 4, border: '1px solid #ccc', padding: 4, color: '#222' }}
                          />
                          <button
                            onClick={() => handleSaveEdit(idx, c)}
                            style={{ background: 'none', border: 'none', color: '#ffd700', cursor: 'pointer', marginRight: 8 }}
                            title="Save"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{ background: 'none', border: 'none', color: '#e50914', cursor: 'pointer' }}
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ flex: 1 }}>
                            <strong>{c.username || 'User'}:</strong> {c.text}
                          </span>
                          {user.username === c.username && (
                            <button
                              onClick={() => handleEditComment(idx, c.text)}
                              style={{ background: 'none', border: 'none', color: '#ffd700', cursor: 'pointer', marginLeft: 8 }}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
    </main>
    <style jsx>{`
      * { margin: 0; padding: 0; box-sizing: border-box; }
      .movie-details-dashboard {
        min-height: 100vh;
        background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d1b69 100%);
        color: white;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .dashboard-header {
        width: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1rem 2rem;
        position: fixed;
        top: 0;
        left: 0;
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
      .dashboard-main {
        flex: 1;
        margin-left: 0;
        padding: 120px 2rem 2rem 2rem;
      }
      .dashboard-container {
        max-width: 800px;
        margin: 0 auto;
      }
      .movie-details-container {
        background: rgba(255,255,255,0.05);
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        margin-bottom: 2rem;
      }
      .movie-details-container h2 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #ffffff, #f0f0f0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .movie-details-container p {
        font-size: 1.1rem;
        color: rgba(255,255,255,0.85);
      }
      .movie-details-container .rating-badge {
        background: rgba(76, 154, 255, 0.2);
        color: #4c9aff;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.95rem;
        font-weight: 600;
      }
      .movie-details-container .duration {
        background: rgba(229, 9, 20, 0.15);
        color: #e50914;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.95rem;
        font-weight: 600;
      }
      .movie-details-container .icon-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 6px;
        border-radius: 50%;
        transition: background 0.2s;
      }
      .movie-details-container .icon-btn:hover {
        background: rgba(255,255,255,0.08);
      }
      .movie-details-container .form-group {
        margin-bottom: 1rem;
      }
      .movie-details-container label {
        display: block;
        margin-bottom: 0.3rem;
        font-weight: 600;
      }
      .movie-details-container input,
      .movie-details-container textarea {
        width: 100%;
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 1rem;
      }
      .movie-details-container textarea {
        min-height: 60px;
      }
      .movie-details-container .submit-btn {
        background: linear-gradient(135deg, #e50914, #ff1744);
        color: #fff;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .movie-details-container .submit-btn:hover {
        background: linear-gradient(135deg, #ff1744, #e50914);
      }
      @media (max-width: 900px) {
        .dashboard-container {
          padding: 0 1rem;
        }
      }
      @media (max-width: 600px) {
        .dashboard-header, .dashboard-main {
          padding: 1rem;
        }
        .brand h1 {
          font-size: 1.2rem;
        }
      }
    `}</style>
  </div>
);
};

export default MovieDetails;