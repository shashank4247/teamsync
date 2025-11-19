// client/src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // show nothing or a minimal loader while checking token
    return <div className="min-h-[200px] flex items-center justify-center">Checking authentication...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
