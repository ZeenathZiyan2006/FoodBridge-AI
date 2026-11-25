import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('foodbridge_token'));
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [dashboardPanelOpen, setDashboardPanelOpen] = useState(false);

  const toggleDashboardPanel = useCallback(() => {
    setDashboardPanelOpen((prev) => !prev);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.getUnreadNotificationCount();
      setUnreadCount(data.unread_count || 0);
    } catch {
      // Ignore background notification fetch errors
    }
  }, [token]);

  // Load current user on startup
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
          await fetchUnreadCount();
        } catch {
          // Token invalid or expired
          localStorage.removeItem('foodbridge_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token, fetchUnreadCount]);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    localStorage.setItem('foodbridge_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    showToast(`Welcome back, ${data.user.full_name}!`, 'success');
    return data.user;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('foodbridge_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    showToast(`Account created successfully! Welcome to FoodBridge AI.`, 'success');
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('foodbridge_token');
    setToken(null);
    setUser(null);
    setUnreadCount(0);
    showToast('Logged out successfully', 'info');
  };

  const deleteAccount = async () => {
    try {
      await api.deleteMyAccount();
      localStorage.removeItem('foodbridge_token');
      setToken(null);
      setUser(null);
      setUnreadCount(0);
      showToast('Your account has been permanently deleted.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete account', 'error');
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await api.updateMyProfile(profileData);
      setUser(updatedUser);
      showToast('Profile updated successfully!', 'success');
      return updatedUser;
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        unreadCount,
        toast,
        dashboardPanelOpen,
        setDashboardPanelOpen,
        toggleDashboardPanel,
        login,
        register,
        logout,
        deleteAccount,
        updateProfile,
        showToast,
        fetchUnreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
