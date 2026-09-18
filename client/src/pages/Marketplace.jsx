import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { LocationContext } from '../context/LocationContext';
import api from '../services/api';
import { Search, Filter, MapPin, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Spices',
  'Organic Products',
  'Dairy Products',
  'Seeds',
  'Other Agricultural Products'
];

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedLocation } = useContext(LocationContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    fetchMarketplaceProducts();
  }, [selectedCategory, sortBy, selectedLocation, maxDistance]);

  const fetchMarketplaceProducts = async () => {
    try {
      setLoading(true);
      let queryUrl = `/products?sort=${sortBy}&lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`;

      if (selectedCategory && selectedCategory !== 'All') {
        queryUrl += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (searchQuery.trim()) {
        queryUrl += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (minPrice) queryUrl += `&minPrice=${minPrice}`;
      if (maxPrice) queryUrl += `&maxPrice=${maxPrice}`;
      if (maxDistance) queryUrl += `&maxDistance=${maxDistance}`;

      const res = await api.get(queryUrl);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('[Marketplace] Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMarketplaceProducts();
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMaxDistance('');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-800 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
            Direct Farmer Marketplace
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold">Discover Fresh Produce</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Harvested daily across Andhra Pradesh & Telangana. Filter by distance to buy from your nearest local farmers.
          </p>
        </div>

        {/* Location Badge Indicator */}
        <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-300 shrink-0" />
          <div>
            <p className="font-semibold text-white">Your Location</p>
            <p className="text-[11px] text-emerald-200">{selectedLocation.city}, {selectedLocation.district}</p>
          </div>
        </div>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tomatoes, chili, organic rice..."
              className="w-full text-xs pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition"
          >
            Search
          </button>
        </form>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="flex md:hidden items-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="newest">Newest Harvests</option>
              <option value="nearest">Nearest Location</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

      </div>

      {/* Category Pills Horizontal Scroll */}
      <div className="overflow-x-auto whitespace-nowrap pb-2 flex gap-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-green-700 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid & Filters Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-green-600" /> Filter Produce
            </h3>
            <button onClick={clearFilters} className="text-[11px] font-semibold text-red-600 hover:underline">
              Reset All
            </button>
          </div>

          {/* Distance Radius Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">Distance Radius</label>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
            >
              <option value="">Any distance</option>
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
            </select>
          </div>

          {/* Price Range Inputs */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">Price Range (₹)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <button
            onClick={fetchMarketplaceProducts}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition"
          >
            Apply Filters
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-gray-100 rounded-3xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Produce Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No active agricultural products match your current filters or selected location radius.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Marketplace;
