import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Statistics() {
  const [timeRange, setTimeRange] = useState('week');

  const salesData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Ventes (€)',
        data: [1200, 1900, 1500, 1800, 2200, 2800, 2500],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const ordersData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Commandes',
        data: [25, 32, 28, 35, 42, 48, 45],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Statistiques</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      <div className="grid gap-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Ventes totales</h3>
            <p className="text-3xl font-bold text-blue-600">13 900 €</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Commandes</h3>
            <p className="text-3xl font-bold text-green-600">255</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Clients</h3>
            <p className="text-3xl font-bold text-purple-600">180</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Panier moyen</h3>
            <p className="text-3xl font-bold text-orange-600">54.50 €</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ventes</h3>
            <Bar data={salesData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Commandes</h3>
            <Bar data={ordersData} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plats les plus populaires</h3>
        <div className="space-y-4">
          {[
            { name: 'Pizza Margherita', orders: 45, revenue: 675 },
            { name: 'Burger Gourmet', orders: 38, revenue: 646 },
            { name: 'Salade César', orders: 32, revenue: 416 },
          ].map((item) => (
            <div key={item.name} className="flex justify-between items-center">
              <span className="text-gray-900">{item.name}</span>
              <div className="text-right">
                <span className="text-sm text-gray-500">{item.orders} commandes</span>
                <span className="ml-4 text-sm text-gray-900">{item.revenue} €</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistics;