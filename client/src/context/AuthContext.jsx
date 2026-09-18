import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('argo_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setFarmerProfile(res.data.farmerProfile);
      }
    } catch (err) {
      console.error('[AuthContext] Session verification failed:', err);
      localStorage.removeItem('argo_token');
      localStorage.removeItem('argo_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('argo_token', res.data.token);
      localStorage.setItem('argo_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      await checkLoggedInUser();
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('argo_token', res.data.token);
      localStorage.setItem('argo_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      await checkLoggedInUser();
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('argo_token');
    localStorage.removeItem('argo_user');
    setUser(null);
    setFarmerProfile(null);
  };

  const updateProfile = async (updatedData) => {
    const res = await api.put('/auth/profile', updatedData);
    if (res.data.success) {
      setUser(res.data.user);
      await checkLoggedInUser();
    }
    return res.data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      farmerProfile,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      isBuyer: user?.role === 'buyer',
      isSeller: user?.role === 'seller',
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};
