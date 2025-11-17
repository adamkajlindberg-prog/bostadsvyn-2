import { createContext, type ReactNode, useContext, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface UserPreferences {
  interestedAreas: string[];
  budgetRange: {
    min: number | null;
    max: number | null;
  };
  preferredPropertyTypes: string[];
  investmentGoals: string[];
  notifications: {
    priceAlerts: boolean;
    marketUpdates: boolean;
    newListings: boolean;
  };
  favoriteQuestionCategories: string[];
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  loading: boolean;
}

const defaultPreferences: UserPreferences = {
  interestedAreas: [],
  budgetRange: { min: null, max: null },
  preferredPropertyTypes: [],
  investmentGoals: [],
  notifications: {
    priceAlerts: true,
    marketUpdates: true,
    newListings: false,
  },
  favoriteQuestionCategories: [],
};

const UserPreferencesContext = createContext<
  UserPreferencesContextType | undefined
>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [loading, _setLoading] = useState(false);
  const { user } = useAuth();

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
  };

  const value = {
    preferences,
    updatePreferences,
    loading,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider",
    );
  }
  return context;
}
