import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import './PaymentCallback.css';

const PaymentCallback = ({ status }) => {
  const navigate = useNavigate();
  const { user, updateTicketBalance } = useAuth();
  const { addPurchase } = useData();
  const [processing, setProcessing] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processPurchase = async () => {
      const pendingPurchase = localStorage.getItem('pending_purchase');
      
      if (!pendingPurchase) {
        setMessage('Aucune transaction en attente');
        setProcessing(false);
        setTimeout(() => navigate('/dashboard'), 3000);
        return;
      }

      const purchase = JSON.parse(pendingPurchase);

      if (status === 'success') {
        const mealType = purchase.mealType || 'lunch';
        const newBalance = {
          ...user.tickets,
          [mealType]: (user.tickets?.[mealType] || 0) + purchase.tickets
        };
        updateTicketBalance(newBalance);
        
        addPurchase({
          studentId: purchase.studentId,
          studentName: purchase.studentName,
          tickets: purchase.tickets,
          amount: purchase.amount,
          paymentMethod: purchase.paymentMethod,
          mealType: mealType,
          transactionId: purchase.transactionId
        });

        localStorage.removeItem('pending_purchase');
        setMessage('Paiement réussi ! Vos tickets ont été ajoutés à votre compte.');
        
        setTimeout(() => navigate('/dashboard'), 3000);
      } else if (status === 'error') {
        localStorage.removeItem('pending_purchase');
        setMessage('Le paiement a échoué. Veuillez réessayer.');
        setTimeout(() => navigate('/dashboard'), 3000);
      } else if (status === 'cancel') {
        localStorage.removeItem('pending_purchase');
        setMessage('Paiement annulé.');
        setTimeout(() => navigate('/dashboard'), 3000);
      }

      setProcessing(false);
    };

    processPurchase();
  }, [status, user, updateTicketBalance, addPurchase, navigate]);

  return (
    <div className="payment-callback-container">
      <div className="payment-callback-card">
        {processing ? (
          <>
            <Loader size={64} className="spinner" />
            <h2>Traitement en cours...</h2>
            <p>Veuillez patienter</p>
          </>
        ) : (
          <>
            {status === 'success' ? (
              <>
                <CheckCircle size={64} className="icon-success" />
                <h2>Paiement réussi !</h2>
              </>
            ) : (
              <>
                <XCircle size={64} className="icon-error" />
                <h2>{status === 'cancel' ? 'Paiement annulé' : 'Paiement échoué'}</h2>
              </>
            )}
            <p>{message}</p>
            <p className="redirect-text">Redirection automatique...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
