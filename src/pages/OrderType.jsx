import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  CalendarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

function OrderType() {
  const orderTypes = [
    {
      id: 'delivery',
      title: 'Livraison',
      description: 'Faites-vous livrer à domicile',
      icon: TruckIcon,
      path: '/delivery',
      color: 'blue',
    },
    {
      id: 'reservation',
      title: 'Réservation',
      description: 'Réservez une table au restaurant',
      icon: CalendarIcon,
      path: '/reservation',
      color: 'green',
    },
    {
      id: 'onsite',
      title: 'Sur Place',
      description: 'Commandez directement depuis votre table',
      icon: UserGroupIcon,
      path: '/table-order',
      color: 'purple',
    },
    {
      id: 'takeaway',
      title: 'À emporter',
      description: 'Commandez et récupérez votre repas au restaurant',
      path: '/takeaway',
      icon: ShoppingBagIcon,
      color: 'red',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Comment souhaitez-vous commander ?
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {orderTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Link
              to={type.path}
              className={`block h-full bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow
                border-2 border-transparent hover:border-${type.color}-500`}
            >
              <type.icon className={`h-12 w-12 text-${type.color}-500 mb-4`} />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {type.title}
              </h2>
              <p className="text-gray-600">{type.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default OrderType;