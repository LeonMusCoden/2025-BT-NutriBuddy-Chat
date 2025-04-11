import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { nutriBuddyApi, UserInfo } from "@/lib/api";
import { toast } from "sonner";

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserInfo>;
  signup: (data: {
    email: string;
    password: string;
    connectedLoyaltyCard?: 'migros' | 'coop' | 'both' | null;
    migrosEmail?: string;
    migrosPassword?: string;
    coopEmail?: string;
    coopPassword?: string;
    profile_data?: Record<string, any>;
  }) => Promise<UserInfo>;
  updateProfile: (profileData: Record<string, any>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = nutriBuddyApi.loadAuthToken();
      if (token) {
        try {
          // Placeholder until user profile endpoint is done
          setUser({
            email: "user@example.com",
            register_time: Date.now(),
            external_id: "user-id",
            token: token,
          });
        } catch (error) {
          console.error("Token validation error:", error);
          nutriBuddyApi.clearAuthToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await nutriBuddyApi.login({ email, password });
      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: {
    email: string;
    password: string;
    connectedLoyaltyCard?: 'migros' | 'coop' | 'both' | null;
    migrosEmail?: string;
    migrosPassword?: string;
    coopEmail?: string;
    coopPassword?: string;
    profile_data?: Record<string, any>;
  }) => {
    try {
      setIsLoading(true);
      const userData = await nutriBuddyApi.registerUser(data);
      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Record<string, any>) => {
    if (!user) {
      throw new Error("User must be logged in to update profile");
    }

    try {
      await nutriBuddyApi.updateProfileData(profileData);
      // Update the local user state with the new profile data
      setUser(currentUser => {
        if (!currentUser) return null;
        return {
          ...currentUser,
          profile_data: {
            ...currentUser.profile_data,
            ...profileData
          }
        };
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const logout = () => {
    nutriBuddyApi.clearAuthToken();
    setUser(null);
    toast.success("Successfully logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
