import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Package, Edit, Trash2, PlusCircle, CheckCircle, Eye } from 'lucide-react';

const ManageProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmerProducts();
  }, [user]);

  const fetchFarmerProducts = async () => {
    try {
      setLoading(true);
      if (user?._id) {
        const res = await api.get(`/products?sellerId=${user._id}`);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      }
    } catch (err) {
      console.error('[ManageProducts] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this crop listing?')) {
      try {
        const res = await api.delete(`/products/${id}`);
        if (res.data.success) {
          setProducts(products.filter(p => p._id !== id));
        }
      } catch (err) {
        alert('Failed to delete listing.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-green-600" /> Manage My Crop Listings
          </h1>
          <p className="text-xs text-gray-500">View, edit, or remove your listed farm produce.</p>
        </div>
        <Link to="/seller/add-product" className="px-4 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5">
          <PlusCircle className="w-4 h-4" /> Add Produce
        </Link>
      </div>

      {loading ? (
        <div className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <p className="text-xs text-gray-500">You haven't listed any crops yet.</p>
          <Link to="/seller/add-product" className="inline-block px-5 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl">
            List First Produce
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <img src={p.images?.[0]} alt={p.name} className="w-16 h-16 rounded-2xl object-cover bg-gray-100" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-green-700 font-extrabold">₹{p.price} / {p.unit}</p>
                  <p className="text-[11px] text-gray-500">Stock: {p.quantity} {p.unit}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  p.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {p.approvalStatus}
                </span>

                <div className="flex items-center gap-2">
                  <Link to={`/seller/edit-product/${p._id}`} className="p-2 text-gray-600 hover:text-green-700">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManageProducts;
