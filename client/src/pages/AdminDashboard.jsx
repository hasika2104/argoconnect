import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ShieldAlert, Users, Package, ShoppingBag, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading admin metrics...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-purple-200 uppercase tracking-widest">Platform Administration</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Argoconnect Admin Control Center</h1>
          <p className="text-xs text-purple-100 mt-1">Monitor marketplace health, approve listings, and manage platform users.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Total Users</p>
          <p className="text-3xl font-extrabold text-gray-900">{stats?.totalUsers || 0}</p>
          <p className="text-[11px] text-gray-400">{stats?.totalFarmers} Farmers • {stats?.totalBuyers} Buyers</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Listed Crops</p>
          <p className="text-3xl font-extrabold text-green-700">{stats?.totalProducts || 0}</p>
          <p className="text-[11px] text-amber-600 font-bold">{stats?.pendingProducts || 0} Pending Approvals</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Total Marketplace Orders</p>
          <p className="text-3xl font-extrabold text-emerald-600">{stats?.totalOrders || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Gross Platform GMV</p>
          <p className="text-3xl font-extrabold text-purple-700">₹{stats?.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Link to="/admin/manage-users" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-2">
          <Users className="w-6 h-6 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-sm">Manage Users</h3>
          <p className="text-[11px] text-gray-500">View buyers, farmers, and manage accounts.</p>
        </Link>

        <Link to="/admin/manage-products" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-2">
          <Package className="w-6 h-6 text-green-600" />
          <h3 className="font-bold text-gray-900 text-sm">Manage Products</h3>
          <p className="text-[11px] text-gray-500">Approve or moderate published crop listings.</p>
        </Link>

        <Link to="/admin/manage-orders" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-2">
          <ShoppingBag className="w-6 h-6 text-emerald-600" />
          <h3 className="font-bold text-gray-900 text-sm">Manage Orders</h3>
          <p className="text-[11px] text-gray-500">Audit marketplace transaction records.</p>
        </Link>

        <Link to="/admin/reports" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition space-y-2">
          <ShieldAlert className="w-6 h-6 text-indigo-600" />
          <h3 className="font-bold text-gray-900 text-sm">Reports & Statistics</h3>
          <p className="text-[11px] text-gray-500">Deep platform analytics & moderation.</p>
        </Link>
      </div>

    </div>
  );
};

export default AdminDashboard;
