import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Package, PlusCircle, TrendingUp, ShoppingBag, MapPin, CheckCircle, ArrowRight, User } from 'lucide-react';

const SellerDashboard = () => {
  const { user, farmerProfile } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, [user]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      if (user?._id) {
        const prodRes = await api.get(`/products?sellerId=${user._id}`);
        if (prodRes.data.success) setProducts(prodRes.data.products);
      }
      const orderRes = await api.get('/orders');
      if (orderRes.data.success) setOrders(orderRes.data.orders);
    } catch (err) {
      console.error('[SellerDashboard] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-800 text-white rounded-3xl p-6 sm:p-8 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Farmer Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{farmerProfile?.farmName || `${user?.name}'s Organic Farm`}</h1>
          <p className="text-xs text-emerald-100 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-green-300" /> {user?.location?.city || 'Tenali'}, {user?.location?.district || 'Guntur'} • Verified Farmer
          </p>
        </div>

        <Link to="/seller/add-product" className="hidden sm:flex items-center gap-2 bg-white text-green-800 px-5 py-2.5 rounded-2xl font-bold text-xs shadow hover:bg-emerald-50 transition">
          <PlusCircle className="w-4 h-4" /> Add New Crop Listing
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Listed Products</p>
          <p className="text-2xl font-extrabold text-gray-900">{products.length}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Orders Received</p>
          <p className="text-2xl font-extrabold text-emerald-600">{orders.length}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Total Sales Revenue</p>
          <p className="text-2xl font-extrabold text-green-700">₹{totalEarnings}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Farming Method</p>
          <p className="text-2xl font-extrabold text-amber-700">{farmerProfile?.farmingType || 'Organic'}</p>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/seller/add-product" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Add Agricultural Listing</h3>
          <p className="text-xs text-gray-500">Upload produce image, set price per kg/ton, and publish online.</p>
        </Link>

        <Link to="/seller/manage-products" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Manage Products & Stock</h3>
          <p className="text-xs text-gray-500">Update stock quantities, edit price, or toggle crop availability.</p>
        </Link>

        <Link to="/seller/orders" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Customer Orders</h3>
          <p className="text-xs text-gray-500">View orders placed by buyers and update delivery dispatch status.</p>
        </Link>
      </div>

    </div>
  );
};

export default SellerDashboard;
