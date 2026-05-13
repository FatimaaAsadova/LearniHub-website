import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      try {
        // Səhv: JSON.parse edilmədən birbaşa obyekt kimi istifadə oluna bilməzdi
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Auth parsing error:", error);
        localStorage.removeItem('loggedInUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Obyekti string-ə çevirib yadda saxlayırıq
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
    
    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
    navigate(redirectPath);
    
    localStorage.removeItem('redirectAfterLogin');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('redirectAfterLogin');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);