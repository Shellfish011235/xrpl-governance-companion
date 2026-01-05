import { UserPreferences, CompletionRecord } from '../types';

const STORAGE_KEY = 'xrpl-governance-companion';

const defaultPreferences: UserPreferences = {
  validatorContext: {
    publicKey: undefined,
    showStatus: false
  },
  notifications: {
    inAppTicker: true,
    inAppHighlights: true,
    osTierAWaiting: false,
    osNearThreshold: false,
    osWeeklyDigest: false,
    osIncompleteItems: false,
    frequency: 'daily',
    quietHoursStart: undefined,
    quietHoursEnd: undefined,
    enabled: true
  },
  completedAmendments: [],
  dismissedTickerMessages: []
};

export const loadPreferences = (): UserPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultPreferences, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load preferences from localStorage:', e);
  }
  return defaultPreferences;
};

export const savePreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (e) {
    console.warn('Failed to save preferences to localStorage:', e);
  }
};

export const markAmendmentCompleted = (
  preferences: UserPreferences,
  amendmentId: string,
  note?: string
): UserPreferences => {
  const existing = preferences.completedAmendments.find(c => c.amendmentId === amendmentId);
  if (existing) {
    return preferences;
  }
  
  const record: CompletionRecord = {
    amendmentId,
    completedAt: new Date().toISOString(),
    note
  };
  
  return {
    ...preferences,
    completedAmendments: [...preferences.completedAmendments, record]
  };
};

export const unmarkAmendmentCompleted = (
  preferences: UserPreferences,
  amendmentId: string
): UserPreferences => {
  return {
    ...preferences,
    completedAmendments: preferences.completedAmendments.filter(
      c => c.amendmentId !== amendmentId
    )
  };
};

export const isAmendmentCompleted = (
  preferences: UserPreferences,
  amendmentId: string
): boolean => {
  return preferences.completedAmendments.some(c => c.amendmentId === amendmentId);
};

export const getCompletionRecord = (
  preferences: UserPreferences,
  amendmentId: string
): CompletionRecord | undefined => {
  return preferences.completedAmendments.find(c => c.amendmentId === amendmentId);
};

export const dismissTickerMessage = (
  preferences: UserPreferences,
  messageId: string
): UserPreferences => {
  if (preferences.dismissedTickerMessages.includes(messageId)) {
    return preferences;
  }
  return {
    ...preferences,
    dismissedTickerMessages: [...preferences.dismissedTickerMessages, messageId]
  };
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
