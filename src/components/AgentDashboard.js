import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Scan, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from './Navbar';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const { user, updateTicketBalance } = useAuth();
  const { addTransaction, students, deductTicket } = useData();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [recentValidations, setRecentValidations] = useState([]);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanner]);

  const startScanning = () => {
    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      html5QrcodeScanner.render(onScanSuccess, onScanError);
      setScanner(html5QrcodeScanner);
    }, 100);
  };

  const getMealTypeFromTime = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 9) return 'breakfast';
    if (hour >= 12 && hour < 15) return 'lunch';
    if (hour >= 18 && hour < 21) return 'dinner';
    return null;
  };

  const getMealTypeName = (type) => {
    const names = {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner',
      dinner: 'Dîner'
    };
    return names[type] || type;
  };

  const onScanSuccess = (decodedText) => {
    try {
      const data = JSON.parse(decodedText);
      const currentMealType = getMealTypeFromTime();
      
      if (!currentMealType) {
        setScanResult({
          success: false,
          message: 'Hors des heures de service',
          details: 'Les repas sont servis : 6h-9h, 12h-15h, 18h-21h'
        });
        return;
      }

      if (data.mealType !== currentMealType) {
        setScanResult({
          success: false,
          message: `Type de repas incorrect`,
          details: `QR Code pour ${getMealTypeName(data.mealType)}, mais c'est l'heure du ${getMealTypeName(currentMealType)}`
        });
        return;
      }
      
      const student = students.find(s => s.studentId === data.studentId);
      
      if (!student) {
        setScanResult({
          success: false,
          message: 'Étudiant non trouvé',
          studentId: data.studentId
        });
        return;
      }

      const ticketBalance = student.tickets?.[currentMealType] || 0;
      if (ticketBalance <= 0) {
        setScanResult({
          success: false,
          message: `Solde de tickets ${getMealTypeName(currentMealType)} insuffisant`,
          student: student,
          mealType: currentMealType
        });
        return;
      }

      const transaction = addTransaction({
        studentId: student.id,
        studentName: student.name,
        restaurant: 'Restaurant Central',
        agentName: user.name,
        mealType: currentMealType
      });

      deductTicket(student.id, currentMealType);

      const storedUser = localStorage.getItem('campuseat_user');
      if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        if (currentUser.studentId === data.studentId) {
          const updatedTickets = {
            ...currentUser.tickets,
            [currentMealType]: Math.max(0, (currentUser.tickets?.[currentMealType] || 0) - 1)
          };
          updateTicketBalance(updatedTickets);
        }
      }

      const validation = {
        id: transaction.id,
        studentName: student.name,
        studentId: student.id,
        mealType: currentMealType,
        time: new Date(),
        success: true
      };

      setRecentValidations(prev => [validation, ...prev.slice(0, 9)]);

      setScanResult({
        success: true,
        message: `Ticket ${getMealTypeName(currentMealType)} validé avec succès`,
        student: student,
        mealType: currentMealType
      });

      if (scanner) {
        scanner.clear().catch(console.error);
      }
      setScanning(false);
    } catch (error) {
      setScanResult({
        success: false,
        message: 'QR Code invalide',
        error: error.message
      });
    }
  };

  const onScanError = (error) => {
    console.log('Scan error:', error);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().catch(console.error);
    }
    setScanning(false);
  };

  const todayValidations = recentValidations.filter(v => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const vDate = new Date(v.time);
    vDate.setHours(0, 0, 0, 0);
    return vDate.getTime() === today.getTime();
  }).length;

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Interface Agent</h1>
          <p>Validation des tickets repas</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon success">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Validations aujourd'hui</span>
              <span className="stat-value">{todayValidations}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon total">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total validations</span>
              <span className="stat-value">{recentValidations.length}</span>
            </div>
          </div>
        </div>

        <div className="scanner-section">
          <div className="scanner-card">
            <h2>Scanner QR Code</h2>
            
            {!scanning && !scanResult && (
              <div className="scanner-placeholder">
                <Scan size={64} className="scan-icon" />
                <p>Cliquez sur le bouton pour démarrer le scan</p>
                <button onClick={startScanning} className="scan-button">
                  <Scan size={20} />
                  Démarrer le scan
                </button>
              </div>
            )}

            {scanning && (
              <div className="scanner-active">
                <div id="qr-reader"></div>
                <button onClick={stopScanning} className="stop-button">
                  Arrêter le scan
                </button>
              </div>
            )}

            {scanResult && (
              <div className={`scan-result ${scanResult.success ? 'success' : 'error'}`}>
                <div className="result-icon">
                  {scanResult.success ? (
                    <CheckCircle size={64} />
                  ) : (
                    <XCircle size={64} />
                  )}
                </div>
                <h3>{scanResult.message}</h3>
                {scanResult.details && (
                  <p className="result-details">{scanResult.details}</p>
                )}
                {scanResult.student && (
                  <div className="student-details">
                    <p><strong>Nom:</strong> {scanResult.student.name}</p>
                    <p><strong>ID:</strong> {scanResult.student.id}</p>
                    {scanResult.success && scanResult.mealType && (
                      <p><strong>Tickets {getMealTypeName(scanResult.mealType)} restants:</strong> {(scanResult.student.tickets?.[scanResult.mealType] || 0) - 1}</p>
                    )}
                  </div>
                )}
                <button onClick={() => {
                  setScanResult(null);
                  startScanning();
                }} className="scan-button">
                  Scanner un autre ticket
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="validations-section">
          <div className="section-header">
            <Clock size={24} />
            <h2>Validations récentes</h2>
          </div>
          <div className="validations-list">
            {recentValidations.length > 0 ? (
              recentValidations.map(validation => (
                <div key={validation.id} className="validation-item">
                  <div className="validation-icon success">
                    <CheckCircle size={20} />
                  </div>
                  <div className="validation-info">
                    <span className="validation-name">{validation.studentName}</span>
                    <span className="validation-id">{validation.studentId}</span>
                  </div>
                  <span className="validation-time">
                    {format(validation.time, 'HH:mm:ss')}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Aucune validation récente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
