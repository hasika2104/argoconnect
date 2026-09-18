import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Package, MapPin, Eye } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('[MyOrders] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
        <Package className="w-7 h-7 text-green-600" /> My Produce Orders
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => <div key={n} className="bg-gray-100 rounded-3xl h-32 animate-pulse"></div>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <p className="text-xs text-gray-500">You haven't placed any produce orders yet.</p>
          <Link to="/marketplace" className="inline-block px-6 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl">
            Start Shopping Fresh Produce
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-gray-900">Order ID: #{order._id}</span>
                  <p className="text-[11px] text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status}
                  </span>
                  <Link to={`/orders/${order._id}`} className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Details
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">{item.name} ({item.quantity} {item.unit})</span>
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs">
                <span className="text-gray-500">Total Paid (Cash/UPI)</span>
                <span className="text-base font-extrabold text-green-700">₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyOrders;
