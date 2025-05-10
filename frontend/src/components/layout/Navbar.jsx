import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow py-3 sticky-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold text-white">
          📚 SmartBook
        </Link>

        <button className="navbar-toggler" type="button" onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-md-0 d-flex flex-wrap gap-3">
            {/* 📘 Books Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                📘 Books
              </button>
              <ul className="dropdown-menu dropdown-menu-dark">
                {user && (
                  <>
                    <li><Link className="dropdown-item" to="/library" onClick={closeMenu}>📚 Library</Link></li>
                    <li><Link className="dropdown-item" to="/recommendations" onClick={closeMenu}>💡 Recommended</Link></li>
                    <li><Link className="dropdown-item" to="/top" onClick={closeMenu}>📈 Top Books</Link></li>
                    <li><Link className="dropdown-item" to="/recent" onClick={closeMenu}>🕒 Recently Read</Link></li>
                  </>
                )}
                <li><Link className="dropdown-item" to="/public" onClick={closeMenu}>🔍 Explore</Link></li>
              </ul>
            </li>

            {/* 🧠 Insights Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                🧠 Insights
              </button>
              <ul className="dropdown-menu dropdown-menu-dark">
                {user && (
                  <li><Link className="dropdown-item" to="/analytics" onClick={closeMenu}>📊 Analytics</Link></li>
                )}
                <li><Link className="dropdown-item" to="/leaderboard" onClick={closeMenu}>🏆 Leaderboard</Link></li>
                <li><Link className="dropdown-item" to="/popular" onClick={closeMenu}>🔥 Popular Books</Link></li>
              </ul>
            </li>

            {/* 🧾 Upload */}
            {user && (
              <li className="nav-item">
                <Link to="/upload" className="nav-link text-white" onClick={closeMenu}>🧾 Upload</Link>
              </li>
            )}
          </ul>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="rounded-circle border border-white"
                    style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                  />
                )}
                <span className="text-white fw-semibold">{user.fullName}</span>
                <Link to="/dashboard" className="btn btn-outline-light btn-sm" onClick={closeMenu}>Dashboard</Link>
                <Link to="/profile" className="btn btn-outline-light btn-sm" onClick={closeMenu}>Profile</Link>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  🔓 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="btn btn-outline-light btn-sm" onClick={closeMenu}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
