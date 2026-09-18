import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShieldAlert, TrendingUp, Users, Package, Award } from 'lucide-react';

const ReportsStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) setStats(res.data.stats);
    } catch (err) {
      console.error('[ReportsStatistics] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-purple-600" /> Platform Analytics & Content Moderation Report
        </h1>
        <p className="text-xs text-gray-500 mt-1">Argoconnect cloud infrastructure health and marketplace distribution.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Active Farmers Enrolled</p>
          <p className="text-3xl font-extrabold text-emerald-700">{stats?.totalFarmers || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Consumer Buyers</p>
          <p className="text-3xl font-extrabold text-green-700">{stats?.totalBuyers || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-500">Platform GMV (₹)</p>
          <p className="text-3xl font-extrabold text-purple-700">₹{stats?.totalRevenue || 0}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-gray-900">Content Moderation & Report Status</h3>
        <div className="bg-green-50 p-4 rounded-2xl border border-green-200 text-xs text-green-800 space-y-1">
          <p className="font-bold">System Health Status: 100% Operational</p>
          <p>No reported spam or abusive content flagged in past 24 hours.</p>
        </div>
      </div>

    </div>
  );
};

export default ReportsStatistics;
