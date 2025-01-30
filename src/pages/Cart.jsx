import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../contexts/OrderContext';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, updateQuantity } = useCart();
  const { orderInfo, updateOrderInfo } = useOrder();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // Ne réinitialiser que si le panier est vide et qu'il y a un type de commande défini
    if (items.length === 0 && orderInfo.type) {
      updateOrderInfo({
        type: null,
        deliveryInfo: null,
        reservationInfo: null,
        takeawayInfo: null,
        tableInfo: null,
        status: 'pending'
      });
    }
  }, [items.length, orderInfo.type]); // Ajout de orderInfo.type comme dépendance

  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    } else {
      removeItem(item.id);
    }
  };

  const handleCheckout = () => {
    if (!orderInfo.type) {
      // Si aucun type de commande n'est sélectionné, rediriger vers la sélection
      navigate('/order');
    } else {
      // Sinon, aller directement au paiement
      navigate('/payment');
    }
  };

  const handleClearCart = () => {
    clearCart();
    updateOrderInfo({
      type: null,
      deliveryInfo: null,
      reservationInfo: null,
      tableInfo: null,
      status: 'pending'
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-8">
            <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">Découvrez notre délicieuse sélection de plats</p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Retour au menu
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Votre panier</h2>
        <span className="text-gray-600">{totalItems} article{totalItems > 1 ? 's' : ''}</span>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <motion.div layout className="bg-white rounded-2xl shadow-md overflow-hidden">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 border-b last:border-b-0 flex gap-6"
                >
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-end">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                          disabled={item.quantity >= 10}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Prix unitaire: {item.price.toFixed(2)} €</div>
                        <div className="text-lg font-semibold text-gray-900 mt-1">
                          {(item.price * item.quantity).toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="mt-6">
            <button
              onClick={handleClearCart}
              className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <TrashIcon className="h-5 w-5" />
              Vider le panier
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la commande</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison</span>
                <span>{orderInfo.type === 'delivery' ? '2.50 €' : 'Gratuit'}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{(total + (orderInfo.type === 'delivery' ? 2.50 : 0)).toFixed(2)} €</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">TVA incluse</p>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {orderInfo.type ? 'Procéder au paiement' : 'Choisir le mode de commande'}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>

            <Link
              to="/menu"
              className="mt-4 w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;