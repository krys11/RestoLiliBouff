import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Images pour le carrousel
  const heroImages = [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  ];

  // Changement automatique des images du héros
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Animation au chargement initial
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Variantes d'animation
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemFade = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden font-sans">
      {/* Hero Section avec Carrousel */}
      <section className="relative h-screen max-h-[800px] min-h-[600px] bg-black overflow-hidden">
        {/* Carrousel d'images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImages[currentImage]})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Contenu Hero */}
        <div className="relative h-full flex flex-col justify-center container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 50,
            }}
            className="max-w-3xl"
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="block">Le Bistrot</span>
              <motion.span
                className="block text-2xl sm:text-3xl md:text-4xl mt-3 text-amber-200 font-light italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Cuisine française authentique
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Une expérience gastronomique exceptionnelle au cœur de la ville
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <Link
                to="/menu"
                className="group bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-2 text-lg shadow-lg shadow-amber-600/30"
              >
                Découvrir le Menu
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 1.5,
                    repeatDelay: 1,
                  }}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </motion.span>
              </Link>
              <Link
                to="/reservation"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-amber-800 transition-all duration-300 flex items-center text-lg backdrop-blur-sm"
              >
                Réserver une Table
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Indicateurs de carrousel */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImage ? "w-8 bg-amber-500" : "w-2 bg-white/50"
              }`}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Info Section - Flottante */}
      <section className="relative z-10 -mt-24 mb-16">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="bg-white rounded-xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={itemFade}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-amber-50 transition-colors duration-300"
            >
              <div className="bg-amber-100 p-3 rounded-full">
                <ClockIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Horaires</h3>
                <p className="text-gray-600">Lun-Dim: 11h30-23h00</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemFade}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-amber-50 transition-colors duration-300"
            >
              <div className="bg-amber-100 p-3 rounded-full">
                <MapPinIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Adresse</h3>
                <p className="text-gray-600">123 Rue de la Gastronomie</p>
              </div>
            </motion.div>

            <motion.div
              variants={itemFade}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-amber-50 transition-colors duration-300"
            >
              <div className="bg-amber-100 p-3 rounded-full">
                <PhoneIcon className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Réservations</h3>
                <p className="text-gray-600">01 23 45 67 89</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* À propos Section */}
      <section className="py-16 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div
              className="w-full lg:w-1/2 order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 relative">
                <span className="block mb-2 text-sm font-medium uppercase tracking-widest text-amber-600">
                  Notre histoire
                </span>
                Une tradition culinaire française depuis 1985
                <span className="absolute -left-8 top-0 h-full w-2 bg-amber-600 rounded-full"></span>
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Depuis plus de 35 ans, Le Bistrot apporte l'authenticité de la
                cuisine française dans votre assiette. Nos chefs, formés aux
                meilleures écoles de cuisine, sélectionnent avec soin des
                ingrédients locaux et de saison pour vous offrir une expérience
                gustative exceptionnelle.
              </p>
              <p className="text-gray-600 mb-8 text-lg">
                Notre philosophie : simplicité, authenticité et élégance. Chaque
                plat raconte une histoire, celle de notre passion pour la
                gastronomie française.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-amber-600 font-medium hover:text-amber-800 transition-colors group"
              >
                Découvrir notre histoire
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 1.5,
                  }}
                  className="ml-2"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              className="w-full lg:w-1/2 order-1 lg:order-2 relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                  alt="Notre restaurant"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Accent décoratif */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-100 rounded-full -z-10"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-200 rounded-full -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-neutral-100">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.span
              variants={itemFade}
              className="text-amber-600 font-medium uppercase tracking-widest"
            >
              Nos offres
            </motion.span>
            <motion.h2
              variants={itemFade}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            >
              Comment souhaitez-vous savourer notre cuisine ?
            </motion.h2>
            <motion.p variants={itemFade} className="text-gray-600 text-lg">
              Profitez de notre cuisine de plusieurs façons, selon vos envies et
              votre emploi du temps
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={scaleUp}
              className="bg-white rounded-2xl shadow-xl overflow-hidden group"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1526367790999-0150786686a2"
                  alt="Livraison"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">
                    Livraison à Domicile
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Profitez de nos délicieux plats directement chez vous, livrés
                  rapidement et dans les meilleures conditions
                </p>
                <Link
                  to="/delivery"
                  className="inline-flex items-center font-medium text-amber-600 hover:text-amber-800 transition-colors"
                >
                  Commander maintenant
                  <ChevronRightIcon className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={scaleUp}
              className="bg-white rounded-2xl shadow-xl overflow-hidden group"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
                  alt="À emporter"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">À Emporter</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Commandez à l'avance et récupérez votre repas sans attente,
                  parfaitement emballé pour conserver toutes les saveurs
                </p>
                <Link
                  to="/take-away"
                  className="inline-flex items-center font-medium text-amber-600 hover:text-amber-800 transition-colors"
                >
                  Voir le menu
                  <ChevronRightIcon className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={scaleUp}
              className="bg-white rounded-2xl shadow-xl overflow-hidden group"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                  alt="Sur place"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">Sur Place</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Profitez de l'ambiance unique de notre restaurant, du service
                  attentionné et d'une expérience gastronomique complète
                </p>
                <Link
                  to="/table-order"
                  className="inline-flex items-center font-medium text-amber-600 hover:text-amber-800 transition-colors"
                >
                  Réserver une table
                  <ChevronRightIcon className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.span
              variants={itemFade}
              className="text-amber-600 font-medium uppercase tracking-widest"
            >
              Témoignages
            </motion.span>
            <motion.h2
              variants={itemFade}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            >
              Ce que disent nos clients
            </motion.h2>
            <motion.p variants={itemFade} className="text-gray-600 text-lg">
              Découvrez les avis de nos clients qui partagent leur expérience au
              Bistrot
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Marie L.",
                comment:
                  "Une cuisine authentique et délicieuse qui m'a rappelé mon enfance en Provence. Le service est impeccable et l'ambiance chaleureuse !",
                rating: 5,
                image: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Pierre D.",
                comment:
                  "Les meilleurs plats français que j'ai mangés depuis longtemps. La carte des vins est exceptionnelle et les conseils du sommelier parfaits. À essayer absolument !",
                rating: 5,
                image: "https://randomuser.me/api/portraits/men/86.jpg",
              },
              {
                name: "Sophie M.",
                comment:
                  "Cadre magnifique et atmosphère chaleureuse. Les plats sont raffinés et le chef fait preuve d'une créativité impressionnante. Je recommande vivement !",
                rating: 5,
                image: "https://randomuser.me/api/portraits/women/2.jpg",
              },
            ].map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={scaleUp}
                className="bg-white p-8 rounded-2xl shadow-xl flex flex-col h-full"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-amber-200 p-0.5"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      {testimonial.name}
                    </h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "text-amber-400"
                              : "text-gray-300"
                          }`}
                          fill={
                            i < testimonial.rating ? "currentColor" : "none"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4 flex-grow">
                  "{testimonial.comment}"
                </p>
                <div className="h-0.5 w-12 bg-amber-200 mt-auto"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Galerie de plats */}
      <section className="py-16 bg-neutral-100 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.span
              variants={itemFade}
              className="text-amber-600 font-medium uppercase tracking-widest"
            >
              Notre cuisine
            </motion.span>
            <motion.h2
              variants={itemFade}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4"
            >
              Une expérience gustative exceptionnelle
            </motion.h2>
            <motion.p variants={itemFade} className="text-gray-600 text-lg">
              Découvrez un aperçu de nos créations culinaires
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327",
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
              "https://images.unsplash.com/photo-1432139509613-5c4255815697",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
              "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
              "https://images.unsplash.com/photo-1600335895229-6e75511892c8",
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
              "https://images.unsplash.com/photo-1485921325833-c519f76c4927",
            ].map((image, index) => (
              <motion.div
                key={index}
                variants={scaleUp}
                className={`overflow-hidden rounded-xl shadow-lg ${
                  index === 0 || index === 3 || index === 4 || index === 7
                    ? "col-span-2 row-span-2"
                    : ""
                }`}
                whileHover={{ scale: 1.03 }}
              >
                <motion.img
                  src={image}
                  alt={`Plat ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.7 }}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              to="/menu"
              className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-amber-600/20"
            >
              Voir tout notre menu
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-amber-900/80 backdrop-blur-sm"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Prêt à vivre une expérience gastronomique unique ?
            </h2>
            <p className="text-xl text-amber-100 mb-10">
              Réservez votre table dès maintenant pour découvrir notre cuisine
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/reservation"
                className="inline-block bg-white text-amber-800 px-8 py-4 rounded-lg hover:bg-amber-50 transition-colors shadow-xl font-medium text-lg"
              >
                Réserver une table
              </Link>
              <Link
                to="/menu"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-medium text-lg"
              >
                Voir le menu
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Éléments décoratifs */}
        <motion.div
          className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"
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
          className="absolute -top-16 -right-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"
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
      </section>
    </div>
  );
}
