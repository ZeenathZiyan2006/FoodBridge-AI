const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Helper for making fetch requests with Auth header and error handling
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('foodbridge_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'An error occurred';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  // If 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getMe: () => request('/api/auth/me'),
  getDemoAccounts: () => request('/api/auth/demo-accounts'),
  quickLogin: (role) => request(`/api/auth/quick-login/${role}`, {
    method: 'POST',
  }),

  // Donations
  getDonations: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'All') {
        searchParams.append(key, val);
      }
    });
    const qs = searchParams.toString();
    return request(`/api/donations${qs ? `?${qs}` : ''}`);
  },
  getDonation: (id) => request(`/api/donations/${id}`),
  getMyDonations: () => request('/api/donations/my-donations'),
  createDonation: (data) => request('/api/donations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateDonation: (id, data) => request(`/api/donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteDonation: (id) => request(`/api/donations/${id}`, {
    method: 'DELETE',
  }),

  // Requests & Lifecycle
  createRequest: (data) => request('/api/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getMyRequests: () => request('/api/requests/my-requests'),
  getDonationRequests: (donationId) => request(`/api/requests/donation/${donationId}`),
  updateRequestStatus: (requestId, status, notes = '') => request(`/api/requests/${requestId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes }),
  }),

  // AI Matching
  getDonationRecommendations: (donationId) => request(`/api/matching/recommendations/${donationId}`),
  getReceiverFeed: () => request('/api/matching/receiver-feed'),

  // Analytics & Impact
  getSummary: () => request('/api/analytics/summary'),
  getCharts: () => request('/api/analytics/charts'),
  getHotspots: () => request('/api/analytics/hotspots'),
  getAdminUsers: () => request('/api/analytics/admin/users'),
  toggleUserStatus: (userId) => request(`/api/analytics/admin/users/${userId}/toggle-status`, {
    method: 'PATCH',
  }),

  // Notifications
  getNotifications: () => request('/api/notifications'),
  getUnreadNotificationCount: () => request('/api/notifications/unread-count'),
  markNotificationRead: (id) => request(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  }),
  markAllNotificationsRead: () => request('/api/notifications/read-all', {
    method: 'PATCH',
  }),
};
