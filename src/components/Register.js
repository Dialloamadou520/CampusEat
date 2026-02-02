import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, Mail, Lock, User, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!formData.email.endsWith('@campus.edu')) {
      setError('Veuillez utiliser votre email universitaire (@campus.edu)');
      return;
    }

    const result = registerUser({
      name: formData.name,
      email: formData.email,
      studentId: formData.studentId,
      password: formData.password
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-card">
          <div className="success-message-large">
            <CheckCircle size={64} className="success-icon" />
            <h2>Compte créé avec succès !</h2>
            <p>Vous allez être redirigé vers la page de connexion...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <Utensils size={48} className="logo-icon" />
          </div>
          <h1>Créer un compte</h1>
          <p className="tagline">Rejoignez CampusEat</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">
              <User size={18} />
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jean Dupont"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="studentId">
              <CreditCard size={18} />
              Numéro étudiant
            </label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="ETU2024001"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Email universitaire
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.nom@campus.edu"
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Lock size={18} />
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="register-button">
            Créer mon compte
          </button>
        </form>

        <div className="login-link">
          <p>Vous avez déjà un compte ?</p>
          <Link to="/">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
