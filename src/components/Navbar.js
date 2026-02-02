import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, LogOut, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student': return 'Étudiant';
      case 'agent': return 'Agent';
      case 'admin': return 'Administrateur';
      default: return '';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Utensils size={28} />
          <span>CampusEat</span>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <User size={20} />
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{getRoleLabel(user?.role)}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
