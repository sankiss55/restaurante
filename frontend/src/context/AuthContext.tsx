import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import Cookies from 'js-cookie';

interface JWTPayload {
  sub: number;
  correo: string;
  nombreCompleto: string;
  tipoUsuario?: string;
  rol?: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: JWTPayload | null;
  rol: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para normalizar roles (mapea diferentes formatos a valores estándar)
const normalizarRol = (tipoUsuario?: string | number): string | null => {
  if (!tipoUsuario && tipoUsuario !== 0) return null;
  
  // Convertir a string si es número
  const rolString = String(tipoUsuario).toLowerCase().trim();
  
  // Mapeo de diferentes nombres/números a valores estándar
  const rolMap: Record<string, string> = {
    // Admin
    '1': 'admin',
    'admin': 'admin',
    'administrador': 'admin',
    
    // Mesero
    '3': 'mesero',
    'mesero': 'mesero',
    'camarero': 'mesero',
    
    // Cocinero
    '2': 'cocinero',
    'cocinero': 'cocinero',
    'chef': 'cocinero',
    'cocina': 'cocinero',
  };
  
  return rolMap[rolString] || rolString;
};

// Función para decodificar JWT
const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    console.log('JWT Decoded:', decoded);
    return decoded;
  } catch (err) {
    console.error('Error decodificando JWT:', err);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [rol, setRol] = useState<string | null>(null);

  // Verificar si hay token en cookies al montar
  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setIsAuthenticated(true);
        setUser(decoded);
        const rolNormalizado = normalizarRol(decoded.rol ?? decoded.tipoUsuario);
        console.log('Rol normalizado:', rolNormalizado);
        setRol(rolNormalizado);
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/usuarios/login', {
        correo: email,
        password,
      });

      const { data, status } = response.data;

      if (status === 'success' && data?.CodeJWT) {
        const token = data.CodeJWT;
        const decoded = decodeJWT(token);

        Cookies.set('auth_token', token, {
          httpOnly: false,
          secure: import.meta.env.MODE === 'production',
          sameSite: 'Strict',
          expires: 1,
        });

        setIsAuthenticated(true);
        setUser(decoded);
        const rolNormalizado = normalizarRol(decoded?.rol ?? decoded?.tipoUsuario);
        console.log('Rol normalizado después de login:', rolNormalizado);
        setRol(rolNormalizado);
        setError(null);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      setRol(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('auth_token');
    setIsAuthenticated(false);
    setUser(null);
    setRol(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, error, user, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
