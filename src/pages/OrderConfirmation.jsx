// src/pages/OrderConfirmation.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrder } from '../contexts/OrderContext';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

function OrderConfirmation() {
  const navigate = useNavigate();
  const { orderInfo } = useOrder();

  useEffect(() => {
    if (!orderInfo.orderId) {
      navigate('/');
    }
  }, [orderInfo, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
    >
      <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Commande confirmée !
      </h1>
      
      <p className="text-lg text-gray-600 mb-8">
        Votre commande #{orderInfo.orderId} a été confirmée.
      </p>

      {orderInfo.type === 'delivery' && (
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Détails de la livraison
          </h2>
          <p className="text-blue-600">
            Adresse : {orderInfo.deliveryInfo.address}, {orderInfo.deliveryInfo.city}
          </p>
          <p className="text-blue-600">
            Heure estimée : {orderInfo.deliveryInfo.time === 'asap' ? 'Dès que possible' : orderInfo.deliveryInfo.time}
          </p>
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Retour à l'accueil
      </button>
    </motion.div>
  );
}

export default OrderConfirmation;