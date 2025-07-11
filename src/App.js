import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import SignupPage from './components/Signup';
import LoginPage from './components/Login';
import UserHome from './components/UserHome';
import AdminHome from './components/AdminHome';
import ManageUsers from './components/ManageUsers';
import ManageMovies from './components/ManageMovies';
import MovieDetails from './components/MovieDetails';
// ...existing code...
import ManageReviews from './components/ManageReviews';
import AdminAnalytics from './components/Admin_analytics'; // <-- Corrected path
// ...existing code...
import ManageTrending from './components/ManageTrending';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/UserHome" element={<UserHome />} />
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/ManageMovies" element={<ManageMovies />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route path="/ManageReviews" element={<ManageReviews />} />
                <Route path="/Admin_analytics" element={<AdminAnalytics />} />
                <Route path="/admin/trending" element={<ManageTrending />} />
            </Routes>
        </Router>
    );
}
export default App;
