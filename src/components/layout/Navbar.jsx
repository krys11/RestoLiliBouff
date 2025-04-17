import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../../contexts/CartContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const auth = useAuth();
  const { user } = auth;
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();
  const location = useLocation();
  const cartCount = items.length;
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState({
    newOrders: 0,
    newReservations: 0,
  });

  // Détecter le scroll pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Exécute handleScroll immédiatement pour définir l'état initial
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!auth || !user) {
      return;
    }

    if (user.isAdmin) {
      const ordersQuery = query(
        collection(db, "orders"),
        where("isRead", "==", false)
      );

      const unsubscribeOrders = onSnapshot(
        ordersQuery,
        (snapshot) => {
          let newOrders = 0;
          let newReservations = 0;

          snapshot.docs.forEach((doc) => {
            const order = doc.data();
            if (order.type === "reservation") {
              newReservations++;
            } else if (order.type === "delivery" || order.type === "on-site") {
              newOrders++;
            }
          });

          setNotifications({
            newOrders,
            newReservations,
          });
        },
        (error) => {
          console.error("Erreur dans le listener:", error);
        }
      );

      return () => {
        unsubscribeOrders();
      };
    }
  }, [user]);

  const navigation = [
    { name: "Accueil", href: "/", icon: HomeIcon },
    { name: "Menu", href: "/menu", icon: ClipboardDocumentListIcon },
    { name: "Livraison", href: "/delivery", icon: TruckIcon },
    { name: "Réservation", href: "/reservation", icon: CalendarDaysIcon },
    { name: "Sur place", href: "/table-order", icon: UserGroupIcon },
    { name: "À emporter", href: "/takeaway", icon: ShoppingBagIcon },
  ];

  const isActive = (path) => location.pathname === path;

  // Variants pour les animations
  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const counterVariants = {
    initial: { scale: 0 },
    animate: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <motion.nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg backdrop-blur-md bg-opacity-90"
          : "bg-amber-900/70 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                to="/"
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <span
                  className={`text-2xl font-bold bg-gradient-to-r ${
                    isScrolled
                      ? "from-amber-600 to-amber-800"
                      : "from-amber-200 to-amber-100"
                  } bg-clip-text text-transparent hover:from-amber-500 hover:to-amber-700 transition-all duration-300`}
                >
                  Le Bistrot
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item, i) => (
              <motion.div
                key={item.name}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-amber-700 bg-white border border-amber-200"
                      : "text-amber hover:bg-white/20"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}

            {/* Notifications pour admin */}
            {user?.isAdmin && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link
                  to="/admin/dashboard"
                  className="relative p-2 rounded-full transition-colors text-white hover:bg-white/20"
                >
                  <BellIcon className="h-6 w-6" />
                  {notifications.newOrders + notifications.newReservations >
                    0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      variants={counterVariants}
                      initial="initial"
                      animate="animate"
                      key={
                        notifications.newOrders + notifications.newReservations
                      }
                    >
                      {notifications.newOrders + notifications.newReservations}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/cart"
                className={`relative p-2 rounded-full transition-colors ${
                  isActive("/cart")
                    ? "text-amber border-amber-200"
                    : "text-amber hover:bg-white/20"
                }`}
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <motion.span
                    className="absolute top-3 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    variants={counterVariants}
                    initial="initial"
                    animate="animate"
                    key={cartCount}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          </div>

          {/* Menu mobile avec notifications */}
          <div className="flex items-center md:hidden">
            {user?.isAdmin && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link
                  to="/admin/dashboard"
                  className="relative p-2 mr-2 text-white hover:text-amber-200"
                >
                  <BellIcon className="h-6 w-6" />
                  {notifications.newOrders + notifications.newReservations >
                    0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      variants={counterVariants}
                      initial="initial"
                      animate="animate"
                      key={
                        notifications.newOrders + notifications.newReservations
                      }
                    >
                      {notifications.newOrders + notifications.newReservations}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/cart"
                className="relative p-2 mr-2 text-amber hover:text-amber-200"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <motion.span
                    className="absolute top-3 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    variants={counterVariants}
                    initial="initial"
                    animate="animate"
                    key={cartCount}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-amber hover:text-amber-200 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white/95 backdrop-blur-md shadow-lg rounded-b-xl mx-2 mt-1 overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.name}
                  variants={navItemVariants}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium ${
                      isActive(item.href)
                        ? "text-amber-700 bg-amber-50 border border-amber-200"
                        : "text-gray-700 hover:text-amber-600 hover:bg-amber-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
