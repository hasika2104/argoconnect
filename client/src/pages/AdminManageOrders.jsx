import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShoppingBag, CheckCircle } from 'lucide-react';

const AdminManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error('[AdminManageOrders] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-green-600" /> Platform Transaction Orders
      </h1>

      {loading ? (
        <div className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Buyer</th>
                  <th className="p-4">Farmer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-900">#{o._id}</td>
                    <td className="p-4 text-gray-800">{o.buyerId?.name || 'Buyer'}</td>
                    <td className="p-4 text-gray-800">{o.sellerId?.name || 'Farmer'}</td>
                    <td className="p-4 font-extrabold text-green-700">₹{o.totalAmount}</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageOrders;
