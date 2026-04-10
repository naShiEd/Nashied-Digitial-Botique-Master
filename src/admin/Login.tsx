import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
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

    // Mock authentication
    setTimeout(() => {
      if (username === 'admin' && password === 'nashied2026') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Invalid credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-box glass-effect">
        <div className="login-content">
          <img src="/logo.png" alt="Nashied Logo" className="login-logo" />
          <h1 className="login-title">Admin Access</h1>
          <p className="login-subtitle">Nashied Digital Boutique Portal</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" disabled={isLoading} className="login-button btn-primary">
              {isLoading ? 'Verifying...' : (
                <>
                  Access Dashboard <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>© {new Date().getFullYear()} Nashied. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
