import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaTrash, FaStar } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    }
    setLoading(false);
  };

  const handleApprove = async (reviewId) => {
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg('Review approved!');
        fetchReviews();
      } else {
        setActionMsg(data.message || 'Failed to approve review');
      }
    } catch {
      setActionMsg('Failed to approve review');
    }
  };

  const handleReject = async (reviewId) => {
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg('Review rejected!');
        fetchReviews();
      } else {
        setActionMsg(data.message || 'Failed to reject review');
      }
    } catch {
      setActionMsg('Failed to reject review');
    }
  };

  const handleDelete = async (reviewId) => {
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg('Review deleted!');
        fetchReviews();
      } else {
        setActionMsg(data.message || 'Failed to delete review');
      }
    } catch {
      setActionMsg('Failed to delete review');
    }
  };

  return (
    <div className="manage-reviews-page">
      <h2>Moderate Reviews</h2>
      {actionMsg && <div className="action-msg">{actionMsg}</div>}
      {loading ? (
        <div className="loading">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">No reviews to moderate.</div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <div className="review-header">
                <span className="review-user">{review.userId?.username || 'User'}</span>
                <span className="review-movie">{review.movieId?.title || 'Movie'}</span>
                <span className="review-rating">
                  {[1,2,3,4,5].map(num => (
                    <FaStar key={num} color={review.rating >= num ? '#ffd700' : '#ccc'} />
                  ))}
                </span>
              </div>
              <div className="review-text">{review.text}</div>
              <div className="review-actions">
                <button className="approve-btn" title="Approve" onClick={() => handleApprove(review._id)}>
                  <FaCheck />
                </button>
                <button className="reject-btn" title="Reject" onClick={() => handleReject(review._id)}>
                  <FaTimes />
                </button>
                <button className="delete-btn" title="Delete" onClick={() => handleDelete(review._id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .manage-reviews-page {
          max-width: 800px;
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
        .action-msg {
          text-align: center;
          margin-bottom: 1rem;
          color: #ffd700;
          font-weight: 600;
        }
        .loading, .no-reviews {
          text-align: center;
          color: #aaa;
          margin: 2rem 0;
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
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
        .review-movie {
          color: #ffd700;
          font-weight: 600;
        }
        .review-rating {
          display: flex;
          gap: 2px;
        }
        .review-text {
          margin: 0.5rem 0 0.7rem 0;
          color: #fff;
          background: rgba(0,0,0,0.08);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 1.08rem;
        }
        .review-actions {
          display: flex;
          gap: 1rem;
        }
        .approve-btn, .reject-btn, .delete-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: background 0.2s, color 0.2s;
        }
        .approve-btn:hover { background: #2e7d32; color: #ffd700; }
        .reject-btn:hover { background: #b71c1c; color: #ffd700; }
        .delete-btn:hover { background: #222; color: #e50914; }
        @media (max-width: 600px) {
          .manage-reviews-page {
            padding: 1rem 0.2rem;
          }
          .review-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageReviews;