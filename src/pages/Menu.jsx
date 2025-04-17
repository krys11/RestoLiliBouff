import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ShoppingCartIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const MENU_CATEGORIES = [
  { id: "entrees", name: "Entrées", icon: "🥗" },
  { id: "plats", name: "Plats Principaux", icon: "🍽️" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "boissons", name: "Boissons", icon: "🥤" },
];

const MENU_ITEMS = {
  entrees: [
    {
      id: 1,
      name: "Salade César",
      price: 8.5,
      description: "Laitue romaine, croûtons, parmesan, sauce césar maison",
      image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
      allergenes: ["Gluten", "Lactose"],
      vegetarien: true,
    },
    {
      id: 2,
      name: "Soupe à l'oignon",
      price: 7.5,
      description: "Soupe traditionnelle française gratinée au fromage",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
      allergenes: ["Lactose"],
      vegetarien: true,
    },
    {
      id: 9,
      name: "Foie Gras Maison",
      price: 16.5,
      description:
        "Foie gras de canard mi-cuit, chutney de figues, pain brioché",
      image: "https://images.unsplash.com/photo-1625944525903-70b4cd82d42c",
      allergenes: ["Gluten"],
      vegetarien: false,
    },
    {
      id: 10,
      name: "Escargots de Bourgogne",
      price: 12.0,
      description: "6 escargots préparés au beurre persillé",
      image: "https://images.unsplash.com/photo-1596456519192-da98e6f5a9f8",
      allergenes: ["Lactose"],
      vegetarien: false,
    },
    {
      id: 11,
      name: "Tartare de Saumon",
      price: 14.5,
      description: "Saumon frais coupé au couteau, avocat, citron vert",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      allergenes: ["Poisson"],
      vegetarien: false,
    },
  ],
  plats: [
    {
      id: 3,
      name: "Steak Frites",
      price: 22.0,
      description: "Steak de bœuf français, frites maison, sauce au poivre",
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e",
      allergenes: [],
      vegetarien: false,
    },
    {
      id: 4,
      name: "Saumon Grillé",
      price: 24.0,
      description:
        "Saumon frais de l'Atlantique, légumes de saison, sauce citronnée",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
      allergenes: ["Poisson"],
      vegetarien: false,
    },
    {
      id: 12,
      name: "Coq au Vin",
      price: 26.0,
      description:
        "Coq mijoté au vin rouge, lardons, champignons, pommes de terre",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
      allergenes: [],
      vegetarien: false,
    },
    {
      id: 13,
      name: "Magret de Canard",
      price: 28.0,
      description:
        "Magret de canard rôti, sauce aux fruits rouges, gratin dauphinois",
      image: "https://images.unsplash.com/photo-1564436872-f6d81182df12",
      allergenes: ["Lactose"],
      vegetarien: false,
    },
    {
      id: 14,
      name: "Bouillabaisse",
      price: 32.0,
      description:
        "Soupe de poissons traditionnelle marseillaise, rouille, croûtons",
      image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b",
      allergenes: ["Gluten", "Poisson"],
      vegetarien: false,
    },
    {
      id: 15,
      name: "Ratatouille",
      price: 18.0,
      description: "Légumes provençaux mijotés, riz basmati",
      image: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c",
      allergenes: [],
      vegetarien: true,
    },
  ],
  desserts: [
    {
      id: 5,
      name: "Crème Brûlée",
      price: 7.0,
      description: "Dessert traditionnel français à la vanille de Madagascar",
      image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc",
      allergenes: ["Lactose", "Œufs"],
      vegetarien: true,
    },
    {
      id: 6,
      name: "Tarte Tatin",
      price: 8.0,
      description: "Tarte aux pommes caramélisées servie avec crème fraîche",
      image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13",
      allergenes: ["Gluten", "Lactose"],
      vegetarien: true,
    },
    {
      id: 16,
      name: "Profiteroles",
      price: 9.5,
      description: "Choux à la crème, sauce chocolat chaud, amandes effilées",
      image: "https://images.unsplash.com/photo-1505976378723-9726b54e9bb9",
      allergenes: ["Gluten", "Lactose", "Œufs"],
      vegetarien: true,
    },
    {
      id: 17,
      name: "Millefeuille",
      price: 8.5,
      description:
        "Pâte feuilletée, crème pâtissière à la vanille, glaçage royal",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814",
      allergenes: ["Gluten", "Lactose", "Œufs"],
      vegetarien: true,
    },
    {
      id: 18,
      name: "Mousse au Chocolat",
      price: 7.5,
      description: "Mousse légère au chocolat noir 70%, copeaux de chocolat",
      image: "https://images.unsplash.com/photo-1511715112108-9acc6c3ff61f",
      allergenes: ["Lactose", "Œufs"],
      vegetarien: true,
    },
  ],
  boissons: [
    {
      id: 7,
      name: "Vin Rouge",
      price: 6.0,
      description: "Verre de vin rouge de la maison - Bordeaux AOC",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
      allergenes: ["Sulfites"],
      vegetarien: true,
    },
    {
      id: 8,
      name: "Eau Minérale",
      price: 3.5,
      description: "Bouteille d'eau minérale des Alpes françaises 50cl",
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504",
      allergenes: [],
      vegetarien: true,
    },
    {
      id: 19,
      name: "Vin Blanc",
      price: 6.0,
      description: "Verre de vin blanc - Chablis AOC",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb",
      allergenes: ["Sulfites"],
      vegetarien: true,
    },
    {
      id: 20,
      name: "Champagne",
      price: 12.0,
      description: "Coupe de champagne - Brut",
      image: "https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb",
      allergenes: ["Sulfites"],
      vegetarien: true,
    },
    {
      id: 21,
      name: "Cidre Artisanal",
      price: 5.0,
      description: "Cidre brut de Normandie 25cl",
      image: "https://images.unsplash.com/photo-1558642891-54be180ea339",
      allergenes: ["Sulfites"],
      vegetarien: true,
    },
  ],
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("entrees");
  const [searchTerm, setSearchTerm] = useState("");
  const { addItem } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [filters, setFilters] = useState({
    vegetarien: false,
    sansGluten: false,
    sansLactose: false,
  });

  // Animation au chargement initial
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const scaleUp = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, duration: 0.5 },
    },
  };

  const handleAddToCart = (item) => {
    addItem({ ...item, quantity: 1 });

    // Animation feedback pour l'ajout au panier
    const element = document.getElementById(`add-btn-${item.id}`);
    if (element) {
      element.classList.add("animate-pulse", "bg-green-600");
      setTimeout(() => {
        element.classList.remove("animate-pulse", "bg-green-600");
      }, 700);
    }
  };

  const openItemDetails = (item) => {
    setSelectedItem(item);
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  const filteredItems = MENU_ITEMS[activeCategory].filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVegetarien = !filters.vegetarien || item.vegetarien;
    const matchesSansGluten =
      !filters.sansGluten || !item.allergenes.includes("Gluten");
    const matchesSansLactose =
      !filters.sansLactose || !item.allergenes.includes("Lactose");

    return (
      matchesSearch &&
      matchesVegetarien &&
      matchesSansGluten &&
      matchesSansLactose
    );
  });

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      {/* Hero section pour le menu */}
      <section className="relative h-[40vh] min-h-[300px] bg-amber-900">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
            alt="Menu background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 to-amber-900/60"></div>

        <div className="relative h-full flex flex-col justify-center items-center container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.span
              className="text-amber-200 font-medium uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Restaurant Le Bistrot
            </motion.span>
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mt-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Notre Menu
            </motion.h1>
            <motion.p
              className="text-lg text-amber-100 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Découvrez notre sélection de plats traditionnels français,
              préparés avec des ingrédients frais et locaux
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8">
        {/* Barre de recherche et filtres - Flottante */}
        <motion.div
          className="bg-white rounded-xl shadow-xl p-6 -mt-12 mb-12 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Rechercher un plat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 text-amber-800 hover:text-amber-600 font-medium transition-colors"
            >
              <span>Filtres et préférences</span>
              <ChevronDownIcon
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Panneau de filtres */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.vegetarien}
                      onChange={(e) =>
                        setFilters({ ...filters, vegetarien: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 group-hover:text-amber-800 transition-colors">
                        Végétarien
                      </span>
                      {filters.vegetarien && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center"
                        >
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Actif
                        </motion.span>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.sansGluten}
                      onChange={(e) =>
                        setFilters({ ...filters, sansGluten: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 group-hover:text-amber-800 transition-colors">
                        Sans Gluten
                      </span>
                      {filters.sansGluten && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center"
                        >
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Actif
                        </motion.span>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.sansLactose}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sansLactose: e.target.checked,
                        })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 group-hover:text-amber-800 transition-colors">
                        Sans Lactose
                      </span>
                      {filters.sansLactose && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center"
                        >
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Actif
                        </motion.span>
                      )}
                    </div>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Catégories */}
        <motion.div
          className="flex overflow-x-auto no-scrollbar gap-2 mb-10 pb-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {MENU_CATEGORIES.map((category, index) => (
            <motion.button
              key={category.id}
              variants={fadeIn}
              custom={index}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 transform scale-105"
                  : "bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-700 border border-gray-100"
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Liste des plats */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchTerm + Object.values(filters).join("")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={scaleUp}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                  style={{
                    transition: "all 0.3s ease",
                    transformOrigin: "center",
                  }}
                  whileHover={{ y: -8 }}
                >
                  <div
                    className="flex flex-col flex-grow cursor-pointer"
                    onClick={() => openItemDetails(item)}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <div>
                          <h3 className="text-white text-xl font-bold shadow-text">
                            {item.name}
                          </h3>
                          <p className="text-amber-200 shadow-text text-sm">
                            {
                              MENU_CATEGORIES.find(
                                (cat) => cat.id === activeCategory
                              )?.name
                            }
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {item.vegetarien && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center font-medium">
                              <span className="mr-1">🌱</span> Végé
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-amber-800 font-bold px-3 py-1 rounded-full shadow-md">
                        {item.price.toFixed(2)} €
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-gray-600 text-sm flex-grow line-clamp-3">
                        {item.description}
                      </p>

                      {item.allergenes.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Allergènes :
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {item.allergenes.map((allergene) => (
                              <span
                                key={allergene}
                                className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full"
                              >
                                {allergene}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      id={`add-btn-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Ajouter au panier</span>
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="mx-auto w-16 h-16 mb-4 text-amber-300">
                  <svg
                    className="w-full h-full"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Aucun plat trouvé
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Aucun plat ne correspond à votre recherche. Essayez d'autres
                  critères ou réinitialisez les filtres.
                </p>
                {(searchTerm ||
                  filters.vegetarien ||
                  filters.sansGluten ||
                  filters.sansLactose) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({
                        vegetarien: false,
                        sansGluten: false,
                        sansLactose: false,
                      });
                    }}
                    className="mt-4 text-amber-600 hover:text-amber-800 font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal des détails du plat */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeItemDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-80">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                <div className="absolute bottom-5 left-6 right-6">
                  <span className="inline-block bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
                    {selectedItem.price.toFixed(2)} €
                  </span>
                  <h2 className="text-3xl font-bold text-white shadow-text">
                    {selectedItem.name}
                  </h2>
                </div>
                <button
                  onClick={closeItemDetails}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors text-gray-600 hover:text-gray-800"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-lg mb-6">
                  {selectedItem.description}
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                        selectedItem.vegetarien
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {selectedItem.vegetarien ? (
                        <>
                          <span>🌱</span>
                          <span>Plat Végétarien</span>
                        </>
                      ) : (
                        <>
                          <span>🍖</span>
                          <span>Plat Non-Végétarien</span>
                        </>
                      )}
                    </span>
                  </div>

                  {selectedItem.allergenes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Allergènes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.allergenes.map((allergene) => (
                          <span
                            key={allergene}
                            className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            <span className="mr-1">⚠️</span> {allergene}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedItem);
                        closeItemDetails();
                      }}
                      className="w-full mt-2 bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Ajouter au panier</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
