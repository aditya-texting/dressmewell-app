
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  name: string;
  email: string;
  bodyShape?: string;
  stylePreferences?: {
    favoriteColors: string[];
    preferredStyles: string[];
    avoidTypes: string[];
  };
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<User>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication - would connect to Firebase or other auth service
  useEffect(() => {
    const storedUser = localStorage.getItem("dressmewell_user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Mock login - in real app would call Firebase or other auth service
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is mock data - in a real app we'd validate with backend
      const mockUsers = JSON.parse(localStorage.getItem("dressmewell_users") || "[]");
      const user = mockUsers.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      if (user.password !== password) { // In real app, would use proper password comparison
        throw new Error("Invalid password");
      }
      
      const authUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        bodyShape: user.bodyShape,
        stylePreferences: user.stylePreferences || {
          favoriteColors: [],
          preferredStyles: [],
          avoidTypes: []
        }
      };
      
      setCurrentUser(authUser);
      localStorage.setItem("dressmewell_user", JSON.stringify(authUser));
      toast.success("Logged in successfully");
      return authUser;
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is mock data - in a real app we'd store in backend
      const mockUsers = JSON.parse(localStorage.getItem("dressmewell_users") || "[]");
      
      if (mockUsers.some((u: any) => u.email === email)) {
        throw new Error("Email already in use");
      }
      
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // In a real app, would hash this password
        bodyShape: undefined,
        stylePreferences: {
          favoriteColors: [],
          preferredStyles: [],
          avoidTypes: []
        }
      };
      
      mockUsers.push(newUser);
      localStorage.setItem("dressmewell_users", JSON.stringify(mockUsers));
      
      const authUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        bodyShape: newUser.bodyShape,
        stylePreferences: newUser.stylePreferences
      };
      
      setCurrentUser(authUser);
      localStorage.setItem("dressmewell_user", JSON.stringify(authUser));
      toast.success("Account created successfully");
      return authUser;
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("dressmewell_user");
    toast.success("Logged out successfully");
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!currentUser) throw new Error("No user logged in");
      
      // Update local user data
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem("dressmewell_user", JSON.stringify(updatedUser));
      
      // Update in mock users array
      const mockUsers = JSON.parse(localStorage.getItem("dressmewell_users") || "[]");
      const userIndex = mockUsers.findIndex((u: any) => u.id === currentUser.id);
      
      if (userIndex >= 0) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
        localStorage.setItem("dressmewell_users", JSON.stringify(mockUsers));
      }
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
