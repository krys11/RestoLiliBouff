import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import { motion } from 'framer-motion';
import React from 'react';

function Reservation() {
  const navigate = useNavigate();
  const { orderInfo, updateOrderInfo } = useOrder();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    whatsapp: '',
    date: '',
    time: '',
    guests: 1,
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!orderInfo.type) {
      updateOrderInfo({
        ...orderInfo,
        type: 'reservation'
      });
    }
    if (orderInfo.reservationInfo) {
      setFormData(orderInfo.reservationInfo);
    }
  }, [orderInfo, updateOrderInfo]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Le numéro WhatsApp est requis';
    if (!formData.date) newErrors.date = 'La date est requise';
    if (!formData.time) newErrors.time = 'L\'heure est requise';
    
    // Validation WhatsApp (numéro de téléphone)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.whatsapp && !phoneRegex.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Numéro WhatsApp invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateOrderInfo({
        ...orderInfo,
        type: 'reservation',
        reservationInfo: formData
      });
      navigate('/menu'); // Redirection vers le menu pour choisir les plats
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Obtenir la date minimum (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];
  // Obtenir la date maximum (3 mois à partir d'aujourd'hui)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Réservation de table</h1>
      
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prénom
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Numéro WhatsApp
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="0612345678"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM8.88 7.88L6.24 10.52C5.44 11.32 5.44 12.69 6.24 13.49L10.51 17.76C11.31 18.56 12.68 18.56 13.48 17.76L16.12 15.12C16.92 14.32 16.92 12.95 16.12 12.15L11.85 7.88C11.05 7.08 9.68 7.08 8.88 7.88ZM13.29 14.59L10.41 11.71C10.02 11.32 10.02 10.69 10.41 10.3C10.8 9.91 11.43 9.91 11.82 10.3L14.7 13.18C15.09 13.57 15.09 14.2 14.7 14.59C14.31 14.98 13.68 14.98 13.29 14.59Z"/>
                  </svg>
                </div>
              </div>
              {errors.whatsapp && (
                <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Nous utiliserons ce numéro pour vous envoyer la confirmation de réservation via WhatsApp
              </p>
            </div>
          </div>

          {/* Détails de la réservation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                max={maxDateString}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Heure
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Sélectionnez une heure</option>
                {Array.from({ length: 13 }, (_, i) => i + 11).map(hour => (
                  <React.Fragment key={hour}>
                    <option value={`${hour}:00`}>{hour}:00</option>
                    <option value={`${hour}:30`}>{hour}:30</option>
                  </React.Fragment>
                ))}
              </select>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Nombre de personnes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de personnes
            </label>
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'personne' : 'personnes'}
                </option>
              ))}
            </select>
          </div>

          {/* Demandes spéciales */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Demandes spéciales
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Allergies, préférences de placement, etc."
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continuer vers le menu
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Reservation;