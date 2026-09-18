import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Package, MapPin, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error('[OrderDetails] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading order details...</div>;
  if (!order) return <div className="p-8 text-center text-xs text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/my-orders" className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-green-700">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Order Details #{order._id}</h1>
            <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase">
            {order.status}
          </span>
        </div>

        {/* Delivery Address */}
        <div className="bg-gray-50 p-4 rounded-2xl text-xs space-y-1">
          <p className="font-bold text-gray-900">Shipping & Delivery Address:</p>
          <p className="text-gray-700">{order.deliveryAddress?.fullName} ({order.deliveryAddress?.phone})</p>
          <p className="text-gray-600">{order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}, {order.deliveryAddress?.district}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider">Purchased Produce Items</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">{item.name}</p>
                <p className="text-[11px] text-gray-500">{item.quantity} {item.unit} @ ₹{item.price}/{item.unit}</p>
              </div>
              <span className="font-extrabold text-green-700">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm font-black">
          <span>Total Paid</span>
          <span className="text-xl text-green-700">₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
