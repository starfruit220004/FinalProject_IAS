const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'https://finalproject-ias.onrender.com/api';
  
  // Remove trailing slash
  let url = envUrl.replace(/\/$/, '');
  
  // Ensure it ends with /api if it doesn't already
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  
  return url;
};

const BASE_URL = getBaseUrl();

const getToken = () => localStorage.getItem('token');

export const api = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${BASE_URL}${path}`;

  try {
    const res = await fetch(fullUrl, { ...options, headers });

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = { message: 'Unexpected server response (non-JSON)' };
    }

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${fullUrl}]:`, error.message);
    throw error;
  }
};
