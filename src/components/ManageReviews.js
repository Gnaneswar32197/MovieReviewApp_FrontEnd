import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const CATEGORY_FILTERS = [
  { label: 'All Shows', value: 'all' },
  { label: 'Movies', value: 'Hollywood' },
  { label: 'Anime', value: 'Anime' },
  { label: 'Webseries', value: 'Webseries' }
];

const ManageReviews = () => {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReview, setEditReview] = useState({ text: '', rating: 1 });
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoadingMovies(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/review-movies`);
      const data = await res.json();
      setMovies(Array.isArray(data) ? data : []);
    } catch {
      setMovies([]);
    }
    setLoadingMovies(false);
  };

  const fetchReviews = async (movieId) => {
    setLoadingReviews(true);
    setReviews([]);
    setSelectedMovie(movies.find(m => m._id === movieId));
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/movie/${movieId}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    }
    setLoadingReviews(false);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg('Review deleted!');
        setReviews(reviews.filter(r => r._id !== reviewId));
      } else {
        setActionMsg(data.message || 'Failed to delete review');
      }
    } catch {
      setActionMsg('Failed to delete review');
    }
  };

  const handleEdit = (review) => {
    setEditReviewId(review._id);
    setEditReview({ text: review.text, rating: review.rating });
  };

  const handleEditChange = (e) => {
    setEditReview({ ...editReview, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (reviewId) => {
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editReview)
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg('Review updated!');
        setReviews(reviews.map(r => r._id === reviewId ? { ...r, ...editReview } : r));
        setEditReviewId(null);
      } else {
        setActionMsg(data.message || 'Failed to update review');
      }
    } catch {
      setActionMsg('Failed to update review');
    }
  };

  // Filter movies by category
  const filteredMovies = category === 'all'
    ? movies
    : movies.filter(m => m.category === category);

  return (
    <div className="manage-reviews-page">
      <h2>Moderate Reviews</h2>
      <div className="category-filters">
        {CATEGORY_FILTERS.map(f => (
          <button
            key={f.value}
            className={category === f.value ? 'active' : ''}
            onClick={() => { setCategory(f.value); setSelectedMovie(null); setReviews([]); }}
          >
            {f.label}
          </button>
        ))}
      </div>
      {actionMsg && <div className="action-msg">{actionMsg}</div>}
      {!selectedMovie ? (
        loadingMovies ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <div className="movies-list">
            {filteredMovies.length === 0 ? (
              <div className="no-movies">No movies found.</div>
            ) : (
              filteredMovies.map(movie => (
                <div className="movie-card" key={movie._id} onClick={() => fetchReviews(movie._id)}>
                  <img src={movie.posterUrl} alt={movie.title} />
                  <div className="movie-info">
                    <div className="movie-title">{movie.title}</div>
                    <div className="movie-category">{movie.category}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      ) : (
        <div className="reviews-section">
          <button className="back-btn" onClick={() => { setSelectedMovie(null); setReviews([]); }}>← Back to Shows</button>
          <div className="selected-movie">
            <img src={selectedMovie.posterUrl} alt={selectedMovie.title} />
            <div>
              <div className="movie-title">{selectedMovie.title}</div>
              <div className="movie-category">{selectedMovie.category}</div>
            </div>
          </div>
          {loadingReviews ? (
            <div className="loading">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">No reviews for this show.</div>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <div className="review-card" key={review._id}>
                  <div className="review-header">
                    <span className="review-user">{review.userId?.username || 'User'}</span>
                    <span className="review-rating">Rating: {review.rating}/5</span>
                  </div>
                  {editReviewId === review._id ? (
                    <div className="edit-review">
                      <textarea name="text" value={editReview.text} onChange={handleEditChange} />
                      <input
                        type="number"
                        name="rating"
                        min="1"
                        max="5"
                        value={editReview.rating}
                        onChange={handleEditChange}
                      />
                      <button onClick={() => handleSaveEdit(review._id)}><FaSave /></button>
                      <button onClick={() => setEditReviewId(null)}><FaTimes /></button>
                    </div>
                  ) : (
                    <div className="review-text">{review.text}</div>
                  )}
                  <div className="review-actions">
                    <button className="edit-btn" onClick={() => handleEdit(review)}><FaEdit /></button>
                    <button className="delete-btn" onClick={() => handleDelete(review._id)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        .manage-reviews-page {
          max-width: 900px;
          margin: 40px auto;
          background: rgba(30,30,50,0.97);
          border-radius: 16px;
          padding: 2rem 1.5rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          color: #fff;
        }
        h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          font-weight: 700;
        }
        .category-filters {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .category-filters button {
          background: #222;
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .category-filters .active {
          background: linear-gradient(135deg, #e50914, #ff6b6b);
          color: #fff;
        }
        .movies-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
        }
        .movie-card {
          background: rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 1rem;
          width: 170px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .movie-card:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 8px 24px rgba(229,9,20,0.13);
        }
        .movie-card img {
          width: 110px;
          height: 160px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 0.7rem;
        }
        .movie-info {
          text-align: center;
        }
        .movie-title {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .movie-category {
          color: #ffd700;
          font-size: 0.95rem;
        }
        .reviews-section {
          margin-top: 1.5rem;
        }
        .back-btn {
          background: none;
          border: none;
          color: #4c9aff;
          font-size: 1.1rem;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        .selected-movie {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .selected-movie img {
          width: 90px;
          height: 130px;
          object-fit: cover;
          border-radius: 8px;
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .review-card {
          background: rgba(255,255,255,0.04);
          border-radius: 12px;
          padding: 1.2rem 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          font-size: 1.05rem;
        }
        .review-user {
          color: #4c9aff;
          font-weight: 600;
        }
        .review-rating {
          color: #ffd700;
          font-weight: 600;
        }
        .review-text {
          margin: 0.5rem 0 0.7rem 0;
          color: #fff;
          background: rgba(0,0,0,0.08);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 1.08rem;
        }
        .edit-review textarea {
          width: 100%;
          min-height: 60px;
          margin-bottom: 0.5rem;
        }
        .edit-review input[type="number"] {
          width: 60px;
          margin-right: 0.5rem;
        }
        .review-actions {
          display: flex;
          gap: 1rem;
        }
        .edit-btn, .delete-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: background 0.2s, color 0.2s;
        }
        .edit-btn:hover { background: #2e7d32; color: #ffd700; }
        .delete-btn:hover { background: #b71c1c; color: #ffd700; }
        .action-msg {
          text-align: center;
          margin-bottom: 1rem;
          color: #ffd700;
          font-weight: 600;
        }
        .loading, .no-movies, .no-reviews {
          text-align: center;
          color: #aaa;
          margin: 2rem 0;
        }
        @media (max-width: 600px) {
          .manage-reviews-page {
            padding: 1rem 0.2rem;
          }
          .movies-list {
            gap: 0.7rem;
          }
          .movie-card {
            width: 120px;
            padding: 0.5rem;
          }
          .movie-card img {
            width: 70px;
            height: 100px;
          }
          .selected-movie img {
            width: 60px;
            height: 90px;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageReviews;