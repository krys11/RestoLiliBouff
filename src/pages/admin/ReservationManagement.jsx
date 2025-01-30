import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIcon,
  XCircleIcon,
  CheckCircleIcon,
  CalendarIcon,
  UserIcon,
  XMarkIcon,
  ClockIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyEuroIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusOptions = [
  { value: 'all', label: 'Toutes les réservations' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'cancelled', label: 'Annulées' },
];

function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const q = query(collection(db, 'orders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reservationsData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(order => order.type === 'reservation')
        .sort((a, b) => {
          // Utiliser createdAt ou paymentInfo.date pour le tri
          const dateA = a.createdAt || a.paymentInfo?.date;
          const dateB = b.createdAt || b.paymentInfo?.date;
          return dateB.localeCompare(dateA); // Tri décroissant
        });
      
      setReservations(reservationsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const reservationId = searchParams.get('reservationId');
    
    if (reservationId && reservations.length > 0) {
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        setSelectedReservation(reservation);
      }
    }
  }, [location.search, reservations]);

  const handleReservationSelect = (reservation) => {
    setSelectedReservation(reservation);
    navigate(`?reservationId=${reservation.id}`);
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const reservationRef = doc(db, 'orders', reservationId);
      await updateDoc(reservationRef, { status: newStatus });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Une erreur est survenue lors de la mise à jour du statut.');
    }
  };

  const ReservationCard = ({ reservation, onUpdateStatus, isSelected, onSelect }) => {
    const handleStatusUpdate = async (e) => {
      e.stopPropagation();
      onUpdateStatus(reservation.id, 'confirmed');
    };

    const canUpdateStatus = reservation.status === 'pending';

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={() => onSelect(reservation)}
        className={`bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-blue-50' : ''
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="font-semibold text-gray-900">
                Réservation #{reservation.id.slice(-4)}
              </h3>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                {reservation.status === 'pending' ? 'En attente' :
                 reservation.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(reservation.reservationInfo.date)}
            </p>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                {reservation.reservationInfo.firstName} {reservation.reservationInfo.lastName}
              </p>
              <p className="text-sm text-gray-600">
                {reservation.reservationInfo.guests} {reservation.reservationInfo.guests > 1 ? 'personnes' : 'personne'}
              </p>
            </div>
          </div>
        </div>
        {canUpdateStatus && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleStatusUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Confirmer la réservation
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const filteredReservations = reservations.filter(reservation => 
    filterStatus === 'all' || reservation.status === filterStatus
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Gestion des Réservations
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
        {/* Liste des réservations */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900">
              Liste des réservations
            </h2>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="p-4 text-center">
                <ClockIcon className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
                <p className="mt-2 text-gray-500">Chargement des réservations...</p>
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune réservation {filterStatus !== 'all' ? 'avec ce statut' : ''}
              </div>
            ) : (
              <AnimatePresence>
                {filteredReservations.map((reservation) => (
                  <ReservationCard 
                    key={reservation.id} 
                    reservation={reservation} 
                    onUpdateStatus={handleStatusChange}
                    isSelected={selectedReservation?.id === reservation.id}
                    onSelect={handleReservationSelect}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Détails de la réservation */}
        {selectedReservation && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2 text-green-500" />
                  Réservation #{selectedReservation.id.slice(-4)}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(selectedReservation.reservationInfo.date)}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedReservation(null);
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
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium">
                      {selectedReservation.reservationInfo.firstName} {selectedReservation.reservationInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">WhatsApp</p>
                    <a
                      href={`https://wa.me/${selectedReservation.reservationInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {selectedReservation.reservationInfo.whatsapp}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nombre de personnes</p>
                    <p className="font-medium flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
                      {selectedReservation.reservationInfo.guests} {selectedReservation.reservationInfo.guests > 1 ? 'personnes' : 'personne'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date et heure</p>
                    <p className="font-medium flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                      {formatDate(selectedReservation.reservationInfo.date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes spéciales */}
              {selectedReservation.reservationInfo.specialRequests && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">Notes spéciales</h3>
                  <p className="text-gray-700">{selectedReservation.reservationInfo.specialRequests}</p>
                </div>
              )}

              {/* Menus commandés */}
              {selectedReservation.items && selectedReservation.items.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <ShoppingBagIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Menus commandés
                    </h3>
                    <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <span className="font-bold text-lg mr-1">
                        {selectedReservation.items.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                      <span className="text-sm">
                        {selectedReservation.items.reduce((total, item) => total + item.quantity, 0) > 1 ? 'menus' : 'menu'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {selectedReservation.items.map((item, index) => (
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
                              {item.quantity > 1 ? `${item.quantity} menus` : '1 menu'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Prix unitaire: {item.price.toFixed(2)}€
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(item.quantity * item.price).toFixed(2)}€</p>
                          <p className="text-xs text-gray-500">Total pour ce menu</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Résumé des coûts */}
              {selectedReservation.items && selectedReservation.items.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <CurrencyEuroIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Résumé des coûts
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span>{selectedReservation.subtotal?.toFixed(2) || selectedReservation.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}€</span>
                    </div>
                    {selectedReservation.type === 'delivery' && selectedReservation.deliveryFee && (
                      <div className="flex justify-between text-gray-600">
                        <span>Frais de livraison</span>
                        <span>{selectedReservation.deliveryFee.toFixed(2)}€</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>{selectedReservation.total?.toFixed(2) || selectedReservation.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedReservation.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusChange(selectedReservation.id, 'confirmed')}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Confirmer la réservation
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedReservation.id, 'cancelled')}
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

export default ReservationManagement;