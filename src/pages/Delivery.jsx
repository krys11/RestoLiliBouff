import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';

function Delivery() {
  const navigate = useNavigate();
  const { updateOrderInfo } = useOrder();
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    instructions: '',
    time: 'asap',
  });

  const [selectedTime, setSelectedTime] = useState('asap');
  const timeSlots = [
    { id: 'asap', label: 'Dès que possible' },
    { id: '30min', label: 'Dans 30 minutes' },
    { id: '1h', label: 'Dans 1 heure' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mettre à jour le contexte avec les informations de livraison
    updateOrderInfo({
      type: 'delivery',
      deliveryInfo: {
        ...deliveryInfo,
        time: selectedTime,
      },
    });

    // Rediriger vers la page du menu
    navigate('/menu');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Informations de livraison
      </h1>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={deliveryInfo.firstName}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Jean"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={deliveryInfo.lastName}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Dupont"
                required
              />
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse de livraison
            </label>
            <input
              type="text"
              value={deliveryInfo.address}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="123 rue de la Paix"
              required
            />
          </div>

          {/* Appartement (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appartement, étage (optionnel)
            </label>
            <input
              type="text"
              value={deliveryInfo.apartment}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, apartment: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Apt 4B, 3ème étage"
            />
          </div>

          {/* Ville et Code Postal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                type="text"
                value={deliveryInfo.city}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code Postal
              </label>
              <input
                type="text"
                value={deliveryInfo.postalCode}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, postalCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Horaire de livraison */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horaire de livraison souhaité
            </label>
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedTime(slot.id)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedTime === slot.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions spéciales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions spéciales (optionnel)
            </label>
            <textarea
              value={deliveryInfo.instructions}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, instructions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Code d'entrée, instructions pour le livreur..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continuer vers le menu
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default Delivery;