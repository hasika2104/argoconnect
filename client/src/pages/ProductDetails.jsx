import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { MapPin, ShoppingCart, Check, ShieldCheck, Leaf, Phone, User, Bot, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.product);
      }
    } catch (err) {
      console.error('[ProductDetails] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const result = await addToCart(product._id, quantity);
    if (result?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-gray-500">Loading harvest product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <Link to="/marketplace" className="text-xs font-bold text-green-700 hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const seller = product.sellerId || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-green-700 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
        
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl bg-gray-100 overflow-hidden border border-gray-100 shadow-inner">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Meta & Purchase Box */}
        <div className="space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.organicCertified && (
                <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 fill-current" /> Organic Certified
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{product.name}</h1>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-green-700">₹{product.price}</span>
              <span className="text-sm font-semibold text-gray-500">per {product.unit}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed border-y border-gray-100 py-4">
            {product.description}
          </p>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700">Quantity ({product.unit}):</span>
              <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-xs font-bold hover:bg-gray-200"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-gray-900 bg-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="px-3 py-1.5 text-xs font-bold hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500">({product.quantity} available)</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
              className={`w-full py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-200'
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              {added ? 'Added to Cart!' : `Add ${quantity} ${product.unit} to Cart`}
            </button>
          </div>

          {/* Farmer / Seller Profile Card */}
          <div className="bg-green-50/70 p-5 rounded-2xl border border-green-200 space-y-3">
            <h4 className="text-xs font-bold text-green-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Farmer Information
            </h4>
            <div className="flex items-center gap-3">
              <img
                src={seller.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt={seller.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-green-600"
              />
              <div>
                <p className="text-xs font-bold text-gray-900">{seller.name || 'Verified Farmer'}</p>
                <p className="text-[11px] text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-green-600" /> {product.location?.city || 'Tenali'}, {product.location?.district || 'Guntur'}
                </p>
              </div>
            </div>
            {seller.phone && (
              <p className="text-xs text-gray-700 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-green-600" /> Direct Contact: {seller.phone}
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;
