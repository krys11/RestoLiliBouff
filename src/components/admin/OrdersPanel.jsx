import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Link } from 'react-router-dom';

function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    deliveryOrders: 0,
    onSiteOrders: 0,
    totalOrders: 0
  });

  useEffect(() => {
    const ordersQuery = query(collection(db, 'orders'));

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(ordersData);

      // Calculer les statistiques
      const newStats = ordersData.reduce((acc, order) => {
        if (order.status === 'pending') {
          acc.pendingOrders++;
        }
        if (order.type === 'delivery') {
          acc.deliveryOrders++;
        }
        if (order.type === 'on-site') {
          acc.onSiteOrders++;
        }
        acc.totalOrders++;
        return acc;
      }, {
        pendingOrders: 0,
        deliveryOrders: 0,
        onSiteOrders: 0,
        totalOrders: 0
      });

      setStats(newStats);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Commandes</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Voir tout
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800">En attente</h3>
            <p className="mt-2 text-2xl font-semibold text-yellow-900">
              {stats.pendingOrders}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Livraisons</h3>
            <p className="mt-2 text-2xl font-semibold text-blue-900">
              {stats.deliveryOrders}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Sur place</h3>
            <p className="mt-2 text-2xl font-semibold text-green-900">
              {stats.onSiteOrders}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">Total</h3>
            <p className="mt-2 text-2xl font-semibold text-purple-900">
              {stats.totalOrders}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Dernières commandes</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    Commande #{order.orderId?.slice(-4) || order.id.slice(-4)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.type === 'delivery' 
                      ? `${order.deliveryInfo?.firstName} ${order.deliveryInfo?.lastName}`
                      : `Table ${order.tableInfo?.tableNumber} - ${order.tableInfo?.customerName}`}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'preparing'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'ready'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status === 'pending'
                    ? 'En attente'
                    : order.status === 'preparing'
                    ? 'En préparation'
                    : order.status === 'ready'
                    ? 'Prêt'
                    : 'Livré'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPanel;