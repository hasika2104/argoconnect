import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { LocationContext } from '../context/LocationContext';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  MapPin,
  Bot,
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  Package,
  ShieldAlert
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isBuyer, isSeller, isAdmin } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const { selectedLocation, updateLocation, detectCurrentLocation, geoLocating } = useContext(LocationContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-700 to-emerald-500 flex items-center justify-center text-white shadow-md transform group-hover:scale-105 transition">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl font-extrabold bg-gradient-to-r from-green-800 to-emerald-600 bg-clip-text text-transparent">
                    Argoconnect
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider font-semibold text-green-700">
                    Smart Farmer Marketplace
                  </span>
                </div>
              </Link>

              {/* Location Badge Selector */}
              <button
                onClick={() => setLocationModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 ml-6 px-3 py-1.5 rounded-full bg-green-50 text-green-800 hover:bg-green-100 border border-green-200 text-xs font-medium transition"
              >
                <MapPin className="w-3.5 h-3.5 text-green-600" />
                <span>{selectedLocation.city || selectedLocation.district}, {selectedLocation.state}</span>
                <ChevronDown className="w-3 h-3 text-green-600" />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/marketplace" className="text-gray-700 hover:text-green-700 text-sm font-medium transition">
                Marketplace
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-green-700 text-sm font-medium transition">
                About Us
              </Link>

              {/* AI Assistant Link */}
              <Link to="/ai-assistant" className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium border border-emerald-200 transition">
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>ఆర్గో ఏఐ (AI Assistant)</span>
              </Link>

              {/* Buyer Cart Icon */}
              {(!user || isBuyer) && (
                <Link to="/cart" className="relative p-2 text-gray-700 hover:text-green-700 transition">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-left"
                  >
                    <img
                      src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-green-500"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-gray-800 leading-tight">{user.name}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>

                      {isBuyer && (
                        <>
                          <Link to="/buyer/dashboard" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                            <LayoutDashboard className="w-4 h-4" /> Buyer Dashboard
                          </Link>
                          <Link to="/my-orders" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                            <Package className="w-4 h-4" /> My Orders
                          </Link>
                        </>
                      )}

                      {isSeller && (
                        <>
                          <Link to="/seller/dashboard" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                            <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
                          </Link>
                          <Link to="/seller/add-product" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                            <PlusCircle className="w-4 h-4" /> Add Product
                          </Link>
                          <Link to="/seller/manage-products" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                            <Package className="w-4 h-4" /> Manage Products
                          </Link>
                          <Link to="/seller/farmer-profile" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                            <User className="w-4 h-4" /> Farmer Profile
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <Link to="/admin/dashboard" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                            <ShieldAlert className="w-4 h-4 text-purple-600" /> Admin Dashboard
                          </Link>
                          <Link to="/admin/manage-users" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                            Manage Users
                          </Link>
                          <Link to="/admin/manage-products" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                            Manage Products
                          </Link>
                        </>
                      )}

                      <Link to="/profile" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700">
                        <User className="w-4 h-4" /> Account Settings
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-xs font-semibold text-gray-700 hover:text-green-700 transition px-3 py-2">
                    Login
                  </Link>
                  <Link to="/register" className="text-xs font-semibold bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 shadow-sm transition">
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <div className="flex items-center md:hidden gap-2">
              <Link to="/cart" className="relative p-2 text-gray-700">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2">
            <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-800 text-sm font-medium">
              Marketplace
            </Link>
            <Link to="/ai-assistant" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-emerald-700 font-semibold text-sm">
              ఆర్గో ఏఐ (AI Assistant)
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-800 text-sm font-medium">
              About Us
            </Link>
            <button
              onClick={() => { setLocationModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 text-xs font-medium text-green-700 flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" /> Location: {selectedLocation.city}, {selectedLocation.state}
            </button>

            {user ? (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">Logged in as: {user.name} ({user.role})</p>
                {isBuyer && <Link to="/buyer/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-gray-700">Buyer Dashboard</Link>}
                {isSeller && <Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-gray-700">Seller Dashboard</Link>}
                {isAdmin && <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-xs text-gray-700">Admin Dashboard</Link>}
                <button onClick={handleLogout} className="block py-2 text-xs font-semibold text-red-600">Logout</button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100 flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center py-2 text-xs font-semibold bg-gray-100 rounded-lg">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-1/2 text-center py-2 text-xs font-semibold bg-green-600 text-white rounded-lg">Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Location Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Select Your Location</h3>
              </div>
              <button onClick={() => setLocationModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Argoconnect filters fresh crops and farm products based on your nearest district & radius.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                <select
                  value={selectedLocation.state}
                  onChange={(e) => updateLocation({ state: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  value={selectedLocation.district}
                  onChange={(e) => updateLocation({ district: e.target.value })}
                  placeholder="e.g. Guntur, Krishna, Visakhapatnam"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City / Village</label>
                <input
                  type="text"
                  value={selectedLocation.city}
                  onChange={(e) => updateLocation({ city: e.target.value })}
                  placeholder="e.g. Tenali, Vijayawada"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={detectCurrentLocation}
                  disabled={geoLocating}
                  className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-800 font-medium text-xs rounded-xl flex items-center justify-center gap-2 border border-green-200 transition"
                >
                  <MapPin className="w-4 h-4 text-green-600" />
                  {geoLocating ? 'Detecting GPS Coordinates...' : 'Use Current GPS Geolocation'}
                </button>
              </div>

              <button
                onClick={() => setLocationModalOpen(false)}
                className="w-full mt-2 py-3 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 shadow-md transition"
              >
                Apply Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
