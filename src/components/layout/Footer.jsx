import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  EnvelopeIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Variants pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const socialVariants = {
    hidden: { scale: 0 },
    visible: (i) => ({
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
      },
    }),
  };

  const buttonVariants = {
    hover: {
      y: -3,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        yoyo: Infinity,
        duration: 1.5,
      },
    },
  };

  return (
    <footer className="bg-gradient-to-br from-amber-900 to-amber-800 text-white relative">
      {/* Vague décorative en haut du footer */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden -translate-y-full">
        <svg
          className="absolute bottom-0 w-full h-16 text-amber-900"
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 48L40 42.6667C80 37.3333 160 26.6667 240 21.3333C320 16 400 16 480 21.3333C560 26.6667 640 37.3333 720 37.3333C800 37.3333 880 26.6667 960 21.3333C1040 16 1120 16 1200 10.6667C1280 5.33333 1360 0 1400 -2.62268e-06L1440 0V48H1400C1360 48 1280 48 1200 48C1120 48 1040 48 960 48C880 48 800 48 720 48C640 48 560 48 480 48C400 48 320 48 240 48C160 48 80 48 40 48H0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
          {/* Section Brand */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent mb-4">
              Le Bistrot
            </h3>
            <p className="text-amber-100 mb-6 max-w-xs">
              Une cuisine française authentique servie dans un cadre chaleureux
              et élégant au cœur de la ville.
            </p>
            <div className="flex space-x-4">
              {[
                { name: "Facebook", icon: "facebook", href: "#" },
                { name: "Twitter", icon: "twitter", href: "#" },
                { name: "Instagram", icon: "instagram", href: "#" },
              ].map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-amber-800 hover:bg-amber-700 rounded-full transition-colors duration-300 flex items-center justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialVariants}
                  custom={i}
                >
                  <img
                    src={`https://cdn.simpleicons.org/${social.icon}/white`}
                    alt={social.name}
                    className="w-5 h-5"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Section Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-amber-100 mb-6 uppercase tracking-wider">
              Contactez-nous
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPinIcon className="h-6 w-6 text-amber-300 flex-shrink-0 mt-0.5" />
                <span className="text-amber-100">
                  123 Rue de la Gastronomie
                  <br />
                  75000 Paris
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-amber-300 flex-shrink-0" />
                <span className="text-amber-100">01 23 45 67 89</span>
              </li>
              <li className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-amber-300 flex-shrink-0" />
                <span className="text-amber-100">contact@lebistrot.fr</span>
              </li>
            </ul>
          </motion.div>

          {/* Section Horaires */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-amber-100 mb-6 uppercase tracking-wider">
              Nos Horaires
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-amber-300 flex-shrink-0" />
                <div>
                  <p className="text-amber-100">Lundi - Vendredi:</p>
                  <p className="text-amber-200 font-medium">11h00 - 23h00</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-amber-300 flex-shrink-0" />
                <div>
                  <p className="text-amber-100">Samedi - Dimanche:</p>
                  <p className="text-amber-200 font-medium">11h00 - 00h00</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Section Liens Rapides */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-amber-100 mb-6 uppercase tracking-wider">
              Liens Rapides
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Accueil", href: "/" },
                { name: "Menu", href: "/menu" },
                { name: "Réservation", href: "/reservation" },
                { name: "Livraison", href: "/delivery" },
                { name: "À propos", href: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-amber-100 hover:text-amber-300 transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="pt-10 mt-10 border-t border-amber-700/50 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-amber-200/80 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Le Bistrot. Tous droits réservés.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-amber-200/80">
            <Link
              to="/mentions-legales"
              className="hover:text-amber-100 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              to="/politique-confidentialite"
              className="hover:text-amber-100 transition-colors"
            >
              Politique de confidentialité
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Bouton Retour en haut */}
      <motion.button
        onClick={scrollToTop}
        className="absolute right-8 -top-5 bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-500 transition-colors focus:outline-none"
        whileHover="hover"
        variants={buttonVariants}
        aria-label="Retour en haut"
      >
        <ArrowUpIcon className="h-5 w-5" />
      </motion.button>
    </footer>
  );
}
