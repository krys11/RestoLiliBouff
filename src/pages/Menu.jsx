import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_CATEGORIES = [
  { id: 'entrees', name: 'Entrées', icon: '🥗' },
  { id: 'plats', name: 'Plats Principaux', icon: '🍽️' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'boissons', name: 'Boissons', icon: '🥤' }
];

const MENU_ITEMS = {
  entrees: [
    { 
      id: 1, 
      name: 'Salade César', 
      price: 8.50, 
      description: 'Laitue romaine, croûtons, parmesan, sauce césar maison',
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
      allergenes: ['Gluten', 'Lactose'],
      vegetarien: true
    },
    { 
      id: 2, 
      name: 'Soupe à l\'oignon', 
      price: 7.50, 
      description: 'Soupe traditionnelle française gratinée au fromage',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
      allergenes: ['Lactose'],
      vegetarien: true
    },
    {
      id: 9,
      name: 'Foie Gras Maison',
      price: 16.50,
      description: 'Foie gras de canard mi-cuit, chutney de figues, pain brioché',
      image: 'https://images.unsplash.com/photo-1625944525903-70b4cd82d42c',
      allergenes: ['Gluten'],
      vegetarien: false
    },
    {
      id: 10,
      name: 'Escargots de Bourgogne',
      price: 12.00,
      description: '6 escargots préparés au beurre persillé',
      image: 'https://images.unsplash.com/photo-1596456519192-da98e6f5a9f8',
      allergenes: ['Lactose'],
      vegetarien: false
    },
    {
      id: 11,
      name: 'Tartare de Saumon',
      price: 14.50,
      description: 'Saumon frais coupé au couteau, avocat, citron vert',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      allergenes: ['Poisson'],
      vegetarien: false
    }
  ],
  plats: [
    { 
      id: 3, 
      name: 'Steak Frites', 
      price: 22.00, 
      description: 'Steak de bœuf français, frites maison, sauce au poivre',
      image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e',
      allergenes: [],
      vegetarien: false
    },
    { 
      id: 4, 
      name: 'Saumon Grillé', 
      price: 24.00, 
      description: 'Saumon frais de l\'Atlantique, légumes de saison, sauce citronnée',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
      allergenes: ['Poisson'],
      vegetarien: false
    },
    {
      id: 12,
      name: 'Coq au Vin',
      price: 26.00,
      description: 'Coq mijoté au vin rouge, lardons, champignons, pommes de terre',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
      allergenes: [],
      vegetarien: false
    },
    {
      id: 13,
      name: 'Magret de Canard',
      price: 28.00,
      description: 'Magret de canard rôti, sauce aux fruits rouges, gratin dauphinois',
      image: 'https://images.unsplash.com/photo-1564436872-f6d81182df12',
      allergenes: ['Lactose'],
      vegetarien: false
    },
    {
      id: 14,
      name: 'Bouillabaisse',
      price: 32.00,
      description: 'Soupe de poissons traditionnelle marseillaise, rouille, croûtons',
      image: 'https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b',
      allergenes: ['Gluten', 'Poisson'],
      vegetarien: false
    },
    {
      id: 15,
      name: 'Ratatouille',
      price: 18.00,
      description: 'Légumes provençaux mijotés, riz basmati',
      image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c',
      allergenes: [],
      vegetarien: true
    }
  ],
  desserts: [
    { 
      id: 5, 
      name: 'Crème Brûlée', 
      price: 7.00, 
      description: 'Dessert traditionnel français à la vanille de Madagascar',
      image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc',
      allergenes: ['Lactose', 'Œufs'],
      vegetarien: true
    },
    { 
      id: 6, 
      name: 'Tarte Tatin', 
      price: 8.00, 
      description: 'Tarte aux pommes caramélisées servie avec crème fraîche',
      image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13',
      allergenes: ['Gluten', 'Lactose'],
      vegetarien: true
    },
    {
      id: 16,
      name: 'Profiteroles',
      price: 9.50,
      description: 'Choux à la crème, sauce chocolat chaud, amandes effilées',
      image: 'https://images.unsplash.com/photo-1505976378723-9726b54e9bb9',
      allergenes: ['Gluten', 'Lactose', 'Œufs'],
      vegetarien: true
    },
    {
      id: 17,
      name: 'Millefeuille',
      price: 8.50,
      description: 'Pâte feuilletée, crème pâtissière à la vanille, glaçage royal',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814',
      allergenes: ['Gluten', 'Lactose', 'Œufs'],
      vegetarien: true
    },
    {
      id: 18,
      name: 'Mousse au Chocolat',
      price: 7.50,
      description: 'Mousse légère au chocolat noir 70%, copeaux de chocolat',
      image: 'https://images.unsplash.com/photo-1511715112108-9acc6c3ff61f',
      allergenes: ['Lactose', 'Œufs'],
      vegetarien: true
    }
  ],
  boissons: [
    { 
      id: 7, 
      name: 'Vin Rouge', 
      price: 6.00, 
      description: 'Verre de vin rouge de la maison - Bordeaux AOC',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
      allergenes: ['Sulfites'],
      vegetarien: true
    },
    { 
      id: 8, 
      name: 'Eau Minérale', 
      price: 3.50, 
      description: 'Bouteille d\'eau minérale des Alpes françaises 50cl',
      image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504',
      allergenes: [],
      vegetarien: true
    },
    {
      id: 19,
      name: 'Vin Blanc',
      price: 6.00,
      description: 'Verre de vin blanc - Chablis AOC',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
      allergenes: ['Sulfites'],
      vegetarien: true
    },
    {
      id: 20,
      name: 'Champagne',
      price: 12.00,
      description: 'Coupe de champagne - Brut',
      image: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb',
      allergenes: ['Sulfites'],
      vegetarien: true
    },
    {
      id: 21,
      name: 'Cidre Artisanal',
      price: 5.00,
      description: 'Cidre brut de Normandie 25cl',
      image: 'https://images.unsplash.com/photo-1558642891-54be180ea339',
      allergenes: ['Sulfites'],
      vegetarien: true
    }
  ]
};

function Menu() {
  const [activeCategory, setActiveCategory] = useState('entrees');
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem } = useCart();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    vegetarien: false,
    sansGluten: false,
    sansLactose: false
  });

  const handleAddToCart = (item) => {
    addItem({ ...item, quantity: 1 });
  };

  const openItemDetails = (item) => {
    setSelectedItem(item);
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  const filteredItems = MENU_ITEMS[activeCategory].filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVegetarien = !filters.vegetarien || item.vegetarien;
    const matchesSansGluten = !filters.sansGluten || !item.allergenes.includes('Gluten');
    const matchesSansLactose = !filters.sansLactose || !item.allergenes.includes('Lactose');
    
    return matchesSearch && matchesVegetarien && matchesSansGluten && matchesSansLactose;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Notre Menu</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Découvrez notre sélection de plats traditionnels français, préparés avec des ingrédients frais et locaux
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Rechercher un plat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-2.5">🔍</span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <span>Filtres</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.vegetarien}
                  onChange={(e) => setFilters({ ...filters, vegetarien: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Végétarien</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.sansGluten}
                  onChange={(e) => setFilters({ ...filters, sansGluten: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Sans Gluten</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.sansLactose}
                  onChange={(e) => setFilters({ ...filters, sansLactose: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Sans Lactose</span>
              </label>
            </div>
          </motion.div>
        )}
      </div>

      {/* Catégories */}
      <div className="flex overflow-x-auto gap-4 mb-8 pb-2 scrollbar-hide">
        {MENU_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Liste des plats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-[32rem]"
          >
            <div 
              className="flex flex-col flex-grow cursor-pointer"
              onClick={() => openItemDetails(item)}
            >
              <div className="relative h-48 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {item.vegetarien && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Végé
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                  </div>
                  <span className="text-lg font-bold text-blue-600 flex-shrink-0">{item.price.toFixed(2)} €</span>
                </div>
                
                <div className="flex-grow">
                  {item.allergenes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Allergènes :</p>
                      <div className="flex flex-wrap gap-2">
                        {item.allergenes.map((allergene) => (
                          <span
                            key={allergene}
                            className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full"
                          >
                            {allergene}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 pt-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Ajouter au panier
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal des détails du plat */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeItemDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-72">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={closeItemDetails}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                  <span className="text-2xl font-bold text-blue-600">{selectedItem.price.toFixed(2)} €</span>
                </div>

                <p className="text-gray-600 mb-6">{selectedItem.description}</p>

                <div className="space-y-4">
                  {selectedItem.allergenes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Allergènes</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.allergenes.map((allergene) => (
                          <span
                            key={allergene}
                            className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
                          >
                            {allergene}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Type :</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedItem.vegetarien
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedItem.vegetarien ? 'Végétarien' : 'Non végétarien'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(selectedItem);
                    closeItemDetails();
                  }}
                  className="w-full mt-8 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Ajouter au panier
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message si aucun résultat */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucun plat ne correspond à votre recherche</p>
        </div>
      )}
    </div>
  );
}

export default Menu;