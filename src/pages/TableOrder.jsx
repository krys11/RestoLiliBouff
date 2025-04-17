import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../contexts/OrderContext";
import {
  QrCodeIcon,
  UserIcon,
  ArrowLongRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

function TableOrder() {
  const navigate = useNavigate();
  const { updateOrderInfo } = useOrder();
  const [tableInfo, setTableInfo] = useState({
    tableNumber: "",
    customerName: "",
  });
  const [errors, setErrors] = useState({
    tableNumber: "",
    customerName: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    let newErrors = {};
    if (!tableInfo.tableNumber.trim()) {
      newErrors.tableNumber = "Le numéro de table est requis";
    }
    if (!tableInfo.customerName.trim()) {
      newErrors.customerName = "Votre nom est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateOrderInfo({
      type: "on-site",
      tableInfo: tableInfo,
      status: "pending",
    });

    navigate("/menu");
  };

  // Variantes d'animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-20 pb-12"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <motion.h1
            className="text-4xl font-bold text-amber-800 mb-3"
            variants={fadeInUp}
          >
            Commander depuis votre table
          </motion.h1>
          <motion.p
            className="text-amber-700 text-lg max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Indiquez-nous votre numéro de table pour que nous puissions vous
            servir votre commande directement.
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden relative"
          variants={itemVariants}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div variants={itemVariants}>
                <div className="flex items-center mb-4">
                  <QrCodeIcon className="h-6 w-6 text-amber-600 mr-2" />
                  <h2 className="text-2xl font-semibold text-amber-800">
                    Informations de table
                  </h2>
                </div>
                <p className="text-amber-600 text-sm mb-6">
                  Vous trouverez le numéro de votre table sur le QR code présent
                  sur votre table.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-amber-700 mb-2">
                    Numéro de table
                  </label>
                  <motion.div
                    className="relative"
                    whileFocus="focus"
                    variants={inputVariants}
                  >
                    <input
                      type="text"
                      value={tableInfo.tableNumber}
                      onChange={(e) => {
                        setTableInfo({
                          ...tableInfo,
                          tableNumber: e.target.value,
                        });
                        if (errors.tableNumber)
                          setErrors({ ...errors, tableNumber: "" });
                      }}
                      className={`w-full pl-10 pr-4 py-3 border-2 ${
                        errors.tableNumber
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : "border-amber-200 focus:border-amber-500 focus:ring-amber-200"
                      } bg-amber-50 rounded-lg focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      placeholder="Ex: 12"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-amber-500">#</span>
                    </div>
                  </motion.div>
                  <AnimatePresence>
                    {errors.tableNumber && (
                      <motion.p
                        className="mt-1 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.tableNumber}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-amber-700 mb-2">
                    Votre nom
                  </label>
                  <motion.div
                    className="relative"
                    whileFocus="focus"
                    variants={inputVariants}
                  >
                    <input
                      type="text"
                      value={tableInfo.customerName}
                      onChange={(e) => {
                        setTableInfo({
                          ...tableInfo,
                          customerName: e.target.value,
                        });
                        if (errors.customerName)
                          setErrors({ ...errors, customerName: "" });
                      }}
                      className={`w-full pl-10 pr-4 py-3 border-2 ${
                        errors.customerName
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : "border-amber-200 focus:border-amber-500 focus:ring-amber-200"
                      } bg-amber-50 rounded-lg focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      placeholder="Pour vous identifier auprès du serveur"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-amber-500" />
                    </div>
                  </motion.div>
                  <AnimatePresence>
                    {errors.customerName && (
                      <motion.p
                        className="mt-1 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.customerName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                className="flex justify-center"
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 transition-colors duration-200 flex items-center justify-center font-medium text-lg"
                >
                  Continuer vers le menu
                  <ArrowLongRightIcon className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 bg-amber-50 p-6 rounded-lg border border-amber-200 flex"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        >
          <InformationCircleIcon className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-800 font-medium mb-1">
              Comment ça marche ?
            </h3>
            <p className="text-amber-700 text-sm">
              Commandez directement depuis votre smartphone, et nos serveurs
              vous apporteront votre commande à table. Vous pouvez ajouter des
              plats à votre commande à tout moment, et payer directement depuis
              votre téléphone ou demander l'addition au serveur.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default TableOrder;
