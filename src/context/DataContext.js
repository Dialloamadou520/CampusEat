import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext(null);

const generateInitialTransactions = () => {
  const transactions = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const count = Math.floor(Math.random() * 50) + 100;
    for (let j = 0; j < count; j++) {
      transactions.push({
        id: `txn-${i}-${j}`,
        studentId: `ETU2024${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
        studentName: `Étudiant ${Math.floor(Math.random() * 999)}`,
        date: date.toISOString(),
        restaurant: ['Restaurant Central', 'Cafétéria Sciences', 'Restaurant Droit'][Math.floor(Math.random() * 3)],
        validated: true,
        agentName: ['Marie Martin', 'Paul Durand', 'Sophie Bernard'][Math.floor(Math.random() * 3)]
      });
    }
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem('campuseat_transactions');
    return stored ? JSON.parse(stored) : generateInitialTransactions();
  });

  const [students, setStudents] = useState(() => {
    const stored = localStorage.getItem('campuseat_students');
    if (stored) return JSON.parse(stored);
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `ETU2024${String(i + 1).padStart(3, '0')}`,
      name: `Étudiant ${i + 1}`,
      email: `etudiant${i + 1}@campus.edu`,
      tickets: {
        breakfast: 0,
        lunch: 0,
        dinner: 0
      },
      quota: 20,
      active: true
    }));
  });

  const [purchases, setPurchases] = useState(() => {
    const stored = localStorage.getItem('campuseat_purchases');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('campuseat_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('campuseat_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('campuseat_purchases', JSON.stringify(purchases));
  }, [purchases]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: `txn-${Date.now()}`,
      date: new Date().toISOString(),
      validated: true
    };
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateStudentQuota = (studentId, newQuota) => {
    setStudents(prev => 
      prev.map(s => s.id === studentId ? { ...s, quota: newQuota } : s)
    );
  };

  const updateStudentBalance = (studentId, newBalance) => {
    setStudents(prev => 
      prev.map(s => s.id === studentId ? { ...s, tickets: newBalance } : s)
    );
  };

  const deductTicket = (studentId, mealType) => {
    setStudents(prev => 
      prev.map(s => {
        if (s.id === studentId) {
          const currentTickets = s.tickets || { breakfast: 0, lunch: 0, dinner: 0 };
          return {
            ...s,
            tickets: {
              ...currentTickets,
              [mealType]: Math.max(0, (currentTickets[mealType] || 0) - 1)
            }
          };
        }
        return s;
      })
    );
  };

  const addPurchase = (purchase) => {
    const newPurchase = {
      ...purchase,
      id: `purchase-${Date.now()}`,
      date: new Date().toISOString()
    };
    setPurchases(prev => [newPurchase, ...prev]);
    return newPurchase;
  };

  const getStatistics = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    });

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekTransactions = transactions.filter(t => new Date(t.date) >= thisWeek);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthTransactions = transactions.filter(t => new Date(t.date) >= thisMonth);

    return {
      today: todayTransactions.length,
      week: weekTransactions.length,
      month: monthTransactions.length,
      total: transactions.length,
      activeStudents: students.filter(s => s.active).length,
      totalStudents: students.length
    };
  };

  return (
    <DataContext.Provider value={{
      transactions,
      students,
      purchases,
      addTransaction,
      updateStudentQuota,
      updateStudentBalance,
      deductTicket,
      addPurchase,
      getStatistics
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
