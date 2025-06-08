// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
// import '../styles/signup.css';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     email: '',
//     phone: '',
//     password: '',
//   });

//   const [message, setMessage] = useState(null); // For success or error messages
//   const [isError, setIsError] = useState(false); // To differentiate styles for error/success

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(null); // Clear previous messages

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^[0-9]{10}$/;

//     if (!emailRegex.test(formData.email)) {
//       setIsError(true);
//       setMessage('Please enter a valid email.');
//       return;
//     }
//     if (!phoneRegex.test(formData.phone)) {
//       setIsError(true);
//       setMessage('Please enter a valid 10-digit phone number.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/signup', formData);
//       setMessage(response.data.message);
//       setIsError(!response.data.success);
//       if (response.data.success) {
//         // Redirect after a short delay to show the success message
//         setTimeout(() => {
//           navigate('/login');
//         }, 1500);
//       }
//     } catch (error) {
//       setIsError(true);
//       setMessage('Error during signup. Please try again.');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="info-section">
//         <h1>Welcome to MovieReviewApp!</h1>
//         <p>
//           Share your reviews, explore trending movies and TV shows, and connect with other film enthusiasts. Signup now
//           and start your journey in the world of cinematic discussions!
//         </p>
//         {/* <img
//           src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80"
//           alt="User signing up"
//           className="info-image"
//         /> */}
//       </div>
//       <form onSubmit={handleSubmit} className="signup-form">
//         <h2>Create an Account</h2>
        
//         {/* Message display */}
//         {message && (
//           <div className={isError ? 'message error' : 'message success'}>
//             {message}
//           </div>
//         )}

//         <div className="form-group">
//           <FaUser className="input-icon" />
//           <input
//             type="text"
//             name="firstName"
//             placeholder="First Name"
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <FaUser className="input-icon" />
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Last Name"
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <FaUser className="input-icon" />
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <FaEnvelope className="input-icon" />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <FaPhone className="input-icon" />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone Number"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <FaLock className="input-icon" />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit" className="btn-submit">Signup</button>
//         <button type="button" onClick={() => navigate('/login')} className="btn-login">
//           Already have an account? Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import '../styles/signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const [message, setMessage] = useState(null); // For success or error messages
  const [isError, setIsError] = useState(false); // To differentiate styles for error/success

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(formData.email)) {
      setIsError(true);
      setMessage('Please enter a valid email.');
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      setIsError(true);
      setMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      // Use REACT_APP_API_BASE_URL from environment variables
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/signup`,
        formData
      );
      setMessage(response.data.message);
      setIsError(!response.data.success);
      if (response.data.success) {
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      setIsError(true);
      setMessage('Error during signup. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <div className="info-section">
        <h1>Welcome to StreamReview!</h1>
        <p>
          Share your reviews, explore trending movies and TV shows, and connect with other film enthusiasts. Signup now
          and start your journey in the world of cinematic discussions!
        </p>
        {/* Optional Info Image */}
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create an Account</h2>

        {/* Message display */}
        {message && (
          <div className={isError ? 'message error' : 'message success'}>
            {message}
          </div>
        )}

        <div className="form-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <FaPhone className="input-icon" />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Signup</button>
        <button type="button" onClick={() => navigate('/login')} className="btn-login">
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
