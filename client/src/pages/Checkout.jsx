import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { ShieldCheck, Truck, CheckCircle2, CreditCard } from 'lucide-react';

const Checkout = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: user?.location?.address || 'Main Road, Door No 4-12',
    city: user?.location?.city || 'Tenali',
    district: user?.location?.district || 'Guntur',
    state: user?.location?.state || 'Andhra Pradesh',
    pincode: '522201'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/orders', {
        deliveryAddress: address,
        paymentMethod
      });

      if (res.data.success) {
        setOrderSuccess(res.data.order);
        await fetchCart();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-green-200 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Order Placed Successfully!</h2>
          <p className="text-xs text-gray-500">
            Order ID: <span className="font-bold text-gray-800">#{orderSuccess._id}</span>
          </p>
          <div className="bg-green-50 p-4 rounded-2xl text-left text-xs space-y-1">
            <p className="font-bold text-green-900">Delivery Address:</p>
            <p className="text-gray-700">{orderSuccess.deliveryAddress.fullName}, {orderSuccess.deliveryAddress.addressLine}</p>
            <p className="text-gray-700">{orderSuccess.deliveryAddress.city}, {orderSuccess.deliveryAddress.state} - {orderSuccess.deliveryAddress.pincode}</p>
          </div>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => navigate('/my-orders')}
              className="flex-1 py-3 bg-green-600 text-white text-xs font-bold rounded-xl"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="flex-1 py-3 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl font-extrabold text-gray-900">Checkout Produce Order</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Delivery Details */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-600" /> Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={address.fullName}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line</label>
            <input
              type="text"
              required
              value={address.addressLine}
              onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">City/Village</label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">District</label>
              <input
                type="text"
                required
                value={address.district}
                onChange={(e) => setAddress({ ...address, district: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                required
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 outline-none"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-green-600" /> Payment Method
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <label className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                paymentMethod === 'COD' ? 'border-green-600 bg-green-50 text-green-900' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                Cash on Delivery (COD)
              </label>

              <label className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                paymentMethod === 'UPI' ? 'border-green-600 bg-green-50 text-green-900' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                />
                UPI / Direct QR Pay
              </label>
            </div>
          </div>
        </div>

        {/* Total Summary Box */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Pay Amount</h3>
          <div className="text-xs space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Total Produce Price</span>
              <span>₹{cart.totalAmount}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-gray-900 border-t border-gray-100 pt-2">
              <span>Grand Total</span>
              <span className="text-green-700 text-lg">₹{cart.totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {loading ? 'Processing Order...' : 'Confirm & Place Order'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
