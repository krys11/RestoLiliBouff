import { useState } from 'react';

const INITIAL_MENU_ITEMS = {
  entrees: [
    { id: 1, name: 'Salade César', price: 8.50, description: 'Laitue romaine, croûtons, parmesan' },
    { id: 2, name: 'Soupe à l\'oignon', price: 7.50, description: 'Soupe traditionnelle française' }
  ],
  plats: [
    { id: 3, name: 'Steak Frites', price: 22.00, description: 'Steak de bœuf, frites maison' },
    { id: 4, name: 'Saumon Grillé', price: 24.00, description: 'Saumon frais, légumes de saison' }
  ],
  desserts: [
    { id: 5, name: 'Crème Brûlée', price: 7.00, description: 'Dessert traditionnel français' },
    { id: 6, name: 'Tarte Tatin', price: 8.00, description: 'Tarte aux pommes caramélisées' }
  ]
};

function MenuPanel() {
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    category: 'entrees',
    name: '',
    price: '',
    description: ''
  });

  const handleEditItem = (category, item) => {
    setEditingItem({ ...item, category });
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    if (editingItem) {
      setMenuItems(prev => ({
        ...prev,
        [editingItem.category]: prev[editingItem.category].map(item =>
          item.id === editingItem.id ? editingItem : item
        )
      }));
      setEditingItem(null);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const id = Math.max(...Object.values(menuItems).flat().map(item => item.id)) + 1;
    setMenuItems(prev => ({
      ...prev,
      [newItem.category]: [...prev[newItem.category], { ...newItem, id }]
    }));
    setNewItem({
      category: 'entrees',
      name: '',
      price: '',
      description: ''
    });
  };

  const handleDeleteItem = (category, itemId) => {
    setMenuItems(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== itemId)
    }));
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Gestion du Menu</h2>
          <button
            onClick={() => setEditingItem({ category: 'entrees', name: '', price: '', description: '' })}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Ajouter un plat
          </button>
        </div>

        {Object.entries(menuItems).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-sm font-medium">{item.price.toFixed(2)} €</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditItem(category, item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteItem(category, item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {editingItem && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem.id ? 'Modifier le plat' : 'Ajouter un plat'}
              </h3>
              <form onSubmit={handleUpdateItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="entrees">Entrées</option>
                    <option value="plats">Plats</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prix
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuPanel;