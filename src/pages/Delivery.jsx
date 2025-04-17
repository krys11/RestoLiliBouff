import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../contexts/OrderContext";
import {
  TruckIcon,
  ClockIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

function Delivery() {
  const navigate = useNavigate();
  const { updateOrderInfo } = useOrder();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    instructions: "",
    time: "asap",
  });

  const [selectedTime, setSelectedTime] = useState("asap");
  const timeSlots = [
    {
      id: "asap",
      label: "Dès que possible",
      icon: <ClockIcon className="h-5 w-5 mr-2" />,
    },
    {
      id: "30min",
      label: "Dans 30 minutes",
      icon: <ClockIcon className="h-5 w-5 mr-2" />,
    },
    {
      id: "1h",
      label: "Dans 1 heure",
      icon: <ClockIcon className="h-5 w-5 mr-2" />,
    },
    {
      id: "2h",
      label: "Dans 2 heures",
      icon: <ClockIcon className="h-5 w-5 mr-2" />,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mettre à jour le contexte avec les informations de livraison
    updateOrderInfo({
      type: "delivery",
      deliveryInfo: {
        ...deliveryInfo,
        time: selectedTime,
      },
    });

    // Rediriger vers la page du menu
    navigate("/menu");
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Variantes d'animation
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
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
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
        <motion.div className="mb-10 text-center" variants={itemVariants}>
          <h1 className="text-4xl font-bold text-amber-800 mb-3">
            Livraison à domicile
          </h1>
          <p className="text-amber-700 text-lg max-w-2xl mx-auto">
            Savourez nos délicieux plats directement chez vous. Remplissez les
            informations ci-dessous pour commander.
          </p>
        </motion.div>

        {/* Indicateur d'étapes */}
        <motion.div
          className="flex justify-between max-w-md mx-auto mb-10"
          variants={itemVariants}
        >
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? "bg-amber-500 text-white"
                    : "bg-amber-200 text-amber-700"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {step}
              </motion.div>
              <span
                className={`mt-2 text-sm ${
                  currentStep >= step ? "text-amber-800" : "text-amber-500"
                }`}
              >
                {step === 1
                  ? "Coordonnées"
                  : step === 2
                  ? "Adresse"
                  : "Horaire"}
              </span>
            </div>
          ))}
          {/* Ligne de connexion */}
          <div className="absolute left-0 right-0 h-0.5 bg-amber-200 top-5 -z-10" />
        </motion.div>

        {/* Formulaire par étapes */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden relative"
          variants={itemVariants}
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />

          <AnimatePresence mode="wait" custom={currentStep}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-8"
              >
                <h2 className="text-2xl font-semibold text-amber-800 mb-6 flex items-center">
                  <PencilSquareIcon className="h-6 w-6 mr-2" />
                  Vos coordonnées
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Prénom
                    </label>
                    <motion.input
                      type="text"
                      value={deliveryInfo.firstName}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                      placeholder="Jean"
                      required
                      variants={itemVariants}
                      whileFocus="hover"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Nom
                    </label>
                    <motion.input
                      type="text"
                      value={deliveryInfo.lastName}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                      placeholder="Dupont"
                      required
                      variants={itemVariants}
                      whileFocus="hover"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continuer
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-8"
              >
                <h2 className="text-2xl font-semibold text-amber-800 mb-6 flex items-center">
                  <TruckIcon className="h-6 w-6 mr-2" />
                  Adresse de livraison
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Adresse
                    </label>
                    <motion.input
                      type="text"
                      value={deliveryInfo.address}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                      placeholder="123 rue de la Paix"
                      required
                      variants={itemVariants}
                      whileFocus="hover"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Appartement, étage (optionnel)
                    </label>
                    <motion.input
                      type="text"
                      value={deliveryInfo.apartment}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          apartment: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                      placeholder="Apt 4B, 3ème étage"
                      variants={itemVariants}
                      whileFocus="hover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-2">
                        Ville
                      </label>
                      <motion.input
                        type="text"
                        value={deliveryInfo.city}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                        required
                        variants={itemVariants}
                        whileFocus="hover"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-2">
                        Code Postal
                      </label>
                      <motion.input
                        type="text"
                        value={deliveryInfo.postalCode}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            postalCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                        required
                        variants={itemVariants}
                        whileFocus="hover"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white border border-amber-300 text-amber-700 rounded-lg shadow-sm hover:bg-amber-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Retour
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continuer
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-8"
              >
                <h2 className="text-2xl font-semibold text-amber-800 mb-6 flex items-center">
                  <ClockIcon className="h-6 w-6 mr-2" />
                  Horaire et instructions
                </h2>

                <div>
                  <label className="block text-sm font-medium text-amber-700 mb-4">
                    Quand souhaitez-vous être livré?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {timeSlots.map((slot) => (
                      <motion.button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedTime(slot.id)}
                        className={`px-4 py-3 rounded-lg border flex items-center justify-center ${
                          selectedTime === slot.id
                            ? "border-amber-500 bg-amber-100 text-amber-700 shadow-sm"
                            : "border-amber-200 hover:border-amber-300 text-amber-600"
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {slot.icon}
                        {slot.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-amber-700 mb-2">
                    Instructions spéciales (optionnel)
                  </label>
                  <motion.textarea
                    value={deliveryInfo.instructions}
                    onChange={(e) =>
                      setDeliveryInfo({
                        ...deliveryInfo,
                        instructions: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    rows="3"
                    placeholder="Code d'entrée, instructions pour le livreur..."
                    variants={itemVariants}
                    whileFocus="hover"
                  />
                </div>

                <div className="mt-8 flex justify-between">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white border border-amber-300 text-amber-700 rounded-lg shadow-sm hover:bg-amber-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Retour
                  </motion.button>
                  <motion.button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TruckIcon className="h-5 w-5 mr-2" />
                    Commander maintenant
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Note de livraison */}
        <motion.div
          className="mt-10 bg-amber-50 p-6 rounded-lg border border-amber-200"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
        >
          <h3 className="text-amber-800 font-medium mb-2">
            Informations de livraison
          </h3>
          <p className="text-amber-700 text-sm">
            Livraison disponible dans un rayon de 10km autour de notre
            restaurant. Temps de livraison estimé: 30-45 minutes selon votre
            localisation. Frais de livraison offerts pour toute commande
            supérieure à 30€.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Delivery;
