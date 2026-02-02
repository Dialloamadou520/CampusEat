import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, Mail, Lock, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const demoAccounts = [
    { role: 'Étudiant', email: 'etudiant@campus.edu', password: 'etudiant123' },
    { role: 'Agent', email: 'agent@campus.edu', password: 'agent123' },
    { role: 'Admin', email: 'admin@campus.edu', password: 'admin123' }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <Utensils size={48} className="logo-icon" />
          </div>
          <h1>CampusEat</h1>
          <p className="tagline">Simplifier l'accès, nourrir l'avenir</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@campus.edu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>

        <div className="register-link">
          <p>Vous n'avez pas de compte ?</p>
          <Link to="/register">Créer un compte étudiant</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
