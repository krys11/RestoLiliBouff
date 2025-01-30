import { useState } from 'react';

const MOCK_RESERVATIONS = [
  {
    id: 1,
    name: 'Marie Martin',
    date: '2024-03-15',
    time: '19:30',
    guests: 4,
    status: 'confirmed',
    phone: '0123456789',
    email: 'marie@example.com'
  },
  // Add more mock reservations as needed
];

function ReservationsPanel() {
  const [reservations] = useState(MOCK_RESERVATIONS);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleStatusChange = (reservationId, newStatus) => {
    // Implement status change logic
    console.log(`Reservation ${reservationId} status changed to ${newStatus}`);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Réservations</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personnes
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.guests}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={reservation.status}
                      onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedReservation(reservation)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedReservation && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Détails de la réservation
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p>{selectedReservation.name}</p>
                  <p>{selectedReservation.phone}</p>
                  <p>{selectedReservation.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservationsPanel;