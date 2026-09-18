import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { ShoppingBag, Package, MapPin, Bot, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

const BuyerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) {
        setRecentOrders(res.data.orders.slice(0, 3));
      }
    } catch (err) {
      console.error('[BuyerDashboard] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest">Buyer Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-emerald-100 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Location: {user?.location?.city || 'Guntur'}, {user?.location?.state || 'AP'}
          </p>
        </div>

        <Link to="/marketplace" className="hidden sm:flex items-center gap-2 bg-white text-green-800 px-5 py-2.5 rounded-2xl font-bold text-xs shadow hover:bg-emerald-50 transition">
          <ShoppingBag className="w-4 h-4" /> Shop Fresh Crops
        </Link>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/marketplace" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Browse Marketplace</h3>
          <p className="text-xs text-gray-500">Discover fresh vegetables, fruits, and organic rice near you.</p>
        </Link>

        <Link to="/my-orders" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">My Orders</h3>
          <p className="text-xs text-gray-500">Track current produce deliveries and view purchase history.</p>
        </Link>

        <Link to="/ai-assistant" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-3">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Ask Telugu AI Assistant</h3>
          <p className="text-xs text-gray-500">Get crop advice, product guidance, and seasonal produce tips.</p>
        </Link>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Recent Orders</h3>
          <Link to="/my-orders" className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1">
            View All Orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
        ) : recentOrders.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">You haven't placed any produce orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order._id} className="p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 transition">
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-bold text-gray-800">Order #{order._id.slice(-6)}</span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mt-1">
                    {order.items.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                  <span className="text-sm font-extrabold text-green-700">₹{order.totalAmount}</span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default BuyerDashboard;
