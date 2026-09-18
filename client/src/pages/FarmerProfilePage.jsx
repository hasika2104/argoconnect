import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, Save, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

const FarmerProfilePage = () => {
  const { farmerProfile, user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    farmName: farmerProfile?.farmName || `${user?.name}'s Organic Farm`,
    description: farmerProfile?.description || '',
    farmingType: farmerProfile?.farmingType || 'Organic',
    farmSizeAcres: farmerProfile?.farmSizeAcres || 2,
    experienceYears: farmerProfile?.experienceYears || 5
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/farmer-profile', formData);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert('Failed to update farmer profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <ShieldCheck className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Farmer Business Profile</h1>
            <p className="text-xs text-gray-500">Buyer facing farm identity & agricultural details</p>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" /> Farmer profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Name</label>
            <input
              type="text"
              required
              value={formData.farmName}
              onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Farming Type</label>
              <select
                value={formData.farmingType}
                onChange={(e) => setFormData({ ...formData, farmingType: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
              >
                <option value="Organic">Organic</option>
                <option value="Traditional">Traditional</option>
                <option value="Hydroponic">Hydroponic</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                value={formData.farmSizeAcres}
                onChange={(e) => setFormData({ ...formData, farmSizeAcres: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Story & Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell buyers about your crop techniques, natural fertilizers, and farm legacy..."
              className="w-full text-xs p-3 rounded-xl border border-gray-300 outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Farmer Profile
          </button>
        </form>
      </div>

    </div>
  );
};

export default FarmerProfilePage;
