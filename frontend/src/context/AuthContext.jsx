import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if there's a token and verify it
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  // Standard Login (for the Gateway)
  const login = async (name, password) => {
    const res = await api.post('/auth/login', { name, password });
    localStorage.setItem('token', res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, role: res.data.role });
    return res.data;
  };

  // Logout (Exits to Gateway)
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Switch User (Password modal)
  const switchUser = async (name, password) => {
  const res = await api.post('/auth/login', { name, password });
  localStorage.setItem('token', res.data.token);
  setUser({ _id: res.data._id, name: res.data.name, role: res.data.role });
  return res.data;
};

  return (
    <AuthContext.Provider value={{ user, login, logout, switchUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);