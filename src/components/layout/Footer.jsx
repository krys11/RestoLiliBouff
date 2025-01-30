function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p>123 Rue du Restaurant</p>
            <p>75000 Paris</p>
            <p>Tél: 01 23 45 67 89</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires</h3>
            <p>Lundi - Vendredi: 11h - 23h</p>
            <p>Samedi - Dimanche: 11h - 00h</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">Facebook</a>
              <a href="#" className="hover:text-gray-300">Instagram</a>
              <a href="#" className="hover:text-gray-300">Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          <p>© 2024 Restaurant Name. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;