import { useState } from 'react';

const MOCK_STATS = {
  dailyRevenue: 1250.80,
  weeklyRevenue: 8750.50,
  monthlyRevenue: 35000.00,
  popularDishes: [
    { name: 'Steak Frites', count: 150 },
    { name: 'Saumon Grillé', count: 120 },
    { name: 'Crème Brûlée', count: 90 }
  ],
  ordersByType: {
    delivery: 45,
    takeaway: 30,
    dineIn: 80
  }
};

function StatsPanel() {
  const [stats] = useState(MOCK_STATS);
  const [timeframe, setTimeframe] = useState('daily');

  const getRevenueByTimeframe = () => {
    switch (timeframe) {
      case 'daily':
        return stats.dailyRevenue;
      case 'weekly':
        return stats.weeklyRevenue;
      case 'monthly':
        return stats.monthlyRevenue;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Statistiques</h2>
          <div className="mt-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm"
            >
              <option value="daily">Aujourd'hui</option>
              <option value="weekly">Cette semaine</option>
              <option value="monthly">Ce mois</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Chiffre d'affaires</h3>
            <p className="text-3xl font-bold text-blue-600">
              {getRevenueByTimeframe().toFixed(2)} €
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Commandes par type</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="font-medium">{stats.ordersByType.delivery}</span>
              </div>
              <div className="flex justify-between">
                <span>À emporter</span>
                <span className="font-medium">{stats.ordersByType.takeaway}</span>
              </div>
              <div className="flex justify-between">
                <span>Sur place</span>
                <span className="font-medium">{stats.ordersByType.dineIn}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Plats les plus populaires</h3>
            <div className="space-y-4">
              {stats.popularDishes.map((dish, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span>{dish.name}</span>
                      <span className="font-medium">{dish.count} commandes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(dish.count / stats.popularDishes[0].count) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;