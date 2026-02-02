// Configuration Wave API
// Pour utiliser l'API Wave en production, vous devez obtenir vos clés API sur https://www.wave.com/developers

const WAVE_CONFIG = {
  // Remplacez par votre clé API Wave en production
  apiKey: process.env.REACT_APP_WAVE_API_KEY || 'wave_sn_prod_YOUR_API_KEY',
  // URL de base de l'API Wave
  apiUrl: 'https://api.wave.com/v1',
  // URL de retour après paiement
  successUrl: window.location.origin + '/payment/success',
  errorUrl: window.location.origin + '/payment/error',
  cancelUrl: window.location.origin + '/payment/cancel'
};

/**
 * Génère un lien de paiement Wave
 * @param {Object} paymentData - Données du paiement
 * @param {number} paymentData.amount - Montant en FCFA
 * @param {string} paymentData.currency - Devise (XOF pour FCFA)
 * @param {string} paymentData.description - Description du paiement
 * @param {string} paymentData.customerEmail - Email du client
 * @param {string} paymentData.customerName - Nom du client
 * @returns {Promise<Object>} - Objet contenant le lien de paiement
 */
export const generateWavePaymentLink = async (paymentData) => {
  try {
    // En mode développement, retourner un lien de démonstration
    if (process.env.NODE_ENV === 'development' || !WAVE_CONFIG.apiKey.includes('prod_')) {
      return {
        success: true,
        paymentUrl: `https://pay.wave.com/demo?amount=${paymentData.amount}&currency=${paymentData.currency}&description=${encodeURIComponent(paymentData.description)}`,
        transactionId: `demo_${Date.now()}`,
        isDemoMode: true
      };
    }

    // En production, appeler l'API Wave réelle
    const response = await fetch(`${WAVE_CONFIG.apiUrl}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WAVE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        currency: paymentData.currency || 'XOF',
        error_url: WAVE_CONFIG.errorUrl,
        success_url: WAVE_CONFIG.successUrl,
        cancel_url: WAVE_CONFIG.cancelUrl,
        metadata: {
          customer_email: paymentData.customerEmail,
          customer_name: paymentData.customerName,
          description: paymentData.description,
          student_id: paymentData.studentId,
          tickets: paymentData.tickets
        }
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du paiement Wave');
    }

    const data = await response.json();

    return {
      success: true,
      paymentUrl: data.wave_launch_url,
      transactionId: data.id,
      isDemoMode: false
    };
  } catch (error) {
    console.error('Erreur Wave API:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Vérifie le statut d'un paiement Wave
 * @param {string} transactionId - ID de la transaction
 * @returns {Promise<Object>} - Statut du paiement
 */
export const checkWavePaymentStatus = async (transactionId) => {
  try {
    // En mode démo
    if (transactionId.startsWith('demo_')) {
      return {
        success: true,
        status: 'completed',
        isDemoMode: true
      };
    }

    // En production
    const response = await fetch(`${WAVE_CONFIG.apiUrl}/checkout/sessions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${WAVE_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du paiement');
    }

    const data = await response.json();

    return {
      success: true,
      status: data.status,
      isDemoMode: false
    };
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  generateWavePaymentLink,
  checkWavePaymentStatus
};
