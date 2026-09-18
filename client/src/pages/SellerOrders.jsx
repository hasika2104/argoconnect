import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const SellerOrders = () => {
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
      console.error('[SellerOrders] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
        <Package className="w-6 h-6 text-green-600" /> Received Customer Orders
      </h1>

      {loading ? (
        <div className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500">No orders received for your farm produce yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                <div>
                  <span className="font-bold text-xs text-gray-900">Order #{order._id}</span>
                  <p className="text-[11px] text-gray-500">Buyer: {order.buyerId?.name || 'Customer'} ({order.buyerId?.phone})</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-xs font-bold p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl">
                    <span className="font-semibold text-gray-800">{item.name} ({item.quantity} {item.unit})</span>
                    <span className="font-extrabold text-green-700">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs border-t border-gray-100 pt-3">
                <span className="text-gray-500">Delivery City: {order.deliveryAddress?.city}</span>
                <span className="text-sm font-extrabold text-green-700">Order Total: ₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SellerOrders;
