import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../contexts/OrderContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/outline";

function TakeAway() {
  const navigate = useNavigate();
  const { updateOrderInfo } = useOrder();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    isOnSite: false,
    tableNumber: "",
    pickupTime: "asap",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    tableNumber: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    let newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (formData.isOnSite && !formData.tableNumber.trim()) {
      newErrors.tableNumber = "Le numéro de table est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateOrderInfo({
      type: "takeaway",
      takeawayInfo: {
        ...formData,
        status: "pending",
      },
    });
    navigate("/menu");
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const generateTimeOptions = () => {
    const options = [{ value: "asap", label: "Dès que possible" }];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const startMinute = Math.ceil(currentMinute / 15) * 15;
    let hour = currentHour;
    let minute = startMinute;

    if (minute >= 60) {
      hour += 1;
      minute = 0;
    }

    while (hour < 24) {
      while (minute < 60) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push({ value: timeString, label: timeString });
        minute += 15;
      }
      hour += 1;
      minute = 0;
    }

    return options;
  };

  // Animations
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    hover: {
      y: -5,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17,
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

  const checkboxVariants = {
    checked: {
      backgroundColor: "#f59e0b",
      borderColor: "#f59e0b",
      transition: { duration: 0.2 },
    },
    unchecked: {
      backgroundColor: "#fff",
      borderColor: "#d1d5db",
      transition: { duration: 0.2 },
    },
  };

  const inputClasses =
    "w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 focus:ring-opacity-50 transition-all duration-200";
  const labelClasses = "block text-sm font-medium text-amber-700 mb-2";

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
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold text-amber-800 mb-3">
            Commander à emporter
          </h1>
          <p className="text-amber-700 text-lg max-w-2xl mx-auto">
            Commandez maintenant et récupérez votre repas au restaurant à
            l'heure qui vous convient.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section informations personnelles */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
            <div className="p-8">
              <div className="flex items-center mb-6">
                <UserIcon className="h-6 w-6 text-amber-600 mr-3" />
                <h2 className="text-2xl font-semibold text-amber-800">
                  Informations personnelles
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Prénom</label>
                  <div className="relative">
                    <input
                      type="text"
                      className={`${inputClasses} ${
                        errors.firstName
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : ""
                      }`}
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <AnimatePresence>
                    {errors.firstName && (
                      <motion.p
                        className="mt-1 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.firstName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label className={labelClasses}>Nom</label>
                  <input
                    type="text"
                    required
                    className={`${inputClasses} ${
                      errors.lastName
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                        : ""
                    }`}
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Votre nom"
                  />
                  <AnimatePresence>
                    {errors.lastName && (
                      <motion.p
                        className="mt-1 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.lastName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section localisation */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
            <div className="p-8">
              <div className="flex items-center mb-6">
                <MapPinIcon className="h-6 w-6 text-amber-600 mr-3" />
                <h2 className="text-2xl font-semibold text-amber-800">
                  Localisation
                </h2>
              </div>
              <div className="space-y-6">
                <motion.label
                  className={`flex items-center p-4 rounded-lg cursor-pointer ${
                    formData.isOnSite
                      ? "bg-amber-100 border-2 border-amber-300"
                      : "bg-amber-50 border-2 border-amber-200 hover:bg-amber-100"
                  } transition-colors duration-200`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0"
                    variants={checkboxVariants}
                    animate={formData.isOnSite ? "checked" : "unchecked"}
                  >
                    {formData.isOnSite && (
                      <CheckCircleIcon className="h-5 w-5 text-white" />
                    )}
                  </motion.div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={formData.isOnSite}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isOnSite: e.target.checked,
                        tableNumber: e.target.checked
                          ? formData.tableNumber
                          : "",
                      })
                    }
                  />
                  <div>
                    <span className="text-base font-medium text-amber-800 block">
                      Je suis déjà sur place
                    </span>
                    <span className="text-sm text-amber-600">
                      Cochez cette case si vous êtes déjà dans notre restaurant
                    </span>
                  </div>
                </motion.label>

                <AnimatePresence>
                  {formData.isOnSite && (
                    <motion.div
                      className="ml-8"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className={labelClasses}>Numéro de table</label>
                      <div className="relative">
                        <input
                          type="text"
                          required={formData.isOnSite}
                          className={`${inputClasses} pl-10 ${
                            errors.tableNumber
                              ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                              : ""
                          }`}
                          value={formData.tableNumber}
                          onChange={(e) =>
                            handleInputChange("tableNumber", e.target.value)
                          }
                          placeholder="Ex: 12"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-amber-500">#</span>
                        </div>
                      </div>
                      {errors.tableNumber && (
                        <motion.p
                          className="mt-1 text-sm text-red-600"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.tableNumber}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Section heure de retrait */}
          <AnimatePresence>
            {!formData.isOnSite && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg overflow-hidden relative"
                variants={cardVariants}
                whileHover="hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <ClockIcon className="h-6 w-6 text-amber-600 mr-3" />
                    <h2 className="text-2xl font-semibold text-amber-800">
                      Heure de retrait
                    </h2>
                  </div>
                  <div className="relative">
                    <select
                      className={`${inputClasses} pl-10`}
                      value={formData.pickupTime}
                      onChange={(e) =>
                        setFormData({ ...formData, pickupTime: e.target.value })
                      }
                      required
                    >
                      {generateTimeOptions().map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-amber-600">
                    L'heure à laquelle vous souhaitez venir chercher votre
                    commande
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            className="flex justify-center mt-10"
          >
            <button
              type="submit"
              className="px-8 py-4 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600 transition-colors duration-200 flex items-center justify-center font-medium text-lg"
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Continuer ma commande
              <ArrowLongRightIcon className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </form>

        {/* Note d'information */}
        <motion.div
          className="mt-10 bg-amber-50 p-6 rounded-lg border border-amber-200 flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-amber-100 rounded-full p-2 h-min mr-4 flex-shrink-0">
            <ClockIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-amber-800 font-medium mb-1">
              Délai de préparation
            </h3>
            <p className="text-amber-700 text-sm">
              Le temps moyen de préparation de votre commande est de 15 à 25
              minutes selon l'affluence. Si vous choisissez "Dès que possible",
              nous vous informerons par téléphone dès que votre commande sera
              prête.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default TakeAway;
