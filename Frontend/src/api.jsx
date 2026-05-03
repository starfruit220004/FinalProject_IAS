const BASE_URL = 'https://finalproject-ias.onrender.com/api';

const getToken = () => localStorage.getItem('token');

export const api = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  
  let data;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = { message: 'Unexpected server response' };
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      // Auto logout on auth failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
};
