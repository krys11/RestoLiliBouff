import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrder } from "../contexts/OrderContext";
import { useCart } from "../contexts/CartContext";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  CheckCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  ArrowPathIcon,
  CurrencyEuroIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";

function Payment() {
  const navigate = useNavigate();
  const { orderInfo, updateOrderInfo } = useOrder();
  const { items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' ou 'cash'
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = orderInfo.type === "delivery" ? 2.5 : 0;
  const total = subtotal + deliveryFee;

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    } else if (!orderInfo.type) {
      navigate("/order");
    }
  }, [items, orderInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const itemsWithImages = items.map((item) => ({
        ...item,
        imageUrl: item.image,
      }));

      const orderData = {
        ...orderInfo,
        createdAt: new Date().toISOString(),
        paymentInfo: {
          method: paymentMethod,
          amount: total,
          date: new Date().toISOString(),
          status: paymentMethod === "cash" ? "pending" : "completed",
        },
        contactInfo: {
          whatsapp: whatsappNumber,
        },
        items: itemsWithImages,
        subtotal,
        total,
        status: "pending",
        orderId: `ORD-${Date.now()}`,
        isRead: false,
      };

      await addDoc(collection(db, "orders"), orderData);

      updateOrderInfo(orderData);
      clearCart();
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      setIsProcessing(false);
    }
  };

  // Variants d'animation
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
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
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hover: {
      y: -5,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const formControlVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200 },
    },
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.4)",
      transition: { type: "spring", stiffness: 300, damping: 10 },
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
        damping: 10,
      },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#d97706", // amber-600
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
    disabled: {
      opacity: 0.7,
      scale: 1,
      backgroundColor: "#fcd34d", // amber-300
    },
  };

  const paymentMethodVariants = {
    unselected: {
      borderColor: "rgb(229 231 235)",
      backgroundColor: "white",
      y: 0,
    },
    selected: {
      borderColor: "rgb(245 158 11)", // amber-500
      backgroundColor: "rgb(254 243 199)", // amber-100
      y: -3,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    hover: {
      y: -3,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  };

  // Style de qualité
  const inputClasses =
    "w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-amber-50/50 transition-all";
  const labelClasses = "block text-sm font-medium text-amber-700 mb-2";

  const getOrderTypeDetails = () => {
    switch (orderInfo.type) {
      case "delivery":
        return {
          title: "Livraison à domicile",
          color: "amber",
          details: [
            `Adresse: ${orderInfo.deliveryInfo?.address}`,
            `Client: ${orderInfo.deliveryInfo?.firstName} ${orderInfo.deliveryInfo?.lastName}`,
          ],
        };
      case "takeaway":
        return {
          title: "Commande à emporter",
          color: "amber",
          details: [
            `Heure de retrait: ${
              orderInfo.takeawayInfo?.pickupTime === "asap"
                ? "Dès que possible"
                : orderInfo.takeawayInfo?.pickupTime
            }`,
            `Client: ${orderInfo.takeawayInfo?.firstName} ${orderInfo.takeawayInfo?.lastName}`,
          ],
        };
      case "reservation":
        return {
          title: "Réservation",
          color: "amber",
          details: [
            `Date: ${new Date(
              orderInfo.reservationInfo?.date
            ).toLocaleDateString()} à ${orderInfo.reservationInfo?.time}`,
            `Nombre de personnes: ${orderInfo.reservationInfo?.guests}`,
            `Client: ${orderInfo.reservationInfo?.firstName} ${orderInfo.reservationInfo?.lastName}`,
          ],
        };
      case "on-site":
      default:
        return {
          title: "Commande sur place",
          color: "amber",
          details: [
            `Table N°: ${orderInfo.tableInfo?.tableNumber}`,
            `Client: ${orderInfo.tableInfo?.customerName}`,
          ],
        };
    }
  };

  const orderTypeInfo = getOrderTypeDetails();

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-20 pb-12"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-4xl font-bold text-amber-900 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          Paiement
        </motion.h1>

        <motion.p
          className="text-lg text-amber-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Finalisez votre commande en toute sécurité
        </motion.p>

        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 mb-8"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
          <div className="p-6 md:p-8">
            {/* Résumé de la commande */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                <ReceiptRefundIcon className="h-6 w-6 mr-2 text-amber-500" />
                Résumé de la commande
              </h2>

              <motion.div
                className={`bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-medium text-amber-800 mb-2 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-amber-600" />
                  {orderTypeInfo.title}
                </h3>
                {orderTypeInfo.details.map((detail, index) => (
                  <motion.p
                    key={index}
                    className="text-amber-700 text-sm mb-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {detail}
                  </motion.p>
                ))}
              </motion.div>

              <div className="space-y-3">
                <div className="flex justify-between text-amber-700 text-base">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                {orderInfo.type === "delivery" && (
                  <div className="flex justify-between text-amber-700 text-base">
                    <span>Frais de livraison</span>
                    <span>2.50 €</span>
                  </div>
                )}
                <motion.div
                  className="flex justify-between text-lg font-bold text-amber-900 pt-3 border-t border-amber-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="flex items-center">
                    <CurrencyEuroIcon className="h-5 w-5 mr-1 text-amber-600" />
                    Total
                  </span>
                  <span>{total.toFixed(2)} €</span>
                </motion.div>
                <p className="text-amber-500 text-sm">TVA incluse</p>
              </div>
            </div>

            {/* Numéro WhatsApp */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                <DevicePhoneMobileIcon className="h-6 w-6 mr-2 text-amber-500" />
                Contact
              </h2>
              <div className="relative">
                <label className={labelClasses}>Numéro WhatsApp</label>
                <motion.div
                  className="relative"
                  variants={formControlVariants}
                  initial="initial"
                  animate="animate"
                  whileFocus="focus"
                >
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    onFocus={() => setFocusedField("whatsapp")}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClasses} pl-10`}
                    placeholder="ex: +229 XX XX XX XX"
                    required
                  />
                  <span className="absolute left-3 top-3">
                    <svg
                      className="w-5 h-5 text-green-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm.031 18c-.833 0-1.65-.087-2.433-.252l-2.703.703.718-2.605c-.907-.957-1.469-2.244-1.469-3.654 0-2.953 2.393-5.346 5.346-5.346s5.346 2.393 5.346 5.346-2.393 5.346-5.346 5.346z" />
                    </svg>
                  </span>
                </motion.div>
                <p className="mt-1 text-sm text-amber-600">
                  Pour recevoir les notifications de votre commande
                </p>
              </div>
            </div>

            {/* Choix du mode de paiement */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
                <CreditCardIcon className="h-6 w-6 mr-2 text-amber-500" />
                Mode de paiement
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  variants={paymentMethodVariants}
                  initial="unselected"
                  animate={paymentMethod === "card" ? "selected" : "unselected"}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  className="p-5 rounded-lg border-2 text-center transition-all"
                >
                  <div className="flex items-center justify-center mb-2">
                    <CreditCardIcon className="h-6 w-6 mr-2 text-amber-600" />
                    <span className="block font-medium text-amber-900">
                      Carte bancaire
                    </span>
                  </div>
                  <span className="text-sm text-amber-600 flex items-center justify-center">
                    <ShieldCheckIcon className="h-4 w-4 mr-1" />
                    Paiement sécurisé
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  variants={paymentMethodVariants}
                  initial="unselected"
                  animate={paymentMethod === "cash" ? "selected" : "unselected"}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  className="p-5 rounded-lg border-2 text-center transition-all"
                >
                  <div className="flex items-center justify-center mb-2">
                    <BanknotesIcon className="h-6 w-6 mr-2 text-amber-600" />
                    <span className="block font-medium text-amber-900">
                      Espèces
                    </span>
                  </div>
                  <span className="text-sm text-amber-600">
                    Paiement à table
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Formulaire de paiement par carte */}
            <AnimatePresence mode="wait">
              {paymentMethod === "card" && (
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <motion.div
                    variants={formControlVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <label className={labelClasses}>Numéro de carte</label>
                    <motion.div
                      className="relative"
                      variants={formControlVariants}
                      animate={
                        focusedField === "cardNumber" ? "focus" : "animate"
                      }
                    >
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardNumber: e.target.value,
                          })
                        }
                        onFocus={() => setFocusedField("cardNumber")}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </motion.div>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      variants={formControlVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <label className={labelClasses}>Date d'expiration</label>
                      <motion.div
                        variants={formControlVariants}
                        animate={
                          focusedField === "expiryDate" ? "focus" : "animate"
                        }
                      >
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              expiryDate: e.target.value,
                            })
                          }
                          onFocus={() => setFocusedField("expiryDate")}
                          onBlur={() => setFocusedField(null)}
                          className={inputClasses}
                          placeholder="MM/AA"
                          required
                        />
                      </motion.div>
                    </motion.div>
                    <motion.div
                      variants={formControlVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <label className={labelClasses}>CVV</label>
                      <motion.div
                        variants={formControlVariants}
                        animate={focusedField === "cvv" ? "focus" : "animate"}
                      >
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cvv: e.target.value,
                            })
                          }
                          onFocus={() => setFocusedField("cvv")}
                          onBlur={() => setFocusedField(null)}
                          className={inputClasses}
                          placeholder="123"
                          required
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.div
                    variants={formControlVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <label className={labelClasses}>Nom sur la carte</label>
                    <motion.div
                      variants={formControlVariants}
                      animate={focusedField === "name" ? "focus" : "animate"}
                    >
                      <input
                        type="text"
                        value={paymentInfo.name}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            name: e.target.value,
                          })
                        }
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses}
                        required
                      />
                    </motion.div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-amber-500 text-white py-4 px-6 rounded-lg font-medium shadow-md transition-all flex items-center justify-center"
                    variants={buttonVariants}
                    initial="initial"
                    animate={isProcessing ? "disabled" : "animate"}
                    whileHover={isProcessing ? "" : "hover"}
                    whileTap={isProcessing ? "" : "tap"}
                  >
                    {isProcessing ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon className="h-5 w-5 mr-2" />
                        Payer maintenant
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}

              {/* Paiement en espèces */}
              {paymentMethod === "cash" && (
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <motion.div
                    className="bg-amber-50 p-5 rounded-lg border border-amber-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-start">
                      <BanknotesIcon className="h-6 w-6 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-amber-800">
                        Vous avez choisi de payer en espèces. Le paiement sera
                        effectué directement à votre table.
                      </p>
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-amber-500 text-white py-4 px-6 rounded-lg font-medium shadow-md transition-all flex items-center justify-center"
                    variants={buttonVariants}
                    initial="initial"
                    animate={isProcessing ? "disabled" : "animate"}
                    whileHover={isProcessing ? "" : "hover"}
                    whileTap={isProcessing ? "" : "tap"}
                  >
                    {isProcessing ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Confirmer la commande
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Effet décoratif */}
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
    </motion.div>
  );
}

export default Payment;
