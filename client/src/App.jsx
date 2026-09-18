import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistantWidget from './components/AIAssistantWidget';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';

// Buyer Pages
import BuyerDashboard from './pages/BuyerDashboard';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import ProfilePage from './pages/ProfilePage';
import AIAssistantPage from './pages/AIAssistantPage';

// Seller / Farmer Pages
import SellerDashboard from './pages/SellerDashboard';
import AddProduct from './pages/AddProduct';
import ManageProducts from './pages/ManageProducts';
import EditProduct from './pages/EditProduct';
import SellerOrders from './pages/SellerOrders';
import SalesOverview from './pages/SalesOverview';
import FarmerProfilePage from './pages/FarmerProfilePage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import AdminManageProducts from './pages/AdminManageProducts';
import AdminManageOrders from './pages/AdminManageOrders';
import ReportsStatistics from './pages/ReportsStatistics';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
              <Navbar />
              
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />

                  {/* Buyer Routes */}
                  <Route path="/buyer/dashboard" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<ProtectedRoute allowedRoles={['buyer']}><Checkout /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute allowedRoles={['buyer']}><MyOrders /></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                  {/* Seller / Farmer Routes */}
                  <Route path="/seller/dashboard" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>} />
                  <Route path="/seller/add-product" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><AddProduct /></ProtectedRoute>} />
                  <Route path="/seller/manage-products" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><ManageProducts /></ProtectedRoute>} />
                  <Route path="/seller/edit-product/:id" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><EditProduct /></ProtectedRoute>} />
                  <Route path="/seller/orders" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><SellerOrders /></ProtectedRoute>} />
                  <Route path="/seller/sales" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><SalesOverview /></ProtectedRoute>} />
                  <Route path="/seller/farmer-profile" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><FarmerProfilePage /></ProtectedRoute>} />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/manage-users" element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>} />
                  <Route path="/admin/manage-products" element={<ProtectedRoute allowedRoles={['admin']}><AdminManageProducts /></ProtectedRoute>} />
                  <Route path="/admin/manage-orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminManageOrders /></ProtectedRoute>} />
                  <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsStatistics /></ProtectedRoute>} />
                </Routes>
              </main>

              {/* Floating AI Assistant Widget on all pages */}
              <AIAssistantWidget />

              <Footer />
            </div>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
