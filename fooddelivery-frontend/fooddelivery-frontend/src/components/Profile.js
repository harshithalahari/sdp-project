import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        // Fallback to localStorage data
        setUser({
          name: localStorage.getItem('userName') || 'Customer',
          phone: localStorage.getItem('phone') || 'Not available',
          email: localStorage.getItem('userEmail') || 'Not provided'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage data
      setUser({
        name: localStorage.getItem('userName') || 'Customer',
        phone: localStorage.getItem('phone') || 'Not available',
        email: localStorage.getItem('userEmail') || 'Not provided'
      });
    }
    setLoading(false);
  };

  const fetchUserOrders = async () => {
    try {
      // Mock orders data - replace with actual API call
      const mockOrders = [
        { id: 1, date: '2025-01-22', total: 450, status: 'Delivered', items: ['Pizza', 'Coke'] },
        { id: 2, date: '2025-01-20', total: 320, status: 'Delivered', items: ['Burger', 'Fries'] }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:8082/api/auth/profile', 
        { name: user.name, email: user.email }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessage('Profile updated successfully!');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        setIsEditing(false);
      }
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>👤 My Profile</h2>
        <button 
          className={`edit-btn ${isEditing ? 'save-btn' : ''}`}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? '💾 Save' : '✏️ Edit'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="profile-card">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        
        <div className="profile-info">
          <div className="form-group">
            <label>Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="form-input"
              />
            ) : (
              <p className="info-value">{user.name}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="form-input"
              />
            ) : (
              <p className="info-value">{user.email}</p>
            )}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <p className="info-value">{user.phone}</p>
            <small className="info-note">Phone number cannot be changed</small>
          </div>

          <div className="form-group">
            <label>Member Since</label>
            <p className="info-value">Today</p>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">0</div>
          <div className="stat-label">Favorites</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">Regular</div>
          <div className="stat-label">Customer Tier</div>
        </div>
      </div>

      <div className="orders-section">
        <h3>📦 Recent Orders</h3>
        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-details">
                  <span className="order-date">{order.date}</span>
                  <span className="order-items">{order.items.join(', ')}</span>
                  <span className="order-total">₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-orders">No orders yet. Start ordering delicious food!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;