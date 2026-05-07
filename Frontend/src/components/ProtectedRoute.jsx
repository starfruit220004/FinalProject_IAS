import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Still initializing from localStorage — don't redirect yet
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ color: '#2D6BE4', fontSize: '16px' }}>Loading...</div>
      </div>
    );
  }

  // If no user, redirect to login. Replace so the protected URL
  // is not saved in browser history (prevents back-button bypass).
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}