import { useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrder } from "../contexts/OrderContext";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";

function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, updateQuantity } = useCart();
  const { orderInfo, updateOrderInfo } = useOrder();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // Ne réinitialiser que si le panier est vide et qu'il y a un type de commande défini
    if (items.length === 0 && orderInfo.type) {
      updateOrderInfo({
        type: null,
        deliveryInfo: null,
        reservationInfo: null,
        takeawayInfo: null,
        tableInfo: null,
        status: "pending",
      });
    }
  }, [items.length, orderInfo.type]);

  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    } else {
      removeItem(item.id);
    }
  };

  const handleCheckout = () => {
    if (!orderInfo.type) {
      // Si aucun type de commande n'est sélectionné, rediriger vers la sélection
      navigate("/order");
    } else {
      // Sinon, aller directement au paiement
      navigate("/payment");
    }
  };

  const handleClearCart = () => {
    clearCart();
    updateOrderInfo({
      type: null,
      deliveryInfo: null,
      reservationInfo: null,
      tableInfo: null,
      status: "pending",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.97 },
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 inline-block p-5 bg-amber-100 rounded-full"
          >
            <ShoppingBagIcon className="h-24 w-24 text-amber-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-amber-800 mb-4"
          >
            Votre panier est vide
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-amber-700 mb-8 max-w-md mx-auto"
          >
            Découvrez notre délicieuse sélection de plats et ajoutez-les à votre
            panier pour passer commande.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-lg hover:bg-amber-600 transition-colors shadow-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Retour au menu
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-amber-800">Votre panier</h1>
          <span className="text-amber-600 bg-amber-100 px-4 py-1 rounded-full font-medium">
            {totalItems} article{totalItems > 1 ? "s" : ""}
          </span>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8"
          >
            <motion.div
              layout
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100"
            >
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-6 border-b border-amber-100 last:border-b-0 flex gap-6"
                  >
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-amber-900">
                            {item.name}
                          </h3>
                          <p className="text-amber-600 text-sm mt-1">
                            {item.description}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, color: "#ef4444" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="text-amber-400 hover:text-red-600 transition-colors p-2"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </motion.button>
                      </div>

                      <div className="mt-4 flex justify-between items-end">
                        <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1">
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "#fef3c7",
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item, -1)}
                            className="p-2 rounded-md text-amber-600 hover:bg-amber-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </motion.button>
                          <span className="w-8 text-center font-medium text-amber-900">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "#fef3c7",
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuantityChange(item, 1)}
                            className="p-2 rounded-md text-amber-600 hover:bg-amber-100 transition-colors"
                            disabled={item.quantity >= 10}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </motion.button>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-amber-600">
                            Prix unitaire: {item.price.toFixed(2)} €
                          </div>
                          <div className="text-lg font-semibold text-amber-900 mt-1">
                            {(item.price * item.quantity).toFixed(2)} €
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6"
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleClearCart}
                className="text-amber-600 hover:text-red-600 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber-50"
              >
                <TrashIcon className="h-5 w-5" />
                Vider le panier
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-4 mt-8 lg:mt-0"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-amber-100">
              <h3 className="text-xl font-semibold text-amber-800 mb-6 flex items-center">
                <ReceiptPercentIcon className="h-6 w-6 mr-2 text-amber-500" />
                Résumé de la commande
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-amber-700">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Frais de livraison</span>
                  <span
                    className={
                      orderInfo.type === "delivery"
                        ? "text-amber-700"
                        : "text-green-600 font-medium"
                    }
                  >
                    {orderInfo.type === "delivery" ? "2.50 €" : "Gratuit"}
                  </span>
                </div>
                <div className="border-t border-amber-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-amber-900">
                    <span>Total</span>
                    <span>
                      {(
                        total + (orderInfo.type === "delivery" ? 2.5 : 0)
                      ).toFixed(2)}{" "}
                      €
                    </span>
                  </div>
                  <p className="text-amber-500 text-sm mt-1">TVA incluse</p>
                </div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 space-y-3"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleCheckout}
                  className="w-full bg-amber-500 text-white py-4 px-6 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {orderInfo.type ? (
                    <>
                      <CreditCardIcon className="h-5 w-5" />
                      Procéder au paiement
                    </>
                  ) : (
                    <>
                      <ShoppingBagIcon className="h-5 w-5" />
                      Choisir le mode de commande
                    </>
                  )}
                </motion.button>

                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to="/menu"
                    className="mt-4 w-full bg-amber-50 text-amber-700 py-4 px-6 rounded-lg hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 border border-amber-200"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Continuer les achats
                  </Link>
                </motion.div>
              </motion.div>

              {/* Informations supplémentaires */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 bg-amber-50 p-4 rounded-lg border border-amber-200"
              >
                <p className="text-amber-700 text-sm">
                  {orderInfo.type
                    ? "Vous avez choisi le mode " +
                      (orderInfo.type === "delivery"
                        ? "livraison"
                        : orderInfo.type === "takeaway"
                        ? "à emporter"
                        : orderInfo.type === "reservation"
                        ? "réservation"
                        : "sur place")
                    : "Choisissez un mode de commande pour continuer"}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
