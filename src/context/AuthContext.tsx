import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { apiService } from "../services/api.ts";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("transport_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const auth = await apiService.login({ email, password, role });
      localStorage.setItem("accessToken", auth.accessToken);
      localStorage.setItem("refreshToken", auth.refreshToken);
      const mappedUser: User = {
        id: auth.user.id,
        name: auth.user.username || auth.user.email.split("@")[0],
        email: auth.user.email,
        role: role as User["role"],
      };
      setUser(mappedUser);
      localStorage.setItem("transport_user", JSON.stringify(mappedUser));
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("transport_user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
