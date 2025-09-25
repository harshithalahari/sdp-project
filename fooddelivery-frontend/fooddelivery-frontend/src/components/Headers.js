import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Headers.css';

const Header = ({ user, cartItemsCount, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    onLogout();
    navigate("/login"); // Redirect after logout
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/menu">
            <h1>🍕 FoodDelivery</h1>
          </Link>
        </div>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          {user?.role === 'ADMIN' ? (
            // Admin Navigation
            <>
              <Link 
                to="/admin" 
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                🏪 Admin Dashboard
              </Link>
              
              <Link 
                to="/menu" 
                className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                🍽️ View Menu
              </Link>
            </>
          ) : (
            // Customer Navigation
            <>
              <Link 
                to="/menu" 
                className={`nav-link ${isActive('/menu') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                🍽️ Menu
              </Link>
              
              <Link 
                to="/cart" 
                className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 Cart {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
              </Link>
              
              <Link 
                to="/orders" 
                className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                📋 Orders
              </Link>
            </>
          )}

          <div className="user-menu">
            <span className="user-name">👋 Hello, {user?.name || "Guest"}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
