import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Edit, Save, ArrowLeft } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    description: '',
    price: '',
    unit: 'kg',
    quantity: '',
    images: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        const p = res.data.product;
        setFormData({
          name: p.name,
          category: p.category,
          description: p.description,
          price: p.price,
          unit: p.unit,
          quantity: p.quantity,
          images: p.images
        });
      }
    } catch (err) {
      console.error('[EditProduct] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/products/${id}`, formData);
      if (res.data.success) {
        navigate('/seller/manage-products');
      }
    } catch (err) {
      alert('Failed to update listing.');
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading product...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-green-700">
        <ArrowLeft className="w-4 h-4" /> Cancel
      </button>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Edit className="w-6 h-6 text-green-600" /> Edit Produce Listing
        </h1>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
