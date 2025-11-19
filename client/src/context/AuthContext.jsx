import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { setAuthToken, loadToken } from '../services/auth';
import socket from '../services/socket';

// context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // user object or null
  const [loading, setLoading] = useState(true); // true while checking token

  // try load token from localStorage into axios and fetch profile
  useEffect(() => {
    const token = loadToken(); // sets axios header if token present
    if (!token) {
      setLoading(false);
      return;
    }

    // verify token by calling /api/users/me
    (async () => {
      try {
        const res = await api.get('/api/users/me');
        setUser(res.data.user);

        // Connect socket and emit online
        console.log('🔌 Connecting socket for user:', res.data.user._id);
        socket.connect();
        socket.emit('user_online', res.data.user._id);
        console.log('✅ Announced user online:', res.data.user._id);
      } catch (err) {
        // invalid token — remove it
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // login helper: sets token + fetches profile
  const loginWithToken = async (token) => {
    setAuthToken(token);
    try {
      const res = await api.get('/api/users/me');
      setUser(res.data.user);

      // Connect socket
      socket.connect();
      socket.emit('user_online', res.data.user._id);

      return true;
    } catch (err) {
      setAuthToken(null);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    if (user) {
      socket.emit('user_offline', user._id);
      socket.disconnect();
    }
    setAuthToken(null);
    setUser(null);
  };

  const value = { user, setUser, loading, loginWithToken, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
