import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TruckIcon,
  CalendarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

function OrderType() {
  const orderTypes = [
    {
      id: "delivery",
      title: "Livraison",
      description: "Faites-vous livrer à domicile",
      icon: TruckIcon,
      path: "/delivery",
      color: "amber",
    },
    {
      id: "reservation",
      title: "Réservation",
      description: "Réservez une table au restaurant",
      icon: CalendarIcon,
      path: "/reservation",
      color: "amber",
    },
    {
      id: "onsite",
      title: "Sur Place",
      description: "Commandez directement depuis votre table",
      icon: UserGroupIcon,
      path: "/table-order",
      color: "amber",
    },
    {
      id: "takeaway",
      title: "À emporter",
      description: "Commandez et récupérez votre repas au restaurant",
      path: "/takeaway",
      icon: ShoppingBagIcon,
      color: "amber",
    },
  ];

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        delay: i * 0.1,
      },
    }),
    hover: {
      y: -10,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.98 },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -10 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          className="text-4xl font-bold text-amber-900 text-center mb-4"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Comment souhaitez-vous commander ?
        </motion.h1>

        <motion.p
          className="text-xl text-amber-700 text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Choisissez votre mode de commande préféré
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {orderTypes.map((type, index) => (
            <motion.div
              key={type.id}
              custom={index}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative"
            >
              <Link
                to={type.path}
                className="block h-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600" />

                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <motion.div
                      className="p-3 bg-amber-100 rounded-lg mr-4"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <type.icon className="h-8 w-8 text-amber-600" />
                    </motion.div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {type.title}
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-4">{type.description}</p>

                  <motion.div
                    className="flex items-center mt-6 text-amber-600 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <span>Commencer</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
          }}
        />
        <motion.div
          className="absolute -top-16 -right-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            delay: 2,
          }}
        />
      </div>
    </div>
  );
}

export default OrderType;
