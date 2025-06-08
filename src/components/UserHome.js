import React, { useState, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaKey, FaPlay, FaHome, FaStar, FaHeart, FaRegHeart, FaCommentDots, FaSearch, FaFilter, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const UserHome = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState({ username: '', email: '' });
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changePasswordData, setChangePasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [changePasswordMsg, setChangePasswordMsg] = useState('');
  const [reviewModal, setReviewModal] = useState({ open: false, movie: null });
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewMsg, setReviewMsg] = useState('');
  const [userReviews, setUserReviews] = useState([]);
  const [commentModal, setCommentModal] = useState({ open: false, review: null });
  const [commentText, setCommentText] = useState('');
  const [commentMsg, setCommentMsg] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ actor: '', actress: '', director: '', rating: '', ratingOrder: '', category: '' });
  const [showFilter, setShowFilter] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [showcase, setShowcase] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info
    const userData = JSON.parse(localStorage.getItem('user')) || { username: 'User', email: 'user@email.com' };
    setUser(userData);

    // Fetch movies
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/movies`);
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user reviews
    const fetchUserReviews = async () => {
      try {
        const userId = user._id;
        if (!userId) return setUserReviews([]);
        const res = await fetch(`${API_BASE_URL}/api/reviews/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        const data = await res.json();
        setUserReviews(data || []);
      } catch {
        setUserReviews([]);
      }
    };

    // Fetch favorites and watchlist
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/favorites?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        const data = await res.json();
        setFavorites(data || []);
      } catch {
        setFavorites([]);
      }
    };
    const fetchWatchlist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/watchlist?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        const data = await res.json();
        setWatchlist(data || []);
      } catch {
        setWatchlist([]);
      }
    };

    fetchMovies();
    fetchUserReviews();
    fetchFavorites();
    fetchWatchlist();
    // eslint-disable-next-line
  }, [user._id]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleMenu = (menu) => {
    setShowProfile(menu === 'profile');
    setShowChangePassword(menu === 'changePassword');
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePasswordMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({
          ...changePasswordData,
          userId: user._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChangePasswordMsg('Password changed successfully!');
        setChangePasswordData({ oldPassword: '', newPassword: '' });
      } else {
        setChangePasswordMsg(data.message || 'Failed to change password');
      }
    } catch {
      setChangePasswordMsg('Failed to change password');
    }
  };

  // --- Profile Edit ---
  const handleEditProfile = () => {
    setEditProfile(true);
    setEditData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || ''
    });
  };

  const handleProfileInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/user/profile/${user._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      body: JSON.stringify(editData)
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setEditProfile(false);
    }
  };

  // --- Review Features ---
  const openReviewModal = (movie) => {
    setReviewModal({ open: true, movie });
    setReviewText('');
    setReviewRating(0);
    setReviewMsg('');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({
          movieId: reviewModal.movie._id,
          text: reviewText,
          rating: reviewRating,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewMsg('Review submitted!');
        setReviewModal({ open: false, movie: null });
        // Refresh user reviews
        const reviewsRes = await fetch(`${API_BASE_URL}/api/reviews/user/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        const reviewsData = await reviewsRes.json();
        setUserReviews(reviewsData || []);
      } else {
        setReviewMsg(data.message || 'Failed to submit review');
      }
    } catch {
      setReviewMsg('Failed to submit review');
    }
  };

  // --- Comment Features ---
  const openCommentModal = (review) => {
    setCommentModal({ open: true, review });
    setCommentText('');
    setCommentMsg('');
  };

  const submitComment = async (e) => {
    e.preventDefault();
    setCommentMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${commentModal.review._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentMsg('Comment added!');
        setCommentModal({ open: false, review: null });
      } else {
        setCommentMsg(data.message || 'Failed to add comment');
      }
    } catch {
      setCommentMsg('Failed to add comment');
    }
  };

  // --- Favorites & Watchlist ---
  const toggleFavorite = async (movieId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ userId: user._id, movieId }),
      });
      const data = await res.json();
      if (data.success) {
        setFavorites(data.favorites || []);
      }
    } catch {}
  };

  const toggleWatchlist = async (movieId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/watchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ userId: user._id, movieId }),
      });
      const data = await res.json();
      if (data.success) {
        setWatchlist(data.watchlist || []);
      }
    } catch {}
  };

  const isFavorite = (movieId) => Array.isArray(favorites) && favorites.some(m => m._id === movieId);
  const isInWatchlist = (movieId) => Array.isArray(watchlist) && watchlist.some(m => m._id === movieId);

  // --- Search & Filter Logic ---
  const uniqueActors = [...new Set(movies.map(m => m.actor).filter(Boolean))];
  const uniqueActresses = [...new Set(movies.map(m => m.actress).filter(Boolean))];
  const uniqueDirectors = [...new Set(movies.map(m => m.director).filter(Boolean))];
  const uniqueCategories = [...new Set(movies.map(m => m.category).filter(Boolean))];

  let filteredMovies = movies.filter(movie => {
    // Search by name, actor, actress, director
    const searchLower = search.toLowerCase();
    const matchesSearch =
      movie.title?.toLowerCase().includes(searchLower) ||
      movie.actor?.toLowerCase().includes(searchLower) ||
      movie.actress?.toLowerCase().includes(searchLower) ||
      movie.director?.toLowerCase().includes(searchLower);

    // Filter by actor, actress, director, category
    const matchesActor = filter.actor ? movie.actor === filter.actor : true;
    const matchesActress = filter.actress ? movie.actress === filter.actress : true;
    const matchesDirector = filter.director ? movie.director === filter.director : true;
    const matchesCategory = filter.category ? movie.category === filter.category : true;

    // Filter by rating
    let matchesRating = true;
    if (filter.rating) {
      if (filter.rating === 'high') matchesRating = movie.rating >= 7;
      else if (filter.rating === 'low') matchesRating = movie.rating < 7;
    }

    return matchesSearch && matchesActor && matchesActress && matchesDirector && matchesCategory && matchesRating;
  });

  // Sort by rating order if selected
  if (filter.ratingOrder === 'high') {
    filteredMovies = filteredMovies.sort((a, b) => b.rating - a.rating);
  } else if (filter.ratingOrder === 'low') {
    filteredMovies = filteredMovies.sort((a, b) => a.rating - b.rating);
  }

  // Showcase logic
  let showcaseMovies = filteredMovies;
  if (showcase === 'favorites') {
    showcaseMovies = favorites;
  } else if (showcase === 'watchlist') {
    showcaseMovies = watchlist;
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <FaPlay className="brand-icon" />
            <h1
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setShowProfile(false);
                setShowChangePassword(false);
                navigate('/UserHome');
              }}
            >
              StreamReview
            </h1>
          </div>
          <div className="user-menu">
            <button className="menu-btn" onClick={() => handleMenu('profile')}>
              <FaUser className="menu-icon" />
              <span>Profile</span>
            </button>
            <button className="menu-btn" onClick={() => handleMenu('changePassword')}>
              <FaKey className="menu-icon" />
              <span>Change Password</span>
            </button>
            <button className="menu-btn" onClick={handleLogout}>
              <FaSignOutAlt className="menu-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <button className="sidebar-btn" onClick={() => { setShowProfile(false); setShowChangePassword(false); }}>
          <FaHome /> Home
        </button>
        <button className="sidebar-btn" onClick={() => handleMenu('profile')}>
          <FaUser /> Profile
        </button>
        <button className="sidebar-btn" onClick={() => handleMenu('changePassword')}>
          <FaKey /> Change Password
        </button>
        <button className="sidebar-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Home: Movies & Review */}
          {!showProfile && !showChangePassword && (
            <>
              <div className="welcome-section">
                <h2>Welcome, {user.username}!</h2>
                <p>Browse and review your favorite movies & shows</p>
              </div>
              {/* Showcase Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                <button
                  className={`filter-btn${showcase === 'all' ? ' active' : ''}`}
                  onClick={() => setShowcase('all')}
                >
                  All Movies
                </button>
                <button
                  className={`filter-btn${showcase === 'favorites' ? ' active' : ''}`}
                  onClick={() => setShowcase('favorites')}
                >
                  My Favorites
                </button>
                <button
                  className={`filter-btn${showcase === 'watchlist' ? ' active' : ''}`}
                  onClick={() => setShowcase('watchlist')}
                >
                  My Watchlist
                </button>
              </div>
              {/* Search & Filter Bar */}
              <div className="search-filter-bar">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by movie, actor, actress, director..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <button className="filter-btn" onClick={() => setShowFilter(v => !v)}>
                  <FaFilter /> Filters
                </button>
              </div>
              {showFilter && (
                <div className="filter-panel">
                  <div>
                    <label>Category:</label>
                    <select value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}>
                      <option value="">All</option>
                      {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Actor:</label>
                    <select value={filter.actor} onChange={e => setFilter(f => ({ ...f, actor: e.target.value }))}>
                      <option value="">All</option>
                      {uniqueActors.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Actress:</label>
                    <select value={filter.actress} onChange={e => setFilter(f => ({ ...f, actress: e.target.value }))}>
                      <option value="">All</option>
                      {uniqueActresses.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Director:</label>
                    <select value={filter.director} onChange={e => setFilter(f => ({ ...f, director: e.target.value }))}>
                      <option value="">All</option>
                      {uniqueDirectors.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Rating:</label>
                    <select value={filter.rating} onChange={e => setFilter(f => ({ ...f, rating: e.target.value }))}>
                      <option value="">All</option>
                      <option value="high">High (7+)</option>
                      <option value="low">Low (&lt;7)</option>
                    </select>
                  </div>
                  <div>
                    <label>Sort by Rating:</label>
                    <select value={filter.ratingOrder} onChange={e => setFilter(f => ({ ...f, ratingOrder: e.target.value }))}>
                      <option value="">None</option>
                      <option value="high">High to Low</option>
                      <option value="low">Low to High</option>
                    </select>
                  </div>
                  <button className="submit-btn" style={{ marginLeft: 16 }} onClick={() => setFilter({ actor: '', actress: '', director: '', rating: '', ratingOrder: '', category: '' })}>Clear Filters</button>
                </div>
              )}
              <section className="movies-section">
                <h3>Movies & Shows</h3>
                <div className="movies-grid">
                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading movies...</p>
                    </div>
                  ) : showcaseMovies.length === 0 ? (
                    <p>No movies found.</p>
                  ) : (
                    showcaseMovies.map((movie) => (
                      <div
                        className="movie-card"
                        key={movie._id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/movies/${movie._id}`)}
                      >
                        <div className="movie-poster">
                          {movie.posterUrl ? (
                            <img src={movie.posterUrl} alt={movie.title} />
                          ) : (
                            <span className="no-image">No Image</span>
                          )}
                        </div>
                        <div className="movie-info">
                          <h4>{movie.title}</h4>
                          <p>
                            <strong>Director:</strong> {movie.director}<br />
                            <strong>Actor:</strong> {movie.actor}<br />
                            <strong>Actress:</strong> {movie.actress}<br />
                            <strong>Genre:</strong> {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genre}<br />
                            <strong>Release:</strong> {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : ''}
                          </p>
                          <div className="movie-meta">
                            <span className="rating-badge">{movie.rating}/10</span>
                            <span className="duration">{movie.duration} min</span>
                          </div>
                          <div className="movie-actions">
                            <button
                              className="icon-btn"
                              title={isFavorite(movie._id) ? "Remove from Favorites" : "Add to Favorites"}
                              onClick={e => { e.stopPropagation(); toggleFavorite(movie._id); }}
                            >
                              {isFavorite(movie._id) ? <FaHeart color="#e50914" /> : <FaRegHeart />}
                            </button>
                            <button
                              className="icon-btn"
                              title={isInWatchlist(movie._id) ? "Remove from Watchlist" : "Add to Watchlist"}
                              onClick={e => { e.stopPropagation(); toggleWatchlist(movie._id); }}
                            >
                              <FaStar color={isInWatchlist(movie._id) ? "#ffd700" : "#fff"} />
                            </button>
                            <button
                              className="icon-btn"
                              title="Write a Review"
                              onClick={e => { e.stopPropagation(); openReviewModal(movie); }}
                            >
                              <FaCommentDots />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
              {/* Review Modal */}
              {reviewModal.open && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <button className="close-btn" onClick={() => setReviewModal({ open: false, movie: null })}>×</button>
                    <h3>Write a Review for {reviewModal.movie.title}</h3>
                    <form onSubmit={submitReview}>
                      <div className="rating-stars">
                        {[1,2,3,4,5].map(num => (
                          <span
                            key={num}
                            onClick={() => setReviewRating(num)}
                            style={{ cursor: 'pointer', color: reviewRating >= num ? '#ffd700' : '#ccc', fontSize: 24 }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <textarea
                        rows={4}
                        placeholder="Write your review..."
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        required
                        style={{ width: '100%', margin: '1rem 0', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
                      />
                      <button type="submit" className="submit-btn">Submit Review</button>
                      {reviewMsg && <div style={{ marginTop: 12, color: 'red' }}>{reviewMsg}</div>}
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Profile */}
          {showProfile && (
            <section className="profile-section">
              <div className="profile-header">
                <div className="profile-avatar">
                  <FaUser />
                </div>
                <div className="profile-info">
                  <h2>{user.firstName || ''} {user.lastName || ''}</h2>
                  <p className="profile-username">@{user.username}</p>
                  <p className="profile-role">{user.role === 'admin' ? 'Administrator' : 'Movie Lover'}</p>
                </div>
                {!editProfile && (
                  <button className="edit-btn" onClick={handleEditProfile} title="Edit Profile">
                    <FaEdit />
                  </button>
                )}
              </div>
              <div className="profile-details">
                {editProfile ? (
                  <form onSubmit={handleProfileSave} className="profile-edit-form">
                    <div>
                      <label>First Name:</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleProfileInputChange}
                      />
                    </div>
                    <div>
                      <label>Last Name:</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editData.lastName}
                        onChange={handleProfileInputChange}
                      />
                    </div>
                    <div>
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleProfileInputChange}
                      />
                    </div>
                    <div>
                      <label>Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleProfileInputChange}
                      />
                    </div>
                    <button type="submit" className="submit-btn">Save</button>
                    <button type="button" className="cancel-btn" onClick={() => setEditProfile(false)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <div>
                      <span>Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div>
                      <span>Phone:</span>
                      <span>{user.phone || '-'}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="user-history">
                <h4>Your Reviews & Ratings</h4>
                {userReviews.length === 0 ? (
                  <p className="no-reviews">You haven't reviewed any movies yet. Start sharing your thoughts!</p>
                ) : (
                  <ul className="user-reviews-list">
                    {userReviews.map((review) => (
                      <li key={review._id} className="user-review-card">
                        <div className="review-movie">
                          {review.movieId?.posterUrl && (
                            <img src={review.movieId.posterUrl} alt={review.movieId.title} className="review-movie-poster" />
                          )}
                          <div>
                            <strong>{review.movieId?.title}</strong>
                            <div className="review-rating">
                              {[1,2,3,4,5].map(num => (
                                <span key={num} style={{ color: review.rating >= num ? '#ffd700' : '#ccc', fontSize: 18 }}>★</span>
                              ))}
                            </div>
                            <div className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="review-text">{review.text}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {/* Comment Modal */}
          {commentModal.open && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="close-btn" onClick={() => setCommentModal({ open: false, review: null })}>×</button>
                <h3>Comment on Review</h3>
                <form onSubmit={submitComment}>
                  <textarea
                    rows={3}
                    placeholder="Write your comment..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    required
                    style={{ width: '100%', margin: '1rem 0', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
                  />
                  <button type="submit" className="submit-btn">Add Comment</button>
                  {commentMsg && <div style={{ marginTop: 12, color: 'red' }}>{commentMsg}</div>}
                </form>
              </div>
            </div>
          )}

          {/* Change Password */}
          {showChangePassword && (
            <section className="change-password-section">
              <h3>Change Password</h3>
              <form className="change-password-form" onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Old Password</label>
                  <input
                    type="password"
                    value={changePasswordData.oldPassword}
                    onChange={e => setChangePasswordData({ ...changePasswordData, oldPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={changePasswordData.newPassword}
                    onChange={e => setChangePasswordData({ ...changePasswordData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Change Password</button>
                {changePasswordMsg && <div className="change-password-msg">{changePasswordMsg}</div>}
              </form>
            </section>
          )}
        </div>
      </main>
      {/* CSS is below */}
        <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .user-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d1b69 100%);
          color: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
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
        .user-menu {
          display: flex;
          gap: 1rem;
        }
        .menu-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          padding: 10px 20px;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          background: linear-gradient(135deg, #e50914, #ff1744);
          transition: all 0.3s ease;
        }
        .menu-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #ff1744, #e50914);
        }
        .menu-icon {
          font-size: 1rem;
        }
        .sidebar {
          width: 200px;
          background: rgba(0,0,0,0.7);
          padding-top: 100px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 10;
        }
        .sidebar-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.1rem;
          padding: 1rem 2rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .sidebar-btn:hover {
          background: rgba(255,255,255,0.08);
        }
        .dashboard-main {
          flex: 1;
          margin-left: 200px;
          padding: 120px 2rem 2rem 2rem;
        }
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .welcome-section {
          text-align: center;
          margin-bottom: 2rem;
        }
        .welcome-section h2 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .welcome-section p {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.7);
        }
        .search-filter-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          flex: 1;
        }
        .search-icon {
          color: #aaa;
          margin-right: 8px;
        }
        .search-box input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1rem;
          outline: none;
          flex: 1;
        }
        .filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #e50914, #ff1744);
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .filter-btn:hover {
          background: linear-gradient(135deg, #ff1744, #e50914);
        }
        .filter-btn.active {
          background: linear-gradient(135deg, #ffd700, #e50914);
          color: #222;
        }
        .filter-panel {
          display: flex;
          gap: 1.5rem;
          background: rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1rem 2rem;
          margin-bottom: 1.5rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        .filter-panel label {
          font-weight: 600;
          margin-right: 6px;
        }
        .filter-panel select {
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 1rem;
          margin-right: 12px;
        }
        .movies-section h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
        }
        .movie-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
        }
        .movie-poster {
          width: 100%;
          height: 320px;
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
        }
        .rating-badge {
          background: rgba(76, 154, 255, 0.2);
          color: #4c9aff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .duration {
          background: rgba(229, 9, 20, 0.15);
          color: #e50914;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .movie-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .icon-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .icon-btn:hover {
          background: rgba(255,255,255,0.08);
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: #181828;
          color: #fff;
          border-radius: 12px;
          padding: 2rem 2rem 1.5rem 2rem;
          min-width: 320px;
          max-width: 400px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.7);
          position: relative;
          text-align: center;
        }
        .close-btn {
          position: absolute;
          top: 12px;
          right: 16px;
          background: none;
          color: #e50914;
          font-size: 1.7rem;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: #ff1744;
        }
        .rating-stars {
          margin: 1rem 0;
        }
        .profile-section {
          background: linear-gradient(135deg, #1a1a2e 60%, #16213e 100%);
          border-radius: 18px;
          padding: 2.5rem 2rem 2rem 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 28px;
          margin-bottom: 1.5rem;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #e50914 60%, #ff6b6b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8rem;
          color: #fff;
          box-shadow: 0 4px 16px rgba(229,9,20,0.18);
        }
        .profile-info h2 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
        }
        .profile-username {
          color: #ffd700;
          font-size: 1.1rem;
          margin-top: 2px;
        }
        .profile-role {
          color: #aaa;
          font-size: 1rem;
          margin-top: 2px;
        }
        .edit-btn {
          background: linear-gradient(135deg, #ffd700 60%, #e50914 100%);
          border: none;
          color: #fff;
          font-size: 1.5rem;
          margin-left: auto;
          cursor: pointer;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(229,9,20,0.10);
          transition: background 0.2s, transform 0.2s;
          outline: none;
        }
        .edit-btn:hover, .edit-btn:focus {
          background: linear-gradient(135deg, #e50914 60%, #ffd700 100%);
          color: #fff;
          transform: scale(1.08) rotate(-10deg);
          box-shadow: 0 4px 16px rgba(229,9,20,0.18);
        }
        .profile-details {
          display: flex;
          gap: 2.5rem;
          margin-bottom: 2rem;
          font-size: 1.08rem;
          flex-wrap: wrap;
        }
        .profile-details div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .profile-details span:first-child {
          color: #aaa;
          font-size: 0.98rem;
        }
        .profile-details span:last-child {
          color: #fff;
          font-weight: 500;
        }
        .profile-edit-form {
          background: rgba(255,255,255,0.04);
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
          padding: 1.5rem 1.5rem 1rem 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 2rem;
          align-items: flex-end;
          flex-wrap: wrap;
          animation: fadeInEdit 0.4s;
        }
        @keyframes fadeInEdit {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .profile-edit-form label {
          font-weight: 600;
          color: #ffd700;
          margin-bottom: 4px;
        }
        .profile-edit-form input {
          padding: 8px 12px;
          border-radius: 7px;
          border: 1.5px solid #ffd700;
          font-size: 1rem;
          margin-top: 2px;
          margin-bottom: 2px;
          background: #181828;
          color: #fff;
          transition: border 0.2s;
        }
        .profile-edit-form input:focus {
          border: 1.5px solid #e50914;
          outline: none;
          background: #23233b;
        }
        .profile-edit-form .submit-btn {
          background: linear-gradient(135deg, #e50914, #ff1744);
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          margin-left: 0;
          margin-right: 10px;
          box-shadow: 0 2px 8px rgba(229,9,20,0.10);
          transition: background 0.2s, transform 0.2s;
        }
        .profile-edit-form .submit-btn:hover {
          background: linear-gradient(135deg, #ff1744, #e50914);
          transform: translateY(-2px) scale(1.04);
        }
        .profile-edit-form .cancel-btn {
          background: #444;
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          margin-left: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          transition: background 0.2s, transform 0.2s;
        }
        .profile-edit-form .cancel-btn:hover {
          background: #222;
          transform: translateY(-2px) scale(1.04);
        }
        .user-history {
          margin-top: 2rem;
        }
        .user-history h4 {
          margin-bottom: 1rem;
          font-size: 1.2rem;
          color: #ffd700;
        }
        .no-reviews {
          color: #aaa;
          font-style: italic;
        }
        .user-reviews-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .user-review-card {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: box-shadow 0.2s;
        }
        .user-review-card:hover {
          box-shadow: 0 4px 16px rgba(229,9,20,0.12);
        }
        .review-movie {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .review-movie-poster {
          width: 60px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          background: #222;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .review-rating {
          margin-top: 2px;
        }
        .review-date {
          font-size: 0.95rem;
          color: #aaa;
          margin-top: 2px;
        }
        .review-text {
          margin-top: 8px;
          font-size: 1.08rem;
          color: #fff;
          background: rgba(0,0,0,0.08);
          border-radius: 8px;
          padding: 10px 14px;
        }
        .change-password-section {
          background: linear-gradient(135deg, #23243a 60%, #1a1a2e 100%);
          border-radius: 18px;
          padding: 2.5rem 2rem 2rem 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeInEdit 0.5s;
        }
        .change-password-section h3 {
          color:rgb(244, 243, 238);
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
          letter-spacing: 1px;
        }
        .change-password-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .change-password-form .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .change-password-form label {
          font-weight: 600;
          color:rgb(243, 242, 237);
          margin-bottom: 2px;
        }
        .change-password-form input {
          padding: 10px 14px;
          border-radius: 7px;
          border: 1.5px solid #ffd700;
          font-size: 1rem;
          background: #181828;
          color: #fff;
          transition: border 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 4px rgba(229,9,20,0.08);
        }
        .change-password-form input:focus {
          border: 1.5px solid #e50914;
          outline: none;
          background: #23233b;
          box-shadow: 0 2px 8px rgba(229,9,20,0.12);
        }
        .change-password-form .submit-btn {
          background: linear-gradient(135deg, #e50914, #ff1744);
          color: #fff;
          border: none;
          padding: 12px 0;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1.1rem;
          margin-top: 10px;
          box-shadow: 0 2px 8px rgba(229,9,20,0.10);
          transition: background 0.2s, transform 0.2s;
          width: 100%;
          letter-spacing: 1px;
        }
        .change-password-form .submit-btn:hover {
          background: linear-gradient(135deg, #ff1744, #e50914);
          transform: translateY(-2px) scale(1.04);
        }
        .change-password-msg {
          margin-top: 1rem;
          color: #ffd700;
          font-weight: 600;
          text-align: center;
          background: rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 10px 0;
          animation: fadeInEdit 0.4s;
        }

        /* Responsive Styles */
        @media (max-width: 900px) {
          .dashboard-main {
            margin-left: 0;
            padding: 110px 1rem 1rem 1rem;
          }
          .sidebar {
            position: static;
            width: 100%;
            flex-direction: row;
            gap: 0.5rem;
            padding: 0.5rem 0.5rem 0.5rem 0.5rem;
            min-height: unset;
            background: rgba(0,0,0,0.85);
            justify-content: center;
            align-items: center;
          }
          .sidebar-btn {
            font-size: 1rem;
            padding: 0.7rem 1rem;
            justify-content: center;
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
          .user-menu {
            gap: 0.5rem;
          }
          .menu-btn {
            padding: 7px 12px;
            font-size: 0.95rem;
          }
          .sidebar {
            flex-direction: row;
            width: 100%;
            padding: 0.5rem 0.2rem;
            gap: 0.2rem;
            min-height: unset;
            position: static;
            background: rgba(0,0,0,0.95);
          }
          .sidebar-btn {
            font-size: 0.95rem;
            padding: 0.5rem 0.7rem;
          }
          .dashboard-main {
            padding: 90px 0.2rem 1rem 0.2rem;
          }
          .dashboard-container {
            max-width: 100vw;
            padding: 0;
          }
          .movies-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .movie-poster {
            height: 200px;
          }
          .movie-info {
            padding: 0.7rem;
          }
          .profile-section {
            padding: 1.2rem 0.5rem 1rem 0.5rem;
            max-width: 100vw;
          }
          .profile-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
          .profile-avatar {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }
          .profile-info h2 {
            font-size: 1.2rem;
          }
          .profile-username, .profile-role {
            font-size: 0.95rem;
          }
          .edit-btn {
            width: 34px;
            height: 34px;
            font-size: 1.1rem;
          }
          .profile-details {
            gap: 1rem;
            font-size: 0.98rem;
          }
          .profile-edit-form {
            gap: 1rem;
            padding: 1rem 0.5rem 0.5rem 0.5rem;
          }
          .user-history {
            margin-top: 1rem;
          }
          .user-review-card {
            padding: 10px 8px;
            gap: 6px;
          }
          .review-movie-poster {
            width: 40px;
            height: 55px;
          }
          .change-password-section {
            padding: 1.2rem 0.5rem 1rem 0.5rem;
            max-width: 100vw;
          }
        }
      `}</style>
    </div>
  );
};

export default UserHome;