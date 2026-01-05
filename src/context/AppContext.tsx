import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState, useCallback } from 'react';
import { AppState, UserPreferences, Amendment } from '../types';
import { amendments as staticAmendments } from '../data/amendments';
import { loadPreferences, savePreferences } from '../utils/storage';
import { xrplService, AmendmentInfo } from '../services/xrplService';

type AppAction =
  | { type: 'SET_VIEW'; view: AppState['activeView'] }
  | { type: 'SELECT_AMENDMENT'; id: string | undefined }
  | { type: 'SET_SETTINGS_TAB'; tab: 'validator' | 'notifications' }
  | { type: 'UPDATE_PREFERENCES'; preferences: Partial<UserPreferences> }
  | { type: 'MARK_COMPLETED'; amendmentId: string; note?: string }
  | { type: 'UNDO_COMPLETED'; amendmentId: string }
  | { type: 'DISMISS_TICKER'; messageId: string }
  | { type: 'SET_VALIDATOR_KEY'; publicKey: string | undefined }
  | { type: 'TOGGLE_VALIDATOR_STATUS'; show: boolean }
  | { type: 'SET_LIVE_AMENDMENTS'; amendments: AmendmentInfo[] }
  | { type: 'SET_VALIDATOR_VOTES'; votes: string[] }
  | { type: 'SET_NETWORK_STATS'; stats: { validatorCount: number; quorum: number } }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null };

interface ExtendedAppState extends AppState {
  liveAmendments: AmendmentInfo[];
  validatorVotes: string[];
  networkStats: { validatorCount: number; quorum: number };
  isLoading: boolean;
  error: string | null;
}

const initialState: ExtendedAppState = {
  amendments: staticAmendments,
  preferences: loadPreferences(),
  activeView: 'home',
  selectedAmendmentId: undefined,
  settingsTab: 'validator',
  liveAmendments: [],
  validatorVotes: [],
  networkStats: { validatorCount: 35, quorum: 28 },
  isLoading: false,
  error: null,
};

function appReducer(state: ExtendedAppState, action: AppAction): ExtendedAppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, activeView: action.view };
    
    case 'SELECT_AMENDMENT':
      return {
        ...state,
        selectedAmendmentId: action.id,
        activeView: action.id ? 'amendment' : 'home'
      };
    
    case 'SET_SETTINGS_TAB':
      return { ...state, settingsTab: action.tab };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.preferences }
      };
    
    case 'MARK_COMPLETED': {
      const existing = state.preferences.completedAmendments.find(
        c => c.amendmentId === action.amendmentId
      );
      if (existing) return state;
      
      return {
        ...state,
        preferences: {
          ...state.preferences,
          completedAmendments: [
            ...state.preferences.completedAmendments,
            {
              amendmentId: action.amendmentId,
              completedAt: new Date().toISOString(),
              note: action.note
            }
          ]
        }
      };
    }
    
    case 'UNDO_COMPLETED':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          completedAmendments: state.preferences.completedAmendments.filter(
            c => c.amendmentId !== action.amendmentId
          )
        }
      };
    
    case 'DISMISS_TICKER': {
      if (state.preferences.dismissedTickerMessages.includes(action.messageId)) {
        return state;
      }
      return {
        ...state,
        preferences: {
          ...state.preferences,
          dismissedTickerMessages: [
            ...state.preferences.dismissedTickerMessages,
            action.messageId
          ]
        }
      };
    }
    
    case 'SET_VALIDATOR_KEY':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          validatorContext: {
            ...state.preferences.validatorContext,
            publicKey: action.publicKey
          }
        }
      };
    
    case 'TOGGLE_VALIDATOR_STATUS':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          validatorContext: {
            ...state.preferences.validatorContext,
            showStatus: action.show
          }
        }
      };
    
    case 'SET_LIVE_AMENDMENTS':
      return { ...state, liveAmendments: action.amendments };
    
    case 'SET_VALIDATOR_VOTES':
      return { ...state, validatorVotes: action.votes };
    
    case 'SET_NETWORK_STATS':
      return { ...state, networkStats: action.stats };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    
    case 'SET_ERROR':
      return { ...state, error: action.error };
    
    default:
      return state;
  }
}

interface AppContextValue {
  state: ExtendedAppState;
  dispatch: React.Dispatch<AppAction>;
  getAmendment: (id: string) => Amendment | undefined;
  isCompleted: (amendmentId: string) => boolean;
  hasVoted: (amendmentId: string) => boolean;
  completedCount: number;
  fixOnlyCount: number;
  nearThresholdCount: number;
  refreshLiveData: () => Promise<void>;
  lookupValidator: (publicKey: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Persist preferences to localStorage
  useEffect(() => {
    savePreferences(state.preferences);
  }, [state.preferences]);
  
  // Fetch live XRPL data on mount
  useEffect(() => {
    refreshLiveData();
    
    // Refresh every 5 minutes
    const interval = setInterval(refreshLiveData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  const refreshLiveData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', loading: true });
    dispatch({ type: 'SET_ERROR', error: null });
    
    try {
      // Fetch amendments from XRPL
      const liveAmendments = await xrplService.getAmendments();
      dispatch({ type: 'SET_LIVE_AMENDMENTS', amendments: liveAmendments });
      
      // Fetch network stats
      const progress = await xrplService.getAmendmentProgress();
      dispatch({ 
        type: 'SET_NETWORK_STATS', 
        stats: { 
          validatorCount: progress.required, 
          quorum: Math.ceil(progress.required * 0.8) 
        } 
      });
      
      console.log('XRPL data refreshed:', {
        amendments: liveAmendments.length,
        pending: liveAmendments.filter(a => a.supported && !a.enabled).length,
      });
    } catch (error) {
      console.error('Failed to fetch XRPL data:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to connect to XRPL network' });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, []);
  
  const lookupValidator = useCallback(async (publicKey: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    
    try {
      const validatorInfo = await xrplService.getValidatorInfo(publicKey);
      
      if (validatorInfo) {
        // Get amendments this validator has voted for
        const votes = await xrplService.getValidatorVotes(publicKey);
        dispatch({ type: 'SET_VALIDATOR_VOTES', votes });
        dispatch({ type: 'SET_VALIDATOR_KEY', publicKey });
        dispatch({ type: 'TOGGLE_VALIDATOR_STATUS', show: true });
      }
    } catch (error) {
      console.error('Failed to lookup validator:', error);
      dispatch({ type: 'SET_ERROR', error: 'Failed to lookup validator' });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, []);
  
  const getAmendment = (id: string) => state.amendments.find(a => a.id === id || a.name === id);
  
  const isCompleted = (amendmentId: string) =>
    state.preferences.completedAmendments.some(c => c.amendmentId === amendmentId);
  
  const hasVoted = (amendmentId: string) => {
    // Check if this amendment is in the validator's votes
    // Match by ID or name since XRPL uses hashes but we display names
    const amendment = state.amendments.find(a => a.id === amendmentId);
    if (!amendment) return false;
    
    return state.validatorVotes.some(vote => 
      vote === amendmentId || 
      vote === amendment.name ||
      vote === amendment.hash
    );
  };
  
  const completedCount = state.preferences.completedAmendments.length;
  
  const fixOnlyCount = state.amendments.filter(
    a => a.tier === 'A' && a.performanceImpact === 'Low'
  ).length;
  
  const nearThresholdCount = state.amendments.filter(
    a => a.validatorSupport.required - a.validatorSupport.current <= 3
  ).length;
  
  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        getAmendment,
        isCompleted,
        hasVoted,
        completedCount,
        fixOnlyCount,
        nearThresholdCount,
        refreshLiveData,
        lookupValidator,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
