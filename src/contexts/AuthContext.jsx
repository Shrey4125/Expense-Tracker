// src/contexts/AuthContext.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { loginUser, logoutUser, registerUser } from '../services/authService';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = (email, password, displayName) =>
    registerUser(email, password, displayName);

  const login = (email, password) => loginUser(email, password);

  const logout = () => logoutUser();

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// `useAuth` is exported from `src/contexts/useAuth.js` to keep this file
// exporting only the provider component for fast-refresh compatibility.
