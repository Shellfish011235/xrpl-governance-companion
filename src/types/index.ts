// XRPL Governance Companion - Type Definitions

export type Tier = 'A' | 'B' | 'C';
export type PerformanceImpact = 'Low' | 'Medium' | 'High' | 'Unknown';
export type ClarityLevel = 'High' | 'Medium' | 'Low';
export type Confidence = 'High' | 'Medium' | 'Low';
export type ReviewStatus = 'not_started' | 'completed';

export type BeneficiaryCategory = 
  | 'Public Infrastructure'
  | 'Builders'
  | 'Enterprise'
  | 'Exchanges/Liquidity'
  | 'Security/Stability'
  | 'Operators';

export type AffectedArea = 
  | 'CPU'
  | 'Memory'
  | 'Disk IO'
  | 'Network'
  | 'Fee pressure';

export type AmendmentTag = 'new' | 'updated' | 'no_change' | 'safe_to_ignore';

export interface WhoThisHelps {
  categories: BeneficiaryCategory[];
  explanation: string;
  examples?: string[];
}

export interface LedgerImpact {
  estimatedImpact: PerformanceImpact;
  confidence: Confidence;
  affectedAreas: AffectedArea[];
  rationale: string;
  evidenceLinks?: {
    label: string;
    url: string;
  }[];
}

export interface Reference {
  label: string;
  url: string;
  type: 'github' | 'documentation' | 'discussion' | 'analysis';
}

export interface Amendment {
  id: string;
  name: string;
  summary: string;
  tier: Tier;
  performanceImpact: PerformanceImpact;
  clarity: ClarityLevel;
  waitingDays: number;
  plainEnglishExplanation: string;
  whoThisHelps: WhoThisHelps;
  ledgerImpact: LedgerImpact;
  whatChanged?: string;
  estimatedReviewMinutes: number;
  references: Reference[];
  tag: AmendmentTag;
  validatorSupport: {
    current: number;
    required: number;
  };
  // Live XRPL data
  enabled?: boolean;
  supported?: boolean;
  vetoed?: boolean;
  hash?: string;
}

export interface CompletionRecord {
  amendmentId: string;
  completedAt: string;
  note?: string;
}

export interface ValidatorContext {
  publicKey?: string;
  showStatus: boolean;
}

export interface ValidatorStatus {
  unlPresence: boolean;
  recentlyValidating: boolean;
  lastObservedValidation?: string;
  observedParticipation?: 'High' | 'Medium' | 'Low';
  governanceSignaling?: {
    current: number;
    total: number;
  };
}

export interface NotificationSettings {
  inAppTicker: boolean;
  inAppHighlights: boolean;
  osTierAWaiting: boolean;
  osNearThreshold: boolean;
  osWeeklyDigest: boolean;
  osIncompleteItems: boolean;
  frequency: 'realtime' | 'hourly' | 'daily';
  quietHoursStart?: string;
  quietHoursEnd?: string;
  enabled: boolean;
}

export interface UserPreferences {
  validatorContext: ValidatorContext;
  notifications: NotificationSettings;
  completedAmendments: CompletionRecord[];
  dismissedTickerMessages: string[];
}

export interface AppState {
  amendments: Amendment[];
  preferences: UserPreferences;
  activeView: 'home' | 'amendment' | 'settings' | 'references' | 'notifications' | 'guide' | 'digest' | 'validator';
  selectedAmendmentId?: string;
  settingsTab: 'validator' | 'notifications';
}
