import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { MapPin, ShoppingCart, Check, Leaf, ShieldCheck } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isBuyer, user } = useContext(AuthContext);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    setAdding(true);
    const result = await addToCart(product._id, 1);
    setAdding(false);

    if (result?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const sellerName = product.sellerId?.name || 'Local Farmer';
  const locationCity = product.location?.city || product.location?.district || 'Andhra Pradesh';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Image & Badges Container */}
      <Link to={`/product/${product._id}`} className="relative block aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Organic Badge */}
        {product.organicCertified && (
          <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Leaf className="w-3 h-3 fill-current" /> Organic
          </span>
        )}

        {/* Distance Badge */}
        {product.distanceKm !== null && product.distanceKm !== undefined && (
          <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3 text-green-400" /> {product.distanceKm} km away
          </span>
        )}
      </Link>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Farmer & Location Info */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <span className="font-semibold text-gray-700 truncate">{sellerName}</span>
            <span>•</span>
            <span className="truncate">{locationCity}</span>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product._id}`} className="block">
            <h3 className="font-bold text-gray-900 text-sm hover:text-green-700 line-clamp-1 transition">
              {product.name}
            </h3>
          </Link>

          {/* Price & Unit */}
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-green-700">₹{product.price}</span>
            <span className="text-xs text-gray-500 font-medium">/ {product.unit}</span>
          </div>
        </div>

        {/* Action Button & Stock */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <span className={`text-[11px] font-semibold ${product.quantity > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {product.quantity > 0 ? `${product.quantity} ${product.unit} available` : 'Out of Stock'}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.quantity <= 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-200 disabled:text-gray-400'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
