import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Salade César',
      category: 'Entrées',
      price: 12.99,
      description: 'Laitue romaine, croûtons, parmesan, sauce césar',
      image: 'https://example.com/salad.jpg',
    },
    // Ajoutez plus d'éléments ici
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddItem = (newItem) => {
    setMenuItems([...menuItems, { ...newItem, id: Date.now() }]);
    setShowAddModal(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDeleteItem = (itemId) => {
    setMenuItems(menuItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gestion du Menu</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un plat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <span className="text-lg font-bold text-blue-600">{item.price} €</span>
              </div>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEditItem(item)}
                  className="p-2 text-gray-600 hover:text-blue-600"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour ajouter/éditer un plat */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Modifier le plat' : 'Ajouter un nouveau plat'}
            </h3>
            {/* Formulaire d'ajout/modification */}
            <form className="space-y-4">
              {/* Ajoutez les champs du formulaire ici */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuManagement;