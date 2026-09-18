import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Package, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const AdminManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '/admin/products';
      if (statusFilter) url += `?approvalStatus=${statusFilter}`;
      const res = await api.get(url);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('[AdminManageProducts] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, approvalStatus) => {
    try {
      const res = await api.put(`/admin/products/${id}/approve`, { approvalStatus });
      if (res.data.success) {
        setProducts(products.map(p => p._id === id ? { ...p, approvalStatus } : p));
      }
    } catch (err) {
      alert('Failed to update product approval.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-green-600" /> Produce Approval Moderation
        </h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs p-2.5 bg-white border border-gray-200 rounded-xl outline-none"
        >
          <option value="">All Approvals</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <img src={p.images?.[0]} alt={p.name} className="w-16 h-16 rounded-2xl object-cover bg-gray-100" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-gray-500">Farmer: {p.sellerId?.name || 'Farmer'}</p>
                  <p className="text-xs font-bold text-green-700">₹{p.price} / {p.unit}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  p.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {p.approvalStatus}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(p._id, 'approved')}
                    className="px-3 py-1 bg-green-600 text-white text-[11px] font-bold rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApprove(p._id, 'rejected')}
                    className="px-3 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg border border-red-200"
                  >
                    Reject
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

export default AdminManageProducts;
