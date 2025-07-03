import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { authService } from "../services/AuthService";

// Define User type
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    confirmPassword: string,
    name: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check session from backend or token
  const checkAuthStatus = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const currentUser = await authService.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const success = await authService.login({ email, password });
    if (success) {
      await checkAuthStatus(); // Refresh session
    } else {
      setUser(null);
      setLoading(false);
    }
    return success;
  };

  const register = async (
    email: string,
    password: string,
    password_confirmation: string,
    name: string
  ): Promise<boolean> => {
    setLoading(true);
    const success = await authService.register({
      name,
      email,
      password,
      password_confirmation,
    });
    if (success) {
      await login(email, password); // auto-login after registration
    } else {
      setLoading(false);
    }
    return success;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setLoading(false);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
