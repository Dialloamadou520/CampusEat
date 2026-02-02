import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShoppingCart, ExternalLink } from 'lucide-react';
import { generateWavePaymentLink } from '../utils/waveApi';
import './PurchaseTickets.css';

const PurchaseTickets = ({ onClose }) => {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processing, setProcessing] = useState(false);

  const packages = [
    { id: 1, tickets: 5, price: 10000, popular: false },
    { id: 2, tickets: 10, price: 18000, popular: true, discount: '10%' },
    { id: 3, tickets: 20, price: 33000, popular: false, discount: '17%' },
    { id: 4, tickets: 30, price: 48000, popular: false, discount: '20%' }
  ];

  const handleContinue = () => {
    if (!selectedPackage) return;
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    setProcessing(true);

    const pkg = packages.find(p => p.id === selectedPackage);

    try {
      const paymentData = {
        amount: pkg.price,
        currency: 'XOF',
        description: `Achat de ${pkg.tickets} tickets CampusEat`,
        customerEmail: user.email || `${user.studentId}@campus.edu`,
        customerName: user.name,
        studentId: user.studentId,
        tickets: pkg.tickets
      };

      const result = await generateWavePaymentLink(paymentData);

      if (result.success) {
        localStorage.setItem('pending_purchase', JSON.stringify({
          studentId: user.studentId,
          studentName: user.name,
          tickets: pkg.tickets,
          amount: pkg.price,
          paymentMethod: 'wave',
          transactionId: result.transactionId,
          timestamp: Date.now()
        }));

        window.location.href = result.paymentUrl;
      } else {
        alert('Erreur lors de la génération du lien de paiement. Veuillez réessayer.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      setProcessing(false);
    }
  };

  if (showConfirmation) {
    const selectedPkg = packages.find(p => p.id === selectedPackage);
    return (
      <div className="purchase-modal-overlay" onClick={onClose}>
        <div className="purchase-modal confirmation-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>
              <ShoppingCart size={24} />
              Confirmer votre achat
            </h2>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="confirmation-content">
              <h3>Récapitulatif de votre commande</h3>
              
              <div className="confirmation-details">
                <div className="detail-row">
                  <span className="detail-label">Forfait sélectionné:</span>
                  <span className="detail-value">{selectedPkg.tickets} tickets</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Prix unitaire:</span>
                  <span className="detail-value">{(selectedPkg.price / selectedPkg.tickets).toLocaleString('fr-FR')} FCFA / ticket</span>
                </div>
                <div className="detail-row total-row">
                  <span className="detail-label">Montant total:</span>
                  <span className="detail-value">{selectedPkg.price.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <div className="balance-info">
                <div className="balance-row">
                  <span>Solde actuel:</span>
                  <strong>{user?.ticketBalance} tickets</strong>
                </div>
                <div className="balance-row highlight">
                  <span>Nouveau solde:</span>
                  <strong>{user?.ticketBalance + selectedPkg.tickets} tickets</strong>
                </div>
              </div>

              <div className="payment-method-display">
                <span className="payment-label">Paiement via:</span>
                <div className="wave-badge">
                  <span className="wave-icon-small">W</span>
                  <span>Wave</span>
                </div>
              </div>

              <div className="confirmation-notice">
                <p>En cliquant sur "Valider le paiement", vous confirmez votre achat et acceptez d'être débité de <strong>{selectedPkg.price.toLocaleString('fr-FR')} FCFA</strong> via Wave.</p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              className="cancel-button" 
              onClick={() => setShowConfirmation(false)}
              disabled={processing}
            >
              Retour
            </button>
            <button
              className="purchase-button validate-button"
              onClick={handleConfirmPayment}
              disabled={processing}
            >
              {processing ? 'Redirection vers Wave...' : (
                <>
                  Payer avec Wave
                  <ExternalLink size={18} style={{ marginLeft: '0.5rem' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-modal-overlay" onClick={onClose}>
      <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <ShoppingCart size={24} />
            Acheter des tickets
          </h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="current-balance">
            <span>Solde actuel:</span>
            <strong>{user?.ticketBalance} tickets</strong>
          </div>

          <h3>Choisissez un forfait</h3>
          <div className="packages-grid">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''} ${pkg.popular ? 'popular' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && <div className="popular-badge">Populaire</div>}
                {pkg.discount && <div className="discount-badge">-{pkg.discount}</div>}
                <div className="package-tickets">{pkg.tickets}</div>
                <div className="package-label">tickets</div>
                <div className="package-price">{pkg.price.toLocaleString('fr-FR')} FCFA</div>
                <div className="package-unit">{(pkg.price / pkg.tickets).toLocaleString('fr-FR')} FCFA / ticket</div>
              </div>
            ))}
          </div>

          <h3>Méthode de paiement</h3>
          <div className="payment-methods">
            <div className="payment-option selected wave-payment">
              <div className="wave-logo">
                <span className="wave-icon">W</span>
              </div>
              <div className="wave-info">
                <span className="wave-title">Wave</span>
                <span className="wave-subtitle">Paiement mobile sécurisé</span>
              </div>
            </div>
          </div>

          {selectedPackage && (
            <div className="purchase-summary">
              <div className="summary-row">
                <span>Tickets:</span>
                <strong>{packages.find(p => p.id === selectedPackage).tickets}</strong>
              </div>
              <div className="summary-row">
                <span>Montant:</span>
                <strong>{packages.find(p => p.id === selectedPackage).price.toLocaleString('fr-FR')} FCFA</strong>
              </div>
              <div className="summary-row total">
                <span>Nouveau solde:</span>
                <strong>{user?.ticketBalance + packages.find(p => p.id === selectedPackage).tickets} tickets</strong>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Annuler
          </button>
          <button
            className="purchase-button"
            onClick={handleContinue}
            disabled={!selectedPackage}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTickets;
