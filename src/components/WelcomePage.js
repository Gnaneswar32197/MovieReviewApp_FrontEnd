import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/bg.jpg'; // adjust path accordingly
import '../styles/welcome.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const heroStyle = {
    position: 'relative',
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: '20px',
  };

  return (
    <div className="welcome-page">
      <div className="hero-section" style={heroStyle}>
        <div className="overlay" style={overlayStyle}></div>
        <div className="content" style={contentStyle}>
          <h1 className="title">
            Welcome to <span className="highlight">StreamReview</span>
          </h1>
          <p className="subtitle">
            Your ultimate destination to explore, review, and connect over movies and TV shows.
          </p>
          <div className="buttons">
            <button onClick={() => navigate('/signup')} className="btn primary-btn">
              Get Started
            </button>
            <button onClick={() => navigate('/login')} className="btn secondary-btn">
              Login
            </button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Explore Features</h2>
        <div className="features-grid">
          {[
            { icon: '🎥', title: 'Dynamic Reviews' },
            { icon: '🌟', title: 'Personalized Dashboards' },
            { icon: '🔥', title: 'Trending Reviews' },
            { icon: '💬', title: 'Community Engagement' },
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
