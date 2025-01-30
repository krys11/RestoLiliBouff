import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80")'
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Le Bistrot
              <span className="block text-2xl sm:text-3xl md:text-4xl mt-2 text-gray-300">
                Cuisine française authentique
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8">
              Découvrez une expérience gastronomique unique dans un cadre chaleureux et élégant
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center"
              >
                Découvrir le Menu
              </Link>
              <Link
                to="/reservation"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-colors flex items-center"
              >
                Réserver une Table
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <ClockIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Horaires</h3>
                <p className="text-gray-600">Lun-Dim: 11h30-23h00</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <MapPinIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Adresse</h3>
                <p className="text-gray-600">123 Rue de la Gastronomie</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex items-center space-x-4"
            >
              <PhoneIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Réservations</h3>
                <p className="text-gray-600">01 23 45 67 89</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nos Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profitez de notre cuisine de plusieurs façons, selon vos envies et votre emploi du temps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1526367790999-0150786686a2"
                  alt="Livraison"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Livraison à Domicile</h3>
                <p className="text-gray-600 mb-4">
                  Profitez de nos délicieux plats directement chez vous
                </p>
                <Link
                  to="/delivery"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Commander maintenant
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
                  alt="À emporter"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">À Emporter</h3>
                <p className="text-gray-600 mb-4">
                  Commandez à l'avance et récupérez votre repas sans attente
                </p>
                <Link
                  to="/menu"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Voir le menu
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                  alt="Sur place"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sur Place</h3>
                <p className="text-gray-600 mb-4">
                  Profitez de l'ambiance unique de notre restaurant
                </p>
                <Link
                  to="/table-order"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Commander sur place
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les avis de nos clients satisfaits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie L.",
                comment: "Une cuisine authentique et délicieuse. Le service est impeccable !",
                rating: 5
              },
              {
                name: "Pierre D.",
                comment: "Les meilleurs plats français que j'ai mangés depuis longtemps. À essayer absolument !",
                rating: 5
              },
              {
                name: "Sophie M.",
                comment: "Cadre magnifique et atmosphère chaleureuse. Je recommande vivement !",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                <p className="font-semibold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Prêt à vivre une expérience gastronomique unique ?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Réservez votre table dès maintenant
            </p>
            <Link
              to="/reservation"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Réserver une table
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;