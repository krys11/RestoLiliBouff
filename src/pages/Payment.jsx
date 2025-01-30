import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrder } from '../contexts/OrderContext';
import { useCart } from '../contexts/CartContext';
import { db } from '../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

function Payment() {
  const navigate = useNavigate();
  const { orderInfo, updateOrderInfo } = useOrder();
  const { items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' ou 'cash'
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Pas de frais de livraison pour les commandes sur place

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    } else if (!orderInfo.type) {
      navigate('/order');
    }
  }, [items, orderInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isProcessing) return;
    setIsProcessing(true);
  
    try {
      const itemsWithImages = items.map(item => ({
        ...item,
        imageUrl: item.image
      }));

      const orderData = {
        ...orderInfo,
        createdAt: new Date().toISOString(),
        paymentInfo: {
          method: paymentMethod,
          amount: total,
          date: new Date().toISOString(),
          status: paymentMethod === 'cash' ? 'pending' : 'completed'
        },
        contactInfo: {
          whatsapp: whatsappNumber
        },
        items: itemsWithImages,
        subtotal,
        total,
        status: 'pending',
        orderId: `ORD-${Date.now()}`,
        isRead: false,
      };
  
      await addDoc(collection(db, 'orders'), orderData);
      
      updateOrderInfo(orderData);
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paiement</h1>

      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Résumé de la commande */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
          <div className="space-y-4">
            {orderInfo.type === 'on-site' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Commande sur place</h3>
                <p className="text-green-600">
                  Table N°{orderInfo.tableInfo.tableNumber}
                </p>
                <p className="text-green-600">
                  Client: {orderInfo.tableInfo.customerName}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <p className="text-gray-500 text-sm">TVA incluse</p>
            </div>
          </div>
        </div>

        {/* Numéro WhatsApp */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ex: +229 XX XX XX XX"
                required
              />
              <span className="absolute left-3 top-3">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm.031 18c-.833 0-1.65-.087-2.433-.252l-2.703.703.718-2.605c-.907-.957-1.469-2.244-1.469-3.654 0-2.953 2.393-5.346 5.346-5.346s5.346 2.393 5.346 5.346-2.393 5.346-5.346 5.346z"/>
                </svg>
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Pour recevoir les notifications de votre commande
            </p>
          </div>
        </div>

        {/* Choix du mode de paiement */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-lg border-2 text-center ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <span className="block font-medium mb-1">Carte bancaire</span>
              <span className="text-sm text-gray-500">Paiement sécurisé</span>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-lg border-2 text-center ${
                paymentMethod === 'cash'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <span className="block font-medium mb-1">Espèces</span>
              <span className="text-sm text-gray-500">Paiement à table</span>
            </button>
          </div>
        </div>

        {/* Formulaire de paiement par carte */}
        {paymentMethod === 'card' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de carte
              </label>
              <input
                type="text"
                value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'expiration
                </label>
                <input
                  type="text"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/AA"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom sur la carte
              </label>
              <input
                type="text"
                value={paymentInfo.name}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {isProcessing ? 'Traitement en cours...' : 'Payer maintenant'}
            </button>
          </form>
        )}

        {/* Paiement en espèces */}
        {paymentMethod === 'cash' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">
                Vous avez choisi de payer en espèces. Le paiement sera effectué directement à votre table.
              </p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {isProcessing ? 'Traitement en cours...' : 'Confirmer la commande'}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export default Payment;