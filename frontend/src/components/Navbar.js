import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          🗳 <span>PollStream</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="btn btn-outline btn-sm">Polls</Link>
          <Link to="/analytics" className="btn btn-outline btn-sm">Analytics</Link>
          {user ? (
            <>
              <Link to="/admin" className="btn btn-outline btn-sm">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-primary btn-sm">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
