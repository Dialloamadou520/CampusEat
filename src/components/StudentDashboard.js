import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, History, TrendingUp, Calendar, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from './Navbar';
import PurchaseTickets from './PurchaseTickets';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { transactions } = useData();
  const [qrData, setQrData] = useState('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (user) {
      const data = JSON.stringify({
        studentId: user.studentId,
        name: user.name,
        timestamp: Date.now()
      });
      setQrData(data);
    }
  }, [user]);

  const studentTransactions = transactions
    .filter(t => t.studentId === user?.studentId)
    .slice(0, 10);

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const weekCount = transactions.filter(
    t => t.studentId === user?.studentId && new Date(t.date) >= thisWeek
  ).length;

  const thisMonth = new Date();
  thisMonth.setDate(1);
  const monthCount = transactions.filter(
    t => t.studentId === user?.studentId && new Date(t.date) >= thisMonth
  ).length;

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Tableau de bord étudiant</h1>
            <p>Bienvenue, {user?.name}</p>
          </div>
          <button className="purchase-tickets-btn" onClick={() => setShowPurchaseModal(true)}>
            <ShoppingCart size={20} />
            Acheter des tickets
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon breakfast">
              <span style={{ fontSize: '1.5rem' }}>🌅</span>
            </div>
            <div className="stat-info">
              <span className="stat-label">Petit-déjeuner</span>
              <span className="stat-value">{user?.tickets?.breakfast || 0}</span>
              <span className="stat-subtitle">6h - 9h</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon lunch">
              <span style={{ fontSize: '1.5rem' }}>☀️</span>
            </div>
            <div className="stat-info">
              <span className="stat-label">Déjeuner</span>
              <span className="stat-value">{user?.tickets?.lunch || 0}</span>
              <span className="stat-subtitle">12h - 15h</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon dinner">
              <span style={{ fontSize: '1.5rem' }}>🌙</span>
            </div>
            <div className="stat-info">
              <span className="stat-label">Dîner</span>
              <span className="stat-value">{user?.tickets?.dinner || 0}</span>
              <span className="stat-subtitle">18h - 21h</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon week">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Cette semaine</span>
              <span className="stat-value">{weekCount}</span>
              <span className="stat-subtitle">repas consommés</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon month">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Ce mois</span>
              <span className="stat-value">{monthCount}</span>
              <span className="stat-subtitle">repas consommés</span>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div className="qr-section">
            <h2>Votre QR Code</h2>
            <p className="qr-description">
              Présentez ce code à l'agent pour valider votre repas
            </p>
            <div className="qr-container">
              {qrData && (
                <QRCodeSVG
                  value={qrData}
                  size={280}
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>
            <div className="student-info">
              <p><strong>ID:</strong> {user?.studentId}</p>
              <p><strong>Nom:</strong> {user?.name}</p>
            </div>
          </div>

          <div className="history-section">
            <div className="section-header">
              <History size={24} />
              <h2>Historique récent</h2>
            </div>
            <div className="transactions-list">
              {studentTransactions.length > 0 ? (
                studentTransactions.map(transaction => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <span className="transaction-restaurant">
                        {transaction.restaurant}
                      </span>
                      <span className="transaction-date">
                        {format(new Date(transaction.date), 'dd/MM/yyyy à HH:mm')}
                      </span>
                    </div>
                    <div className="transaction-status validated">
                      Validé
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Aucune transaction récente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showPurchaseModal && (
        <PurchaseTickets onClose={() => setShowPurchaseModal(false)} />
      )}
    </div>
  );
};

export default StudentDashboard;
