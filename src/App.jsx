import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import OrderType from './pages/OrderType';
import Delivery from './pages/Delivery';
import Reservation from './pages/Reservation';
import TakeAway from './pages/TakeAway';
import TableOrder from './pages/TableOrder';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';
  const showNavbar = !isAdminRoute && !isLoginRoute;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<OrderType />} />
          <Route path="/takeaway" element={<TakeAway />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/table-order" element={<TableOrder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Router>
            <AppContent />
          </Router>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;