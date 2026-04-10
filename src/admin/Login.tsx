import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'admin' && password === 'nashied2026') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      {/* Background glow blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-header">
          <img src="/logo-white.png" alt="Nashied" className="login-logo" />
          <div>
            <h1>Admin Portal</h1>
            <p>Nashied Digital Boutique CMS</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="input-icon"><User size={16} /></div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <div className="input-icon"><Lock size={16} /></div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? (
              <span className="login-spinner" />
            ) : (
              <>Access Dashboard <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} Nashied Digital Boutique. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
