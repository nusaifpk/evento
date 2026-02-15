// User management utilities for anonymous users

export interface UserPreferences {
  id: string;
  interests: string[];
  hasCompletedOnboarding: boolean;
  createdAt: string;
}

const USER_PREFERENCES_KEY = 'evento_user_preferences';
const ANONYMOUS_USER_ID_KEY = 'evento_anonymous_user_id';

/**
 * Generate a unique anonymous user ID
 */
export const generateAnonymousUserId = (): string => {
  // Check if user ID already exists
  const existingId = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
  if (existingId) {
    return existingId;
  }

  // Generate new ID using timestamp and random string
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 15);
  const userId = `anon_${timestamp}_${randomString}`;

  // Store in localStorage
  localStorage.setItem(ANONYMOUS_USER_ID_KEY, userId);

  return userId;
};

/**
 * Get the current user's anonymous ID
 */
export const getUserId = (): string => {
  const storedId = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
  if (storedId) {
    return storedId;
  }

  // Generate new ID if none exists
  return generateAnonymousUserId();
};

/**
 * Save user preferences to localStorage
 */
export const saveUserPreferences = (interests: string[]): UserPreferences => {
  const userId = getUserId();
  const preferences: UserPreferences = {
    id: userId,
    interests,
    hasCompletedOnboarding: true,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  return preferences;
};

/**
 * Get user preferences from localStorage
 */
export const getUserPreferences = (): UserPreferences | null => {
  const stored = localStorage.getItem(USER_PREFERENCES_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing user preferences:', error);
    return null;
  }
};

/**
 * Check if user has completed onboarding
 */
export const hasCompletedOnboarding = (): boolean => {
  const preferences = getUserPreferences();
  return preferences?.hasCompletedOnboarding ?? false;
};

/**
 * Update user interests
 */
export const updateUserInterests = (interests: string[]): UserPreferences => {
  const currentPreferences = getUserPreferences();
  const userId = getUserId();

  const updatedPreferences: UserPreferences = {
    id: userId,
    interests,
    hasCompletedOnboarding: true,
    createdAt: currentPreferences?.createdAt || new Date().toISOString(),
  };

  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updatedPreferences));
  return updatedPreferences;
};

/**
 * Clear all user data (for testing/debugging)
 */
export const clearUserData = (): void => {
  localStorage.removeItem(USER_PREFERENCES_KEY);
  localStorage.removeItem(ANONYMOUS_USER_ID_KEY);
};
