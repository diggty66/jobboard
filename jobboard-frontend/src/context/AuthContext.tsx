import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  email: string;
  role: "seeker" | "employer" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, role: User["role"], token?: string) => void;
  logout: () => void;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
  setToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (email: string, role: User["role"], token?: string) => {
    setUser({ email, role });
    if (token) setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
