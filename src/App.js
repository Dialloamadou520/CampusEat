import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import AgentDashboard from './components/AgentDashboard';
import AdminDashboard from './components/AdminDashboard';
import PaymentCallback from './components/PaymentCallback';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#6b7280'
      }}>
        Chargement...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'agent':
      return <AgentDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardRouter />
                </PrivateRoute>
              }
            />
            <Route 
              path="/payment/success" 
              element={
                <PrivateRoute>
                  <PaymentCallback status="success" />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/payment/error" 
              element={
                <PrivateRoute>
                  <PaymentCallback status="error" />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/payment/cancel" 
              element={
                <PrivateRoute>
                  <PaymentCallback status="cancel" />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
