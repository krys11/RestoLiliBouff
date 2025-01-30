import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  BanknotesIcon,
  ArrowPathIcon,
  TruckIcon,
  HomeIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  ShoppingBagIcon,
  CurrencyEuroIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusOptions = [
  { value: 'all', label: 'Toutes les commandes' },
  { value: 'pending', label: 'En attente' },
  { value: 'preparing', label: 'En préparation' },
  { value: 'ready', label: 'Prêt' },
  { value: 'delivered', label: 'Livré' },
  { value: 'cancelled', label: 'Annulé' },
];

const getNextStatus = (currentStatus, type) => {
  const statusFlow = {
    pending: 'preparing',
    preparing: 'ready',
    ready: 'delivered',
  };
  if (type === 'reservation') {
    return currentStatus === 'pending' ? 'confirmed' : statusFlow[currentStatus] || currentStatus;
  }
  return statusFlow[currentStatus] || currentStatus;
};

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Fetching orders...');
    const q = query(collection(db, 'orders'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(order => order.type !== 'reservation')
        .sort((a, b) => {
          const dateA = a.createdAt || a.paymentInfo?.date;
          const dateB = b.createdAt || b.paymentInfo?.date;
          return dateB.localeCompare(dateA);
        });
      
      setOrders(ordersData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [location.search, orders]);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    navigate(`?orderId=${order.id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prêt';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      // Mise à jour locale de l'ordre sélectionné
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Une erreur est survenue lors de la mise à jour du statut.');
    }
  };

  const OrderCard = ({ order, onUpdateStatus, isSelected, onSelect }) => {
    const handleStatusUpdate = async (e) => {
      e.stopPropagation(); // Empêcher la propagation du clic au parent
      const nextStatus = getNextStatus(order.status, order.type);
      if (nextStatus !== order.status) {
        onUpdateStatus(order.id, nextStatus);
      }
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={() => onSelect(order)}
        className={`bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-blue-50' : ''
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-900">
                Commande #{order.orderId?.slice(-4) || order.id.slice(-4)}
              </h3>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
              {/* Indicateur du type de commande */}
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {order.type === 'delivery' ? (
                  <>
                    <TruckIcon className="mr-1 h-3 w-3" />
                    Livraison
                  </>
                ) : order.type === 'takeaway' ? (
                  <>
                    <ShoppingBagIcon className="mr-1 h-3 w-3" />
                    À emporter
                  </>
                ) : (
                  <>
                    <HomeIcon className="mr-1 h-3 w-3" />
                    Sur place
                  </>
                )}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(order.createdAt || order.paymentInfo?.date)}
            </p>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {order.deliveryInfo?.firstName} {order.deliveryInfo?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                {order.items.length} articles - {order.total.toFixed(2)}€
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <button
              onClick={handleStatusUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {order.type === 'reservation' ? 'Confirmer la réservation' :
               order.status === 'pending' ? 'Commencer la préparation' :
               order.status === 'preparing' ? 'Marquer comme prêt' :
               order.status === 'ready' ? 'Marquer comme livré' : 'Mettre à jour'}
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Gestion des Commandes
          </h1>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6">
        <div className="sm:flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-4 py-2 rounded-md ${
                filterStatus === option.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des commandes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <ArrowPathIcon className="w-6 h-6 text-blue-500 animate-spin" />
                <span className="ml-2">Chargement des commandes...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Aucune commande {filterStatus !== 'all' ? 'avec ce statut' : ''}
              </div>
            ) : (
              <AnimatePresence>
                {filteredOrders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onUpdateStatus={handleStatusChange}
                    isSelected={selectedOrder?.id === order.id}
                    onSelect={handleOrderSelect}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Détails de la commande */}
        {selectedOrder && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  {selectedOrder.type === 'delivery' ? (
                    <TruckIcon className="h-6 w-6 mr-2 text-blue-500" />
                  ) : selectedOrder.type === 'takeaway' ? (
                    <ShoppingBagIcon className="h-6 w-6 mr-2 text-purple-500" />
                  ) : (
                    <HomeIcon className="h-6 w-6 mr-2 text-green-500" />
                  )}
                  {selectedOrder.type === 'delivery' ? 'Commande' : 
                   selectedOrder.type === 'takeaway' ? 'Commande à emporter' : 
                   'Commande sur place'} #
                  {selectedOrder.orderId?.slice(-4) || selectedOrder.id.slice(-4)}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedOrder.createdAt || selectedOrder.paymentInfo?.date)}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  navigate('.');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Informations client */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Informations client
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrder.type === 'takeaway' ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Nom complet</p>
                        <p className="font-medium">
                          {selectedOrder.takeawayInfo?.firstName} {selectedOrder.takeawayInfo?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">WhatsApp</p>
                        <a
                          href={`https://wa.me/${selectedOrder.contactInfo?.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {selectedOrder.contactInfo?.whatsapp}
                        </a>
                      </div>
                      {selectedOrder.takeawayInfo?.pickupTime && (
                        <div>
                          <p className="text-sm text-gray-600">Heure de retrait</p>
                          <p className="font-medium">
                            {selectedOrder.takeawayInfo.pickupTime === 'asap' 
                              ? 'Dès que possible'
                              : selectedOrder.takeawayInfo.pickupTime}
                          </p>
                        </div>
                      )}
                      {selectedOrder.takeawayInfo?.tableNumber && (
                        <div>
                          <p className="text-sm text-gray-600">Numéro de table</p>
                          <p className="font-medium">
                            Table N°{selectedOrder.takeawayInfo?.tableNumber}
                          </p>
                        </div>
                      )}
                    </>
                  ) : selectedOrder.type === 'on-site' ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Nom du client</p>
                        <p className="font-medium">
                          {selectedOrder.tableInfo?.customerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Numéro de table</p>
                        <p className="font-medium">
                          Table N°{selectedOrder.tableInfo?.tableNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">WhatsApp</p>
                        <a
                          href={`https://wa.me/${selectedOrder.contactInfo?.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {selectedOrder.contactInfo?.whatsapp}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mode de paiement</p>
                        <p className="font-medium flex items-center">
                          <BanknotesIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {selectedOrder.paymentInfo?.method === 'cash' ? 'Espèces' : 'Carte bancaire'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Nom complet</p>
                        <p className="font-medium">
                          {selectedOrder.deliveryInfo?.firstName} {selectedOrder.deliveryInfo?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">WhatsApp</p>
                        <a
                          href={`https://wa.me/${selectedOrder.contactInfo?.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {selectedOrder.contactInfo?.whatsapp}
                        </a>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Adresse de livraison</p>
                        <p className="font-medium flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {selectedOrder.deliveryInfo?.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ville</p>
                        <p className="font-medium">
                          {selectedOrder.deliveryInfo?.city}
                        </p>
                      </div>
                      {selectedOrder.deliveryInfo?.apartment && (
                        <div>
                          <p className="text-sm text-gray-600">Appartement</p>
                          <p className="font-medium">
                            {selectedOrder.deliveryInfo?.apartment}
                          </p>
                        </div>
                      )}
                      {selectedOrder.deliveryInfo?.floor && (
                        <div>
                          <p className="text-sm text-gray-600">Étage</p>
                          <p className="font-medium">
                            {selectedOrder.deliveryInfo?.floor}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Horaire de livraison souhaité</p>
                        <p className="font-medium">
                          {selectedOrder.deliveryInfo?.time === 'asap' 
                            ? 'Dès que possible'
                            : selectedOrder.deliveryInfo?.time}
                        </p>
                      </div>
                      {selectedOrder.deliveryInfo?.instructions && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">Instructions spéciales</p>
                          <p className="font-medium text-gray-800 bg-yellow-50 p-2 rounded-md mt-1">
                            {selectedOrder.deliveryInfo?.instructions}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              {/* Articles commandés */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <ShoppingBagIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Articles commandés
                  </h3>
                  <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <span className="font-bold text-lg mr-1">
                      {selectedOrder.items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                    <span className="text-sm">
                      {selectedOrder.items.reduce((total, item) => total + item.quantity, 0) > 1 ? 'articles' : 'article'}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-100">
                      {item.imageUrl && (
                        <div className="relative">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          {item.quantity > 1 && (
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-sm">
                            {item.quantity > 1 ? `${item.quantity} articles` : '1 article'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Prix unitaire: {item.price.toFixed(2)}€
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{(item.quantity * item.price).toFixed(2)}€</p>
                        <p className="text-xs text-gray-500">Total pour cet article</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé des coûts */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <CurrencyEuroIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Résumé des coûts
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{selectedOrder.subtotal?.toFixed(2)}€</span>
                  </div>
                  {selectedOrder.type === 'delivery' && (
                    <div className="flex justify-between text-gray-600">
                      <span>Frais de livraison</span>
                      <span>2.50€</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>{selectedOrder.total?.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedOrder.status !== 'delivered' && 
               selectedOrder.status !== 'cancelled' && 
               selectedOrder.status !== 'confirmed' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status, selectedOrder.type))}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    {selectedOrder.type === 'reservation' ? 'Confirmer la réservation' :
                     selectedOrder.status === 'pending' ? 'Commencer la préparation' :
                     selectedOrder.status === 'preparing' ? 'Marquer comme prêt' :
                     selectedOrder.status === 'ready' ? 'Marquer comme livré' : 'Mettre à jour'}
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;