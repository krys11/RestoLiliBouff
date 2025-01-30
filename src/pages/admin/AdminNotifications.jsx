import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { BellIcon } from '@heroicons/react/24/outline';

function AdminNotifications() {
  const [notifications, setNotifications] = useState({
    newOrders: 0,
    newReservations: 0
  });

  useEffect(() => {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('status', '==', 'pending')
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      let newOrders = 0;
      let newReservations = 0;

      snapshot.docs.forEach(doc => {
        const order = doc.data();
        if (order.type === 'reservation' && order.status === 'pending') {
          newReservations++;
        } else if ((order.type === 'delivery' || order.type === 'on-site' || order.type === 'takeaway') && order.status === 'pending') {
          newOrders++;
        }
      });

      setNotifications({
        newOrders,
        newReservations
      });
    }, (error) => {
      console.error('Erreur dans le listener:', error);
    });

    return () => {
      unsubscribeOrders();
    };
  }, []);

  return (
    <div className="relative group">
      <BellIcon className="h-6 w-6 text-gray-600 hover:text-gray-900 cursor-pointer" />
      {(notifications.newOrders > 0 || notifications.newReservations > 0) && (
        <div className="absolute -top-1 -right-1 flex flex-col items-end">
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.newOrders + notifications.newReservations}
          </span>
          <div className="absolute top-0 right-0 mt-8 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {notifications.newOrders > 0 && (
              <div className="px-4 py-2 text-sm text-gray-700">
                {notifications.newOrders} commande{notifications.newOrders > 1 ? 's' : ''} en attente
              </div>
            )}
            {notifications.newReservations > 0 && (
              <div className="px-4 py-2 text-sm text-gray-700">
                {notifications.newReservations} réservation{notifications.newReservations > 1 ? 's' : ''} en attente
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;