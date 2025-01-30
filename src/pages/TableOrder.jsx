import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';

function TableOrder() {
  const navigate = useNavigate();
  const { updateOrderInfo } = useOrder();
  const [tableInfo, setTableInfo] = useState({
    tableNumber: '',
    customerName: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tableInfo.tableNumber || !tableInfo.customerName) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    updateOrderInfo({
      type: 'on-site',
      tableInfo: tableInfo,
      status: 'pending'
    });

    navigate('/menu');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Commander depuis votre table
      </h1>
      <p className="text-gray-600 mb-8">Remplissez les informations ci-dessous pour commencer votre commande</p>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de table
            </label>
            <input
              type="text"
              value={tableInfo.tableNumber}
              onChange={(e) => setTableInfo({ ...tableInfo, tableNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 12"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre nom
            </label>
            <input
              type="text"
              value={tableInfo.customerName}
              onChange={(e) => setTableInfo({ ...tableInfo, customerName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Pour vous identifier auprès du serveur"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Continuer vers le menu
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default TableOrder;