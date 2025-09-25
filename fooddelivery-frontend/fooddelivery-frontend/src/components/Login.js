import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import api from '../api/client';

const Login = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'login') {
        const { data } = await api.post('/api/auth/login', { phone, password });
        localStorage.setItem('token', data.token);
        onLogin(data.user);
      } else {
        const { data } = await api.post('/api/auth/register', { phone, name, email, password });
        localStorage.setItem('token', data.token);
        onLogin(data.user);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🍕 FoodDelivery</h1>
          <p>Welcome back! Please sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
              />
            </div>
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
              </>
            )}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>

            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>

            <div className="demo-accounts">
              <button type="button" className="back-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default Login;