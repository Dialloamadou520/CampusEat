import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  {
    id: '1',
    email: 'etudiant@campus.edu',
    password: 'etudiant123',
    role: 'student',
    name: 'Jean Dupont',
    studentId: 'ETU2024001',
    tickets: {
      breakfast: 0,
      lunch: 0,
      dinner: 0
    },
    quota: 20
  },
  {
    id: '2',
    email: 'agent@campus.edu',
    password: 'agent123',
    role: 'agent',
    name: 'Marie Martin',
    agentId: 'AGT001'
  },
  {
    id: '3',
    email: 'admin@campus.edu',
    password: 'admin123',
    role: 'admin',
    name: 'Pierre Administrateur',
    adminId: 'ADM001'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const stored = localStorage.getItem('campuseat_registered_users');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('campuseat_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const allUsers = [...DEMO_USERS, ...registeredUsers];
    const foundUser = allUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('campuseat_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, error: 'Email ou mot de passe incorrect' };
  };

  const register = (userData) => {
    const allUsers = [...DEMO_USERS, ...registeredUsers];
    
    if (allUsers.find(u => u.email === userData.email)) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }

    if (allUsers.find(u => u.studentId === userData.studentId)) {
      return { success: false, error: 'Ce numéro étudiant est déjà utilisé' };
    }

    const newUser = {
      id: `student-${Date.now()}`,
      email: userData.email,
      password: userData.password,
      role: 'student',
      name: userData.name,
      studentId: userData.studentId,
      tickets: {
        breakfast: 0,
        lunch: 0,
        dinner: 0
      },
      quota: 20
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('campuseat_registered_users', JSON.stringify(updatedUsers));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campuseat_user');
  };

  const updateTicketBalance = (newBalance) => {
    if (user && user.role === 'student') {
      const updatedUser = { ...user, tickets: newBalance };
      setUser(updatedUser);
      localStorage.setItem('campuseat_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateTicketBalance, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
