import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ color: '#2D6BE4', fontSize: '16px' }}>Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
