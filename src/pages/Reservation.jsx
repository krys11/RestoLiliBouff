import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../contexts/OrderContext";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import {
  CalendarDaysIcon,
  UserIcon,
  ClockIcon,
  UsersIcon,
  PencilIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

function Reservation() {
  const navigate = useNavigate();
  const { orderInfo, updateOrderInfo } = useOrder();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsapp: "",
    date: "",
    time: "",
    guests: 1,
    specialRequests: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!orderInfo.type) {
      updateOrderInfo({
        ...orderInfo,
        type: "reservation",
      });
    }
    if (orderInfo.reservationInfo) {
      setFormData(orderInfo.reservationInfo);
    }
  }, [orderInfo, updateOrderInfo]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.whatsapp.trim())
      newErrors.whatsapp = "Le numéro WhatsApp est requis";
    if (!formData.date) newErrors.date = "La date est requise";
    if (!formData.time) newErrors.time = "L'heure est requise";

    // Validation WhatsApp (numéro de téléphone)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.whatsapp && !phoneRegex.test(formData.whatsapp)) {
      newErrors.whatsapp = "Numéro WhatsApp invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateOrderInfo({
        ...orderInfo,
        type: "reservation",
        reservationInfo: formData,
      });
      navigate("/menu"); // Redirection vers le menu pour choisir les plats
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Valider les informations personnelles avant de passer à l'étape suivante
      const newErrors = {};
      if (!formData.firstName.trim())
        newErrors.firstName = "Le prénom est requis";
      if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
      if (!formData.whatsapp.trim())
        newErrors.whatsapp = "Le numéro WhatsApp est requis";

      const phoneRegex = /^[0-9]{10}$/;
      if (formData.whatsapp && !phoneRegex.test(formData.whatsapp)) {
        newErrors.whatsapp = "Numéro WhatsApp invalide";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (currentStep === 2) {
      // Valider les informations de réservation avant de passer à l'étape finale
      const newErrors = {};
      if (!formData.date) newErrors.date = "La date est requise";
      if (!formData.time) newErrors.time = "L'heure est requise";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Obtenir la date minimum (aujourd'hui)
  const today = new Date().toISOString().split("T")[0];

  // Obtenir la date maximum (3 mois à partir d'aujourd'hui)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split("T")[0];

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
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
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
            Réservation de table
          </h1>
          <p className="text-amber-700 text-lg max-w-2xl mx-auto">
            Planifiez votre visite en avance et réservez une table pour profiter
            d'un repas inoubliable.
          </p>
        </motion.div>

        {/* Indicateur d'étapes */}
        <motion.div
          className="flex justify-between max-w-md mx-auto mb-10 relative"
          variants={itemVariants}
        >
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center z-10">
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
                  ? "Réservation"
                  : "Confirmation"}
              </span>
            </div>
          ))}
          {/* Ligne de connexion */}
          <div className="absolute left-0 right-0 h-0.5 bg-amber-200 top-5 -z-0" />
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
                  <UserIcon className="h-6 w-6 mr-2" />
                  Vos coordonnées
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Prénom
                    </label>
                    <motion.input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.firstName
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : "border-amber-200 focus:border-amber-500 focus:ring-amber-200"
                      } bg-amber-50 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      placeholder="Jean"
                      variants={itemVariants}
                      whileFocus="hover"
                    />
                    {errors.firstName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.firstName}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Nom
                    </label>
                    <motion.input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.lastName
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : "border-amber-200 focus:border-amber-500 focus:ring-amber-200"
                      } bg-amber-50 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      placeholder="Dupont"
                      variants={itemVariants}
                      whileFocus="hover"
                    />
                    {errors.lastName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.lastName}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-amber-700 mb-2">
                    Numéro WhatsApp
                  </label>
                  <div className="relative">
                    <motion.input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="0612345678"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 ${
                        errors.whatsapp
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : "border-amber-200 focus:border-amber-500 focus:ring-amber-200"
                      } bg-amber-50 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      variants={itemVariants}
                      whileFocus="hover"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-amber-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4c-4.38 0-7.93 3.55-7.93 7.93a7.9 7.9 0 0 0 1.23 4.22L4 20.92l4.84-1.27a7.92 7.92 0 0 0 3.76.96h.01c4.38 0 7.93-3.55 7.93-7.94 0-2.12-.83-4.11-2.32-5.6l-.62-.65zM12.04 18.3h-.01a6.57 6.57 0 0 1-3.35-.92l-.24-.14-2.49.65.67-2.43-.16-.25a6.59 6.59 0 0 1-1.01-3.49c0-3.64 2.97-6.6 6.61-6.6a6.56 6.56 0 0 1 4.67 1.94 6.55 6.55 0 0 1 1.93 4.67c.01 3.64-2.96 6.6-6.6 6.6zm3.63-4.94c-.2-.1-1.17-.58-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.5.64-.62.77-.11.13-.22.15-.43.05a5.5 5.5 0 0 1-2.7-2.36c-.21-.35.2-.33.58-1.08.07-.13.03-.25-.02-.35-.05-.1-.42-1.03-.58-1.4-.15-.37-.31-.31-.42-.32-.11 0-.24-.01-.36-.01-.13 0-.33.05-.5.25-.17.2-.66.64-.66 1.57s.68 1.83.77 1.95c.1.13 1.33 2.11 3.28 2.87.46.2.82.31 1.09.4.46.15.88.13 1.21.08.37-.06 1.15-.47 1.31-.93.17-.46.17-.85.12-.93-.05-.1-.19-.15-.4-.25z" />
                      </svg>
                    </div>
                  </div>
                  {errors.whatsapp && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.whatsapp}
                    </motion.p>
                  )}
                  <p className="mt-2 text-sm text-amber-600">
                    Nous utiliserons ce numéro pour vous envoyer la confirmation
                    de réservation via WhatsApp
                  </p>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continuer
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
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
                  <CalendarDaysIcon className="h-6 w-6 mr-2" />
                  Détails de la réservation
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Date de réservation
                    </label>
                    <motion.input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      max={maxDateString}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.date
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : "border-amber-200 focus:border-amber-500 focus:ring-amber-200"
                      } bg-amber-50 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      variants={itemVariants}
                      whileFocus="hover"
                    />
                    {errors.date && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.date}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Heure d'arrivée
                    </label>
                    <motion.select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.time
                          ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                          : "border-amber-200 focus:border-amber-500 focus:ring-amber-200"
                      } bg-amber-50 focus:ring focus:ring-opacity-50 transition-all duration-200`}
                      variants={itemVariants}
                      whileFocus="hover"
                    >
                      <option value="">Sélectionnez une heure</option>
                      {Array.from({ length: 13 }, (_, i) => i + 11).map(
                        (hour) => (
                          <React.Fragment key={hour}>
                            <option value={`${hour}:00`}>{hour}:00</option>
                            <option value={`${hour}:30`}>{hour}:30</option>
                          </React.Fragment>
                        )
                      )}
                    </motion.select>
                    {errors.time && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.time}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-amber-700 mb-2">
                    Nombre de personnes
                  </label>
                  <div className="relative">
                    <motion.select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-amber-200 bg-amber-50 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 transition-all duration-200"
                      variants={itemVariants}
                      whileFocus="hover"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(
                        (num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "personne" : "personnes"}
                          </option>
                        )
                      )}
                    </motion.select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UsersIcon className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white border border-amber-300 text-amber-700 rounded-lg shadow-sm hover:bg-amber-50 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeftIcon className="mr-2 h-5 w-5" />
                    Retour
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continuer
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
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
                  <PencilIcon className="h-6 w-6 mr-2" />
                  Demandes spéciales
                </h2>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-amber-700 mb-2">
                    Avez-vous des demandes particulières ?
                  </label>
                  <motion.textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border-2 border-amber-200 bg-amber-50 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 transition-all duration-200"
                    placeholder="Allergies, préférences de placement, occasion spéciale..."
                    variants={itemVariants}
                    whileFocus="hover"
                  />
                  <p className="mt-2 text-sm text-amber-600">
                    Nous ferons de notre mieux pour satisfaire vos demandes
                    selon nos disponibilités
                  </p>
                </div>

                {/* Résumé de la réservation */}
                <motion.div
                  className="bg-amber-50 p-5 rounded-lg border border-amber-200 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Résumé de votre réservation
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-amber-700">Nom</p>
                      <p className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-amber-700">Contact</p>
                      <p className="font-medium">{formData.whatsapp}</p>
                    </div>
                    <div>
                      <p className="text-amber-700">Date et heure</p>
                      <p className="font-medium">
                        {formData.date} à {formData.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-amber-700">Nombre de personnes</p>
                      <p className="font-medium">
                        {formData.guests}{" "}
                        {formData.guests === 1 ? "personne" : "personnes"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-8 flex justify-between">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white border border-amber-300 text-amber-700 rounded-lg shadow-sm hover:bg-amber-50 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeftIcon className="mr-2 h-5 w-5" />
                    Retour
                  </motion.button>
                  <motion.button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Réserver et commander
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Note de réservation */}
        <motion.div
          className="mt-10 bg-amber-50 p-6 rounded-lg border border-amber-200"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
        >
          <h3 className="text-amber-800 font-medium mb-2">
            Informations de réservation
          </h3>
          <p className="text-amber-700 text-sm">
            Les réservations peuvent être annulées ou modifiées jusqu'à 2 heures
            avant l'heure prévue. Pour tout changement après ce délai, veuillez
            nous contacter par téléphone. Un acompte peut être demandé pour les
            groupes de plus de 8 personnes.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Reservation;
