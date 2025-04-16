import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { nutriBuddyApi, UserInfo, UserRegistrationData } from "@/lib/api";
import { toast } from "sonner";

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  getCurrentUser: () => Promise<UserInfo | null>;
  login: (email: string, password: string) => Promise<UserInfo>;
  signup: (data: UserRegistrationData) => Promise<UserInfo>;
  updateProfile: (profileData: Record<string, any>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = async (): Promise<UserInfo | null> => {
    const token = nutriBuddyApi.loadAuthToken();
    if (!token) {
      return null;
    }
    
    try {
      // Get the current user data from the API
      const userData = await nutriBuddyApi.getCurrentUser();
      setUser({
        ...userData,
        token: token,
      });
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      nutriBuddyApi.clearAuthToken();
      return null;
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        await getCurrentUser();
      } catch (error) {
        console.error("Token validation error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Start scrapers for connected loyalty cards
  const startScrapersIfConnected = async (connectedLoyaltyCard: string | null | undefined) => {
    if (!connectedLoyaltyCard) return;
    
    try {
      if (connectedLoyaltyCard === 'Migros' || connectedLoyaltyCard === 'Both') {
        await nutriBuddyApi.startScraper('migros');
        console.log('Started Migros scraper');
      }
      
      if (connectedLoyaltyCard === 'Coop' || connectedLoyaltyCard === 'Both') {
        await nutriBuddyApi.startScraper('coop');
        console.log('Started Coop scraper');
      }
    } catch (error) {
      console.error('Failed to start scrapers:', error);
      // Don't show toast to user as this is a background operation
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await nutriBuddyApi.login({ email, password });
      setUser(userData);
      startScrapersIfConnected(userData.connected_loyalty_card);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: UserRegistrationData) => {
    try {
      setIsLoading(true);
      const userData = await nutriBuddyApi.registerUser(data);
      setUser(userData);
      startScrapersIfConnected(userData.connected_loyalty_card);
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

      // After updating the profile, fetch the latest user data to ensure consistency
      try {
        const userData = await nutriBuddyApi.getCurrentUser();
        setUser(currentUser => {
          if (!currentUser) return null;
          return {
            ...userData,
            token: currentUser.token, // Preserve the token
          };
        });
      } catch (fetchError) {
        console.error("Error fetching updated user data:", fetchError);

        // Fallback: update the local user state with the new profile data
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
      }
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
        getCurrentUser,
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
