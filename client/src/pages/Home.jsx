import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { LocationContext } from '../context/LocationContext';
import api from '../services/api';
import {
  ShoppingBag,
  TrendingUp,
  MapPin,
  Bot,
  Truck,
  ShieldCheck,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Vegetables', icon: '🥦', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80' },
  { name: 'Fruits', icon: '🍎', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Grains', icon: '🌾', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pulses', icon: '🫘', image: 'https://images.unsplash.com/photo-1515543904379-3d757abe9962?auto=format&fit=crop&w=400&q=80' },
  { name: 'Spices', icon: '🌶️', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Organic Products', icon: '🌱', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80' }
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedLocation } = useContext(LocationContext);

  useEffect(() => {
    fetchHomeProducts();
  }, [selectedLocation]);

  const fetchHomeProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      if (res.data.success) {
        setFeaturedProducts(res.data.products.slice(0, 4));
      }

      // Fetch nearby products with lat & lng parameters
      const nearbyRes = await api.get(`/products?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}&sort=nearest`);
      if (nearbyRes.data.success) {
        setNearbyProducts(nearbyRes.data.products.slice(0, 4));
      }
    } catch (err) {
      console.error('[Home] Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-green-800 to-slate-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-md border border-emerald-500/30 text-emerald-200 text-xs font-semibold px-4 py-1.5 rounded-full shadow-inner">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Direct Cloud Farmer Marketplace • Andhra Pradesh & Telangana</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              From Farmers <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
                To Your Table
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 font-light max-w-xl mx-auto lg:mx-0">
              Argoconnect empowers local farmers by eliminating middleman fees, while giving consumers fresh organic produce harvested straight from local fields.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-950/40 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> Shop Fresh Produce
              </Link>
              <Link
                to="/register?role=seller"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-2xl border border-white/20 transition flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Sell Your Crops
              </Link>
            </div>

            {/* Quick stats counter */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-emerald-700/50">
              <div>
                <p className="text-2xl font-extrabold text-white">100%</p>
                <p className="text-xs text-emerald-200">Direct Farmer Pay</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">5,000+</p>
                <p className="text-xs text-emerald-200">Active Buyers</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">Telugu AI</p>
                <p className="text-xs text-emerald-200">Smart Crop Care</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                alt="Farmer displaying fresh produce"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Ramu Farmer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-600"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">రాము రైతు (Ramu Organic Farm)</h4>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-green-600" /> Tenali, Guntur • Verified Farmer
                    </p>
                  </div>
                </div>
                <span className="text-xs font-extrabold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Fresh Today
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Explore Categories</h2>
            <p className="text-xs sm:text-sm text-gray-500">Discover fresh produce sorted by category</p>
          </div>
          <Link to="/marketplace" className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              to={`/marketplace?category=${cat.name}`}
              className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-gray-100 relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <span className="absolute bottom-2 right-2 text-xl drop-shadow">{cat.icon}</span>
              </div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-green-700 transition">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Featured Produce</h2>
            <p className="text-xs sm:text-sm text-gray-500">Hand-picked fresh harvests available right now</p>
          </div>
          <Link to="/marketplace" className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
            Explore All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-gray-100 rounded-3xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Products Near You (Location Aware) */}
      <section className="bg-green-50/60 py-12 border-y border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-green-800 text-xs font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-green-600" /> Near {selectedLocation.city || selectedLocation.district}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Locally Harvested Produce</h2>
            </div>
            <Link to="/marketplace?sort=nearest" className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
              Nearest Radius <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How Argoconnect Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">How Argoconnect Works</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Connecting local agriculture seamlessly in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-extrabold text-xl mx-auto">
              1
            </div>
            <h3 className="font-bold text-base text-gray-900">Farmers List Fresh Harvest</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Farmers create profiles, set competitive fair prices, upload crop images, and broadcast location data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 font-extrabold text-xl mx-auto">
              2
            </div>
            <h3 className="font-bold text-base text-gray-900">Buyers Discover Nearby Products</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Consumers select their district/location to discover nearby organic produce with distance distance badges.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-extrabold text-xl mx-auto">
              3
            </div>
            <h3 className="font-bold text-base text-gray-900">Direct Delivery & Fair Payouts</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Orders are dispatched directly, ensuring 100% money goes to the farmer while buyers get ultra-fresh produce.
            </p>
          </div>
        </div>
      </section>

      {/* AI Assistant Teaser Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-200">
              <Bot className="w-4 h-4 text-emerald-300" /> Powered by Gemini AI
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Meet Your Telugu AI Agriculture Assistant (ఆర్గో ఏఐ)
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Get immediate answers in Telugu & English regarding crop diseases, organic fertilizers, soil health, crop care tips, and market pricing guidance.
            </p>
            <div className="pt-2">
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-6 py-3 rounded-2xl font-bold text-xs shadow-lg transition"
              >
                <Bot className="w-4 h-4 text-emerald-600" /> Start Telugu Chat Assistant
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-xs space-y-3">
            <div className="flex items-center gap-2 text-yellow-300 font-bold">
              <Sparkles className="w-4 h-4" /> Sample Query
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <p className="font-semibold text-white font-telugu">"టమాటా పంటకు ఏ ఎరువు మంచిది?"</p>
            </div>
            <div className="bg-white p-3 rounded-xl text-gray-800 space-y-1">
              <p className="text-[10px] font-bold text-emerald-700 uppercase">ArgoAI Response</p>
              <p className="text-[11px] leading-snug">
                పశువుల ఎరువు, వర్మీకంపోస్ట్ వాడటం వలన మట్టి సారవంతం అవుతుంది...
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
