import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, Upload, Leaf, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
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

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    description: '',
    price: '',
    unit: 'kg',
    quantity: '100',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    state: user?.location?.state || 'Andhra Pradesh',
    district: user?.location?.district || 'Guntur',
    city: user?.location?.city || 'Tenali',
    organicCertified: true
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        unit: formData.unit,
        quantity: Number(formData.quantity),
        images: [formData.imageUrl],
        location: {
          state: formData.state,
          district: formData.district,
          city: formData.city
        },
        organicCertified: formData.organicCertified
      };

      const res = await api.post('/products', payload);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/seller/manage-products'), 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-green-600" /> List New Agricultural Produce
          </h1>
          <p className="text-xs text-gray-500 mt-1">Publish fresh crops directly to nearby buyers on Argoconnect.</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-4 rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Listing published successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Fresh Organic Tomatoes (తాజా టమాటాలు)"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="35"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="kg">kg</option>
                <option value="ton">ton</option>
                <option value="bunch">bunch</option>
                <option value="liter">liter</option>
                <option value="bag">bag</option>
                <option value="box">box</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="100"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Produce Description</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe harvest quality, organic methods, or delivery timing..."
              className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL / Photo Link</label>
            <input
              type="text"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Organic Checkbox */}
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formData.organicCertified}
              onChange={(e) => setFormData({ ...formData, organicCertified: e.target.checked })}
              className="w-4 h-4 text-green-600 rounded"
            />
            <Leaf className="w-4 h-4 text-emerald-600" /> Organic & Chemical-Free Certified Produce
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {loading ? 'Publishing Produce Listing...' : 'Publish Listing to Marketplace'}
          </button>
        </form>
      </div>

    </div>
  );
};

export default AddProduct;
