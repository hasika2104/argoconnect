import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { TrendingUp, DollarSign, Package, CheckCircle } from 'lucide-react';

const SalesOverview = () => {
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
      console.error('[SalesOverview] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-green-600" /> Farm Sales & Revenue Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Total Revenue</p>
          <p className="text-3xl font-extrabold text-green-700">₹{totalRevenue}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Completed Orders</p>
          <p className="text-3xl font-extrabold text-emerald-600">
            {orders.filter(o => o.status === 'delivered' || o.status === 'pending').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Average Order Value</p>
          <p className="text-3xl font-extrabold text-amber-700">
            ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
