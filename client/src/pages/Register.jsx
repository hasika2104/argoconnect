import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, UserPlus, AlertCircle, MapPin } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: initialRole,
    state: 'Andhra Pradesh',
    district: 'Guntur',
    city: 'Tenali',
    farmName: '',
    farmingType: 'Organic',
    farmSizeAcres: '2'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        location: {
          state: formData.state,
          district: formData.district,
          city: formData.city
        },
        farmName: formData.farmName,
        farmingType: formData.farmingType,
        farmSizeAcres: Number(formData.farmSizeAcres)
      };

      const res = await register(payload);
      if (res && res.user) {
        if (res.user.role === 'seller') navigate('/seller/dashboard');
        else navigate('/buyer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center mx-auto shadow-md">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Create Argoconnect Account</h2>
          <p className="text-xs text-gray-500">Join as a Buyer or Seller / Farmer</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'buyer' })}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              formData.role === 'buyer'
                ? 'bg-white text-green-800 shadow-md'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            🛒 Consumer / Buyer
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'seller' })}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${
              formData.role === 'seller'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            🌾 Farmer / Seller
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Reddy"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 chars"
                className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Karnataka">Karnataka</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">District</label>
              <input
                type="text"
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
                placeholder="Guntur"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">City / Village</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Tenali"
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Extra Fields if Seller */}
          {formData.role === 'seller' && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                🌾 Farmer Profile Info
              </h4>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="e.g. Sri Lakshmi Organic Farm"
                  className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Farming Type</label>
                  <select
                    name="farmingType"
                    value={formData.farmingType}
                    onChange={handleChange}
                    className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="Organic">Organic</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Hydroponic">Hydroponic</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Farm Size (Acres)</label>
                  <input
                    type="number"
                    name="farmSizeAcres"
                    value={formData.farmSizeAcres}
                    onChange={handleChange}
                    placeholder="2.5"
                    className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-green-700 hover:underline">
            Login Here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
