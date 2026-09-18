import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Discover fresh farm produce directly from local farmers and add them to your cart.
        </p>
        <Link
          to="/marketplace"
          className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
        <ShoppingBag className="w-7 h-7 text-green-600" /> Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = item.productId || {};
            return (
              <div
                key={item._id}
                className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80'}
                    alt={product.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{product.name || 'Harvest Item'}</h4>
                    <p className="text-xs text-gray-500">₹{item.price} per {product.unit || 'kg'}</p>
                    <p className="text-[11px] text-green-700 font-medium">
                      Farmer: {product.sellerId?.name || 'Local Farmer'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 text-xs font-bold hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-900 bg-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 text-xs font-bold hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-extrabold text-green-700 w-20 text-right">
                    ₹{item.price * item.quantity}
                  </span>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Side Box */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 h-fit">
          <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">
            Order Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cart.items.length} items)</span>
              <span>₹{cart.totalAmount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Farmer Direct Delivery Fee</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-sm text-gray-900">
              <span>Total Amount</span>
              <span className="text-green-700 text-base">₹{cart.totalAmount}</span>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-2xl text-[11px] text-green-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
            <span>100% Direct Payout to Farmers Guaranteed</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
