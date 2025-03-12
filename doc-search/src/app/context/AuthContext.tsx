"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the current user's information
    const fetchUser = async () => {
      try {
        console.log("Fetching user session...");
        const response = await fetch('/api/auth/session', {credentials: 'include', cache: 'no-store',
          headers:{'Cache-Control': 'no-cache'}
        });
        console.log("Session response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Session data:", data);
          
          if (data.user) {
            setUser(data.user);
            console.log("User set:", data.user);
          } else {
            console.log("No user in session data");
            setUser(null);
          }
        } else {
          console.log("Failed to get session:", response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}