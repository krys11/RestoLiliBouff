import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import { motion } from 'framer-motion';
import { ClockIcon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline';

function TakeAway() {
  const navigate = useNavigate();
  const { updateOrderInfo } = useOrder();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    isOnSite: false,
    tableNumber: '',
    pickupTime: 'asap',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderInfo({
      type: 'takeaway',
      takeawayInfo: {
        ...formData,
        status: 'pending'
      }
    });
    navigate('/menu');
  };

  const generateTimeOptions = () => {
    const options = [{ value: 'asap', label: 'Dès que possible' }];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const startMinute = Math.ceil(currentMinute / 15) * 15;
    let hour = currentHour;
    let minute = startMinute;

    if (minute >= 60) {
      hour += 1;
      minute = 0;
    }

    while (hour < 24) {
      while (minute < 60) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push({ value: timeString, label: timeString });
        minute += 15;
      }
      hour += 1;
      minute = 0;
    }

    return options;
  };

  const inputClasses = "mt-2 block w-full px-4 py-3 text-base rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200";
  const sectionClasses = "bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Commander à emporter</h2>
          <p className="text-gray-600">Remplissez les informations ci-dessous pour votre commande</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section informations personnelles */}
          <div className={sectionClasses}>
            <div className="flex items-center mb-6">
              <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Informations personnelles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Prénom</label>
                <input
                  type="text"
                  required
                  className={inputClasses}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className={labelClasses}>Nom</label>
                <input
                  type="text"
                  required
                  className={inputClasses}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Votre nom"
                />
              </div>
            </div>
          </div>

          {/* Section localisation */}
          <div className={sectionClasses}>
            <div className="flex items-center mb-6">
              <MapPinIcon className="h-6 w-6 text-blue-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Localisation</h3>
            </div>
            <div className="space-y-6">
              <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  checked={formData.isOnSite}
                  onChange={(e) => setFormData({ ...formData, isOnSite: e.target.checked })}
                />
                <span className="text-base text-gray-900">Je suis déjà sur place</span>
              </label>

              {formData.isOnSite && (
                <div className="ml-7">
                  <label className={labelClasses}>Numéro de table</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className={inputClasses}
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                    placeholder="Ex: 12"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section heure de retrait */}
          {!formData.isOnSite && (
            <div className={sectionClasses}>
              <div className="flex items-center mb-6">
                <ClockIcon className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Heure de retrait</h3>
              </div>
              <select
                className={inputClasses}
                value={formData.pickupTime}
                onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                required
              >
                {generateTimeOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Continuer ma commande</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default TakeAway;