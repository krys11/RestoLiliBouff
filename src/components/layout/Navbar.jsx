import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BellIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const auth = useAuth();
  const { user } = auth;
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const location = useLocation();
  const cartCount = items.length;
  const [notifications, setNotifications] = useState({
    newOrders: 0,
    newReservations: 0
  });

  useEffect(() => {
    if (!auth || !user) {
      return;
    }

    if (user.isAdmin) {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('isRead', '==', false)
      );

      const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        let newOrders = 0;
        let newReservations = 0;

        snapshot.docs.forEach(doc => {
          const order = doc.data();
          if (order.type === 'reservation') {
            newReservations++;
          } else if (order.type === 'delivery' || order.type === 'on-site') {
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
    }
  }, [user]);

  const navigation = [
    { name: 'Accueil', href: '/', icon: HomeIcon },
    { name: 'Menu', href: '/menu', icon: ClipboardDocumentListIcon },
    { name: 'Livraison', href: '/delivery', icon: TruckIcon },
    { name: 'Réservation', href: '/reservation', icon: CalendarDaysIcon },
    { name: 'Sur place', href: '/table-order', icon: UserGroupIcon },
    { name: 'À emporter', href: '/takeaway', icon: ShoppingBagIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                LiLi Bouff
              </span>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Notifications pour admin */}
            {user?.isAdmin && (
              <Link
                to="/admin/dashboard"
                className="relative p-2 rounded-full transition-colors text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              >
                <BellIcon className="h-6 w-6" />
                {(notifications.newOrders + notifications.newReservations) > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {notifications.newOrders + notifications.newReservations}
                  </span>
                )}
              </Link>
            )}

            <Link 
              to="/cart" 
              className={`relative p-2 rounded-full transition-colors ${
                isActive('/cart')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Menu mobile avec notifications */}
          <div className="flex items-center md:hidden">
            {user?.isAdmin && (
              <Link
                to="/admin/dashboard"
                className="relative p-2 mr-2 text-gray-600 hover:text-blue-600"
              >
                <BellIcon className="h-6 w-6" />
                {(notifications.newOrders + notifications.newReservations) > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {notifications.newOrders + notifications.newReservations}
                  </span>
                )}
              </Link>
            )}
            
            <Link 
              to="/cart" 
              className="relative p-2 mr-2 text-gray-600 hover:text-blue-600"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.href)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;