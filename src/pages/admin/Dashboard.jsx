import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowRightIcon,
  Squares2X2Icon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { collection, query, orderBy, onSnapshot, where, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import AdminNotifications from './AdminNotifications';

import MenuManagement from './MenuManagement';
import OrderManagement from './OrderManagement';
import ReservationManagement from './ReservationManagement';
import Statistics from './Statistics';
import Settings from './Settings';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Accueil', href: '/admin', icon: HomeIcon, path: '' },
    { name: 'Commandes', href: '/admin/orders', icon: ClipboardDocumentListIcon, path: 'orders' },
    { name: 'Réservations', href: '/admin/reservations', icon: CalendarDaysIcon, path: 'reservations' },
    { name: 'Menu', href: '/admin/menu', icon: UserGroupIcon, path: 'menu' },
    { name: 'Statistiques', href: '/admin/statistics', icon: ChartBarIcon, path: 'statistics' },
    { name: 'Paramètres', href: '/admin/settings', icon: Cog6ToothIcon, path: 'settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-between flex-shrink-0 px-4">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Logo"
              />
              <AdminNotifications />
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
                >
                  <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Déconnexion
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main column */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header mobile */}
        <div className="lg:hidden relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard Admin</h1>
            </div>
            <div className="flex items-center">
              <AdminNotifications />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/reservations" element={<ReservationManagement />} />
                <Route path="/menu" element={<MenuManagement />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalReservations: 0,
    pendingOrders: 0,
    pendingReservations: 0,
    todayRevenue: 0
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      // Observer pour toutes les commandes et réservations
      const ordersQuery = query(collection(db, 'orders'));

      const unsubscribeOrders = onSnapshot(ordersQuery, (ordersSnapshot) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        
        let totalOrders = 0;
        let totalReservations = 0;
        let pendingOrders = 0;
        let pendingReservations = 0;
        let todayRevenue = 0;

        ordersSnapshot.docs.forEach(doc => {
          const order = doc.data();
          const orderDate = order.createdAt || order.paymentInfo?.date;

          if (order.type === 'reservation') {
            if (order.status !== 'cancelled') {
              totalReservations++;
              if (order.status === 'pending' || !order.status) {
                pendingReservations++;
              }
            }
          } else if (order.type === 'delivery' || order.type === 'on-site' || order.type === 'takeaway') {
            totalOrders++;
            if (order.status === 'pending') {
              pendingOrders++;
            }
            if (orderDate >= today) {
              todayRevenue += order.total || 0;
            }
          }
        });

        // Mettre à jour toutes les stats en une seule fois
        setStats({
          totalOrders,
          totalReservations,
          pendingOrders,
          pendingReservations,
          todayRevenue
        });
      });

      return () => {
        unsubscribeOrders();
      };
    };

    fetchStats();
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Tableau de bord
          </h1>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Commandes en attente */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Commandes en attente
                  </dt>
                  <dd className="text-2xl font-semibold text-yellow-600">
                    {stats.pendingOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Réservations en attente */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Réservations en attente
                  </dt>
                  <dd className="text-2xl font-semibold text-orange-600">
                    {stats.pendingReservations}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Commandes totales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Commandes totales
                  </dt>
                  <dd className="text-2xl font-semibold text-blue-600">
                    {stats.totalOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Réservations totales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Réservations totales
                  </dt>
                  <dd className="text-2xl font-semibold text-green-600">
                    {stats.totalReservations}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Chiffre d'affaires du jour */}
        <div className="bg-white overflow-hidden shadow rounded-lg col-span-2">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BanknotesIcon className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chiffre d'affaires du jour
                  </dt>
                  <dd className="text-2xl font-semibold text-indigo-600">
                    {stats.todayRevenue.toFixed(2)}€
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/admin/orders')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 hover:border-blue-500"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Commandes</h2>
            <ClipboardDocumentListIcon className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-600">
            Gérer les commandes en cours et l'historique
          </p>
          <div className="mt-4 flex items-center text-blue-600">
            <span className="text-sm font-medium">Voir les commandes</span>
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/reservations')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 hover:border-blue-500"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Réservations</h2>
            <CalendarDaysIcon className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-600">
            Gérer les réservations de tables
          </p>
          <div className="mt-4 flex items-center text-blue-600">
            <span className="text-sm font-medium">Voir les réservations</span>
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/menu')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 hover:border-blue-500"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <Squares2X2Icon className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-600">
            Gérer les catégories et les plats
          </p>
          <div className="mt-4 flex items-center text-blue-600">
            <span className="text-sm font-medium">Gérer le menu</span>
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
