// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaPlus, FaEdit, FaTrash, FaTimes, FaPlay, FaArrowLeft } from 'react-icons/fa';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// const ManageMovies = () => {
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     director: '',
//     actor: '',
//     actress: '',
//     releaseDate: '', // Use ISO date string
//     rating: '',
//     duration: '',
//     posterUrl: '',
//     genres: [],
//     description: '',
//     active: false,
//   });

//   // Fetch movies from API
//   useEffect(() => {
//     fetchMovies();
//   }, []);

//   const fetchMovies = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE_URL}/api/movies`);
//       setMovies(res.data);
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddMovie = () => {
//     setShowModal(true);
//     setIsEdit(false);
//     setEditId(null);
//     setFormData({
//       title: '',
//       director: '',
//       actor: '',
//       actress: '',
//       releaseDate: '',
//       rating: '',
//       duration: '',
//       posterUrl: '',
//       genres: [],
//       description: '',
//       active: false,
//     });
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setIsEdit(false);
//     setEditId(null);
//     setFormData({
//       title: '',
//       director: '',
//       actor: '',
//       actress: '',
//       releaseDate: '',
//       rating: '',
//       duration: '',
//       posterUrl: '',
//       genres: [],
//       description: '',
//       active: false,
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name === 'genres') {
//       setFormData((prev) => ({
//         ...prev,
//         genres: checked
//           ? [...prev.genres, value]
//           : prev.genres.filter((g) => g !== value),
//       }));
//     } else if (type === 'checkbox') {
//       setFormData((prev) => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Add or Edit movie
//   const handleAddMovieSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEdit && editId) {
//         await axios.put(`${API_BASE_URL}/api/movies/${editId}`, formData);
//       } else {
//         await axios.post(`${API_BASE_URL}/api/movies`, formData);
//       }
//       closeModal();
//       fetchMovies();
//     } catch (error) {
//       console.error('Error saving movie:', error);
//     }
//   };

//   // Show delete confirmation popup
//   const handleDeleteMovie = (movieId) => {
//     setDeleteId(movieId);
//     setShowDeletePopup(true);
//   };

//   // Confirm delete
//   const confirmDeleteMovie = async () => {
//     try {
//       await axios.delete(`${API_BASE_URL}/api/movies/${deleteId}`);
//       setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== deleteId));
//     } catch (error) {
//       console.error('Error deleting movie:', error);
//     } finally {
//       setShowDeletePopup(false);
//       setDeleteId(null);
//     }
//   };

//   // Cancel delete
//   const cancelDelete = () => {
//     setShowDeletePopup(false);
//     setDeleteId(null);
//   };

//   // Edit movie
//   const handleEditMovie = (movieId) => {
//     const movie = movies.find((m) => m._id === movieId);
//     if (movie) {
//       setIsEdit(true);
//       setEditId(movieId);
//       setFormData({
//         title: movie.title || '',
//         director: movie.director || '',
//         actor: movie.actor || '',
//         actress: movie.actress || '',
//         releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : '', // YYYY-MM-DD
//         rating: movie.rating || '',
//         duration: movie.duration || '',
//         posterUrl: movie.posterUrl || '',
//         genres: movie.genres || [],
//         description: movie.description || '',
//         active: movie.active || false,
//       });
//       setShowModal(true);
//     }
//   };

//   const handleBackToDashboard = () => {
//     window.location.href = '/AdminHome';
//   };

//   return (
//     <div className="manage-movies">
//       {/* Header */}
//       <header className="movies-header">
//         <div className="header-content">
//           <div className="brand">
//             <FaPlay className="brand-icon" />
//             <h1>Content Library</h1>
//           </div>
//           <div className="header-buttons">
//             <button className="add-movie-btn" onClick={handleAddMovie}>
//               <FaPlus className="btn-icon" />
//               <span>Add Movie</span>
//             </button>
//             <button className="back-btn" onClick={handleBackToDashboard}>
//               <FaArrowLeft className="btn-icon" />
//               <span>Back to Dashboard</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="movies-main">
//         <div className="movies-container">
//           <div className="section-header">
//             <h2>Movies & Shows Management</h2>
//             <p>Manage your content library efficiently</p>
//           </div>

//           <div className="movies-content">
//             {loading ? (
//               <div className="loading-container">
//                 <div className="loading-spinner"></div>
//                 <p>Loading movies...</p>
//               </div>
//             ) : (
//               <div className="table-container">
//                 <table className="movies-table">
//                   <thead>
//   <tr>
//     <th>#</th>
//     <th>Poster</th>
//     <th>Title</th>
//     <th>Director</th>
//     <th>Actor</th>
//     <th>Actress</th>
//     <th>Genre</th>
//     <th>Release Date</th>
//     <th>Rating</th>
//     <th>Duration</th>
//     <th>Actions</th>
//   </tr>
// </thead>
// <tbody>
//   {movies.map((movie, index) => (
//     <tr key={movie._id}>
//       <td>{index + 1}</td>
//       <td>
//         {movie.posterUrl ? (
//           <img
//             src={movie.posterUrl}
//             alt={movie.title}
//             style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
//           />
//         ) : (
//           <span style={{ color: '#aaa' }}>No Image</span>
//         )}
//       </td>
//       <td className="movie-title">{movie.title}</td>
//       <td>{movie.director}</td>
//       <td>{movie.actor}</td>
//       <td>{movie.actress}</td>
//       <td>
//         <span className="genre-badge">
//           {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genre}
//         </span>
//       </td>
//       <td>
//         {movie.releaseDate
//           ? new Date(movie.releaseDate).toLocaleDateString()
//           : ''}
//       </td>
//       <td>
//         <span className="rating-badge">{movie.rating}/10</span>
//       </td>
//       <td>{movie.duration} min</td>
//       <td>
//         <div className="action-buttons">
//           <button className="edit-btn" onClick={() => handleEditMovie(movie._id)}>
//             <FaEdit />
//           </button>
//           <button className="delete-btn" onClick={() => handleDeleteMovie(movie._id)}>
//             <FaTrash />
//           </button>
//         </div>
//       </td>
//     </tr>
//   ))}
// </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header">
//               <h2>{isEdit ? 'Edit Movie' : 'Add New Movie'}</h2>
//               <button className="modal-close-btn" onClick={closeModal}>
//                 <FaTimes />
//               </button>
//             </div>
//             <form className="movie-form" onSubmit={handleAddMovieSubmit}>
//               <div className="form-grid">
//                 <div className="form-group">
//                   <label htmlFor="title">Movie Title</label>
//                   <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="director">Director</label>
//                   <input type="text" id="director" name="director" value={formData.director} onChange={handleInputChange} required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="actor">Lead Actor</label>
//                   <input type="text" id="actor" name="actor" value={formData.actor} onChange={handleInputChange} required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="actress">Lead Actress</label>
//                   <input type="text" id="actress" name="actress" value={formData.actress} onChange={handleInputChange} required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="releaseDate">Release Date</label>
//                   <input
//                     type="date"
//                     id="releaseDate"
//                     name="releaseDate"
//                     value={formData.releaseDate}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="rating">Rating (0-10)</label>
//                   <input
//                     type="number"
//                     id="rating"
//                     name="rating"
//                     min="0"
//                     max="10"
//                     step="0.1"
//                     value={formData.rating}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="duration">Duration (minutes)</label>
//                   <input type="number" id="duration" name="duration" min="1" value={formData.duration} onChange={handleInputChange} required />
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="posterUrl">Poster URL</label>
//                   <input type="url" id="posterUrl" name="posterUrl" value={formData.posterUrl} onChange={handleInputChange} />
//                 </div>
//               </div>
//               <div className="form-group full-width">
//                 <label>Genres</label>
//                 <div className="genres-grid">
//                   {["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "Western"].map((genre) => (
//                     <label key={genre} className="checkbox-label">
//                       <input
//                         type="checkbox"
//                         name="genres"
//                         value={genre}
//                         checked={formData.genres.includes(genre)}
//                         onChange={handleInputChange}
//                       />
//                       <span className="checkbox-custom"></span>
//                       {genre}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               <div className="form-group full-width">
//                 <label htmlFor="description">Description</label>
//                 <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
//               </div>
//               <div className="form-group full-width">
//                 <label className="checkbox-label toggle-label">
//                   <input type="checkbox" id="active" name="active" checked={formData.active} onChange={handleInputChange} />
//                   <span className="checkbox-custom toggle"></span>
//                   Active Status
//                 </label>
//               </div>
//               <div className="form-actions">
//                 <button type="submit" className="submit-btn">
//                   <FaPlus /> {isEdit ? 'Update Movie' : 'Add Movie'}
//                 </button>
//                 <button type="button" className="cancel-btn" onClick={closeModal}>
//                   <FaTimes /> Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Popup */}
//       {showDeletePopup && (
//         <div className="modal-overlay">
//           <div className="modal-container" style={{ maxWidth: 400, textAlign: 'center', padding: '2rem' }}>
//             <h3>Are you sure you want to delete this movie?</h3>
//             <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
//               <button className="submit-btn" onClick={confirmDeleteMovie}>
//                 Yes, Delete
//               </button>
//               <button className="cancel-btn" onClick={cancelDelete}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaPlay, FaArrowLeft } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    actor: '',
    actress: '',
    releaseDate: '',
    rating: '',
    duration: '',
    posterUrl: '',
    genres: [],
    description: '',
    active: false,
    category: '',
    episodes: '',
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/movies`);
      setMovies(res.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    setShowModal(true);
    setIsEdit(false);
    setEditId(null);
    setFormData({
      title: '',
      director: '',
      actor: '',
      actress: '',
      releaseDate: '',
      rating: '',
      duration: '',
      posterUrl: '',
      genres: [],
      description: '',
      active: false,
      category: '',
      episodes: '',
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditId(null);
    setFormData({
      title: '',
      director: '',
      actor: '',
      actress: '',
      releaseDate: '',
      rating: '',
      duration: '',
      posterUrl: '',
      genres: [],
      description: '',
      active: false,
      category: '',
      episodes: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'genres') {
      setFormData((prev) => ({
        ...prev,
        genres: checked
          ? [...prev.genres, value]
          : prev.genres.filter((g) => g !== value),
      }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'episodes') {
      setFormData((prev) => ({ ...prev, episodes: value.replace(/\D/, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      // Remove episodes if not Anime or Webseries
      if (submitData.category !== 'Anime' && submitData.category !== 'Webseries') {
        delete submitData.episodes;
      }
      if (isEdit && editId) {
        await axios.put(`${API_BASE_URL}/api/movies/${editId}`, submitData);
      } else {
        await axios.post(`${API_BASE_URL}/api/movies`, submitData);
      }
      closeModal();
      fetchMovies();
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  const handleDeleteMovie = (movieId) => {
    setDeleteId(movieId);
    setShowDeletePopup(true);
  };

  const confirmDeleteMovie = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/movies/${deleteId}`);
      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== deleteId));
    } catch (error) {
      console.error('Error deleting movie:', error);
    } finally {
      setShowDeletePopup(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteId(null);
  };

  const handleEditMovie = (movieId) => {
    const movie = movies.find((m) => m._id === movieId);
    if (movie) {
      setIsEdit(true);
      setEditId(movieId);
      setFormData({
        title: movie.title || '',
        director: movie.director || '',
        actor: movie.actor || '',
        actress: movie.actress || '',
        releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : '',
        rating: movie.rating || '',
        duration: movie.duration || '',
        posterUrl: movie.posterUrl || '',
        genres: movie.genres || [],
        description: movie.description || '',
        active: movie.active || false,
        category: movie.category || '',
        episodes: movie.episodes || '',
      });
      setShowModal(true);
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = '/AdminHome';
  };

  return (
    <div className="manage-movies">
      {/* Header */}
      <header className="movies-header">
        <div className="header-content">
          <div className="brand">
            <FaPlay className="brand-icon" />
            <h1>Content Library</h1>
          </div>
          <div className="header-buttons">
            <button className="add-movie-btn" onClick={handleAddMovie}>
              <FaPlus className="btn-icon" />
              <span>Add Movie</span>
            </button>
            <button className="back-btn" onClick={handleBackToDashboard}>
              <FaArrowLeft className="btn-icon" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="movies-main">
        <div className="movies-container">
          <div className="section-header">
            <h2>Movies & Shows Management</h2>
            <p>Manage your content library efficiently</p>
          </div>

          <div className="movies-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading movies...</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="movies-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Poster</th>
                      <th>Title</th>
                      <th>Director</th>
                      <th>Actor</th>
                      <th>Actress</th>
                      <th>Genre</th>
                      <th>Category</th>
                      <th>Episodes</th>
                      <th>Release Date</th>
                      <th>Rating</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map((movie, index) => (
                      <tr key={movie._id}>
                        <td>{index + 1}</td>
                        <td>
                          {movie.posterUrl ? (
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                          ) : (
                            <span style={{ color: '#aaa' }}>No Image</span>
                          )}
                        </td>
                        <td className="movie-title">{movie.title}</td>
                        <td>{movie.director}</td>
                        <td>{movie.actor}</td>
                        <td>{movie.actress}</td>
                        <td>
                          <span className="genre-badge">
                            {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genre}
                          </span>
                        </td>
                        <td>{movie.category || '-'}</td>
                        <td>{(movie.category === 'Anime' || movie.category === 'Webseries') ? movie.episodes : '-'}</td>
                        <td>
                          {movie.releaseDate
                            ? new Date(movie.releaseDate).toLocaleDateString()
                            : ''}
                        </td>
                        <td>
                          <span className="rating-badge">{movie.rating}/10</span>
                        </td>
                        <td>{movie.duration} min</td>
                        <td>
                          <div className="action-buttons">
                            <button className="edit-btn" onClick={() => handleEditMovie(movie._id)}>
                              <FaEdit />
                            </button>
                            <button className="delete-btn" onClick={() => handleDeleteMovie(movie._id)}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      // ...existing code...

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: 400, textAlign: 'center', padding: '2rem' }}>
            <h3>Are you sure you want to delete this movie?</h3>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button className="submit-btn" onClick={confirmDeleteMovie}>
                Yes, Delete
              </button>
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{isEdit ? 'Edit Movie' : 'Add New Movie'}</h2>
              <button className="modal-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <form className="movie-form" onSubmit={handleAddMovieSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">Movie Title</label>
                  <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="director">Director</label>
                  <input type="text" id="director" name="director" value={formData.director} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="actor">Lead Actor</label>
                  <input type="text" id="actor" name="actor" value={formData.actor} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="actress">Lead Actress</label>
                  <input type="text" id="actress" name="actress" value={formData.actress} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="releaseDate">Release Date</label>
                  <input
                    type="date"
                    id="releaseDate"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rating">Rating (0-10)</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input type="number" id="duration" name="duration" min="1" value={formData.duration} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="posterUrl">Poster URL</label>
                  <input type="url" id="posterUrl" name="posterUrl" value={formData.posterUrl} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Hollywood">Hollywood</option>
                    <option value="Bollywood">Bollywood</option>
                    <option value="Tollywood">Tollywood</option>
                    <option value="Kollywood">Kollywood</option>
                    <option value="Anime">Anime</option>
                    <option value="Webseries">Webseries</option>
                    <option value="Sandlewood">Sandlewood</option>
                  </select>
                </div>
                {(formData.category === 'Anime' || formData.category === 'Webseries') && (
                  <div className="form-group">
                    <label htmlFor="episodes">Number of Episodes</label>
                    <input
                      type="number"
                      id="episodes"
                      name="episodes"
                      min="1"
                      value={formData.episodes}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="form-group full-width">
                <label>Genres</label>
                <div className="genres-grid">
                  {["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller","Sports", "Western"].map((genre) => (
                    <label key={genre} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="genres"
                        value={genre}
                        checked={formData.genres.includes(genre)}
                        onChange={handleInputChange}
                      />
                      <span className="checkbox-custom"></span>
                      {genre}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
              </div>
              <div className="form-group full-width">
                <label className="checkbox-label toggle-label">
                  <input type="checkbox" id="active" name="active" checked={formData.active} onChange={handleInputChange} />
                  <span className="checkbox-custom toggle"></span>
                  Active Status
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  <FaPlus /> {isEdit ? 'Update Movie' : 'Add Movie'}
                </button>
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

        .header-buttons {
          display: flex;
          gap: 1rem;
        }

        .add-movie-btn,
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          padding: 12px 24px;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-movie-btn {
          background: linear-gradient(135deg, #e50914, #ff1744);
          box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
        }

        .add-movie-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .btn-icon {
          font-size: 1rem;
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

        .movies-content {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .movies-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #e50914, #ff6b6b, #4c9aff);
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

        .table-container {
          overflow-x: auto;
        }

        .movies-table {
          width: 100%;
          border-collapse: collapse;
          color: white;
        }

        .movies-table th,
        .movies-table td {
          text-align: left;
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .movies-table th {
          background: rgba(255, 255, 255, 0.05);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(255, 255, 255, 0.8);
        }

        .movies-table tbody tr {
          transition: all 0.3s ease;
        }

        .movies-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .movie-title {
          font-weight: 600;
          color: #ffffff;
        }

        .genre-badge {
          background: linear-gradient(135deg, #e50914, #ff6b6b);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .rating-badge {
          background: rgba(76, 154, 255, 0.2);
          color: #4c9aff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .edit-btn,
        .delete-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .edit-btn {
          background: rgba(76, 154, 255, 0.2);
          color: #4c9aff;
        }

        .delete-btn {
          background: rgba(229, 9, 20, 0.2);
          color: #e50914;
        }

        .edit-btn:hover {
          background: rgba(76, 154, 255, 0.3);
          transform: translateY(-2px);
        }

        .delete-btn:hover {
          background: rgba(229, 9, 20, 0.3);
          transform: translateY(-2px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateY(-50px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #e50914, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(90deg);
        }

        .movie-form {
          padding: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #e0e0e0;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group input[type="url"],
        .form-group textarea {
          padding: 12px 16px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #e50914;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .genres-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.8rem;
          margin-top: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .checkbox-label:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .checkbox-label input[type="checkbox"] {
          display: none;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          margin-right: 8px;
          position: relative;
          transition: all 0.3s ease;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
          background: linear-gradient(135deg, #e50914, #ff6b6b);
          border-color: #e50914;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .toggle-label {
          background: rgba(255, 255, 255, 0.05);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .toggle-label .checkbox-custom.toggle {
          width: 50px;
          height: 28px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .toggle-label .checkbox-custom.toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .toggle-label input[type="checkbox"]:checked + .checkbox-custom.toggle {
          background: linear-gradient(135deg, #e50914, #ff6b6b);
        }

        .toggle-label input[type="checkbox"]:checked + .checkbox-custom.toggle::after {
          transform: translateX(22px);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .submit-btn,
        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 12px 24px;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .submit-btn {
          background: linear-gradient(135deg, #e50914, #ff1744);
          color: white;
          box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
        }

        .cancel-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .header-buttons {
            order: -1;
          }

          .add-movie-btn span,
          .back-btn span {
            display: none;
          }

          .movies-main {
            padding: 1rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .genres-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .modal-container {
            width: 95%;
            margin: 20px;
          }

          .table-container {
            overflow-x: scroll;
          }

          .movies-table th,
          .movies-table td {
            padding: 0.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageMovies;

