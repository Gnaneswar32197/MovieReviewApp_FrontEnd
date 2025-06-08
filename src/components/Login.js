// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaEnvelope, FaLock } from 'react-icons/fa';
// import '../styles/Login.css';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [loading, setLoading] = useState(false);

//   // New states for messages
//   const [message, setMessage] = useState(null);
//   const [isError, setIsError] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null); // Clear previous message

//     try {
//       const response = await axios.post('http://localhost:5000/login', formData);
//       if (response.data.success) {
//         setIsError(false);
//         setMessage(response.data.message);

//         localStorage.setItem('user', JSON.stringify(response.data.user));
//         // Redirect after showing message for 1.5s
//         setTimeout(() => {
//           navigate(response.data.user.role === 'admin' ? '/AdminHome' : '/Home');
//         }, 1500);
//       } else {
//         setIsError(true);
//         setMessage(response.data.message || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       setIsError(true);
//       setMessage('An error occurred. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="info-section">
//         <h1>Welcome to MovieWorld</h1>
//         <p>
//           Dive into the world of movies and TV shows! Share reviews, explore trending
//           titles, and connect with fellow enthusiasts.
//         </p>
//         {/* <img
//           src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80"
//           alt="Cinema Movie Theater"
//           className="info-image"
//         /> */}
//       </div>

//       <div className="form-section">
//         <form onSubmit={handleSubmit} className="login-form">
//           <h2>Login</h2>

//           {/* Message display */}
//           {message && (
//             <div className={isError ? 'message error' : 'message success'}>
//               {message}
//             </div>
//           )}

//           <div className="input-group">
//             <FaEnvelope className="icon" />
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <FaLock className="icon" />
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" disabled={loading} className="btn-submit">
//             {loading ? 'Logging in...' : 'Login'}
//           </button>

//           <div className="extra-links">
//             <a href="/forgot-password">Forgot Password?</a> |{' '}
//             <a href="/signup">Create an Account</a>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  // States for messages
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
const [showForgot, setShowForgot] = useState(false);
const [forgotStep, setForgotStep] = useState(1);
const [forgotEmail, setForgotEmail] = useState('');
const [forgotOtp, setForgotOtp] = useState('');
const [forgotNewPass, setForgotNewPass] = useState('');
const [forgotMsg, setForgotMsg] = useState('');
const [forgotLoading, setForgotLoading] = useState(false);


  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Clear previous message

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        formData
      );
      if (response.data.success) {
  setIsError(false);
  setMessage(response.data.message);

  localStorage.setItem('user', JSON.stringify(response.data.user)); // <-- THIS IS CORRECT

  // Redirect after showing message for 1.5s
  setTimeout(() => {
    navigate(response.data.user.role === 'admin' ? '/AdminHome' : '/UserHome');
  }, 1500);
      } else {
        setIsError(true);
        setMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsError(true);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e) => {
  e.preventDefault();
  setForgotLoading(true);
  setForgotMsg('');
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/forgot-password`, { email: forgotEmail });
    setForgotMsg(res.data.message);
    setForgotStep(2);
  } catch (err) {
    setForgotMsg(err.response?.data?.message || 'Error sending OTP');
  } finally {
    setForgotLoading(false);
  }
};

const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setForgotLoading(true);
  setForgotMsg('');
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify-otp`, { email: forgotEmail, otp: forgotOtp });
    setForgotMsg(res.data.message);
    setForgotStep(3);
  } catch (err) {
    setForgotMsg(err.response?.data?.message || 'Invalid OTP');
  } finally {
    setForgotLoading(false);
  }
};

const handleResetPassword = async (e) => {
  e.preventDefault();
  setForgotLoading(true);
  setForgotMsg('');
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password`, { email: forgotEmail, otp: forgotOtp, newPassword: forgotNewPass });
    setForgotMsg(res.data.message);
    setForgotStep(4);
  } catch (err) {
    setForgotMsg(err.response?.data?.message || 'Error resetting password');
  } finally {
    setForgotLoading(false);
  }
};

  return (
  <div className="login-container">
    <div className="info-section">
      <h1>Welcome to StreamReview</h1>
      <p>
        Dive into the world of movies and TV shows! Share reviews, explore trending
        titles, and connect with fellow enthusiasts.
      </p>
      {/* <img ... /> */}
    </div>

    <div className="form-section">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>

        {/* Message display */}
        {message && (
          <div className={isError ? 'message error' : 'message success'}>
            {message}
          </div>
        )}

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="extra-links">
          <span
            className="forgot-link"
            style={{ cursor: 'pointer', color: '#4c9aff' }}
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </span>
          {' | '}
          <a href="/signup">Create an Account</a>
        </div>
      </form>

      {/* Forgot Password Modal */}
      {showForgot && (
  <div className="forgot-modal">
    <div className="forgot-content">
      <button
        className="close-btn"
        onClick={() => {
          setShowForgot(false);
          setForgotStep(1);
          setForgotMsg('');
          setForgotEmail('');
          setForgotOtp('');
          setForgotNewPass('');
        }}
      >×</button>
      <h3>Forgot Password</h3>
      {forgotStep === 1 && (
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={forgotLoading}>
            {forgotLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}
      {forgotStep === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={forgotOtp}
            onChange={e => setForgotOtp(e.target.value)}
            required
          />
          <button type="submit" disabled={forgotLoading}>
            {forgotLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
      {forgotStep === 3 && (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Enter new password"
            value={forgotNewPass}
            onChange={e => setForgotNewPass(e.target.value)}
            required
          />
          <button type="submit" disabled={forgotLoading}>
            {forgotLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
      {forgotStep === 4 && (
        <div>
          <p>Password reset successful! You can now log in.</p>
          <button
            onClick={() => {
              setShowForgot(false);
              setForgotStep(1);
              setForgotMsg('');
              setForgotEmail('');
              setForgotOtp('');
              setForgotNewPass('');
            }}
          >
            Close
          </button>
        </div>
      )}
      {forgotMsg && (
        <div style={{ marginTop: 16, color: forgotStep === 4 ? 'green' : 'red', textAlign: 'center' }}>
          {forgotMsg}
        </div>
      )}
    </div>
  </div>
)}
    </div>
  </div>
);
};

export default Login;
