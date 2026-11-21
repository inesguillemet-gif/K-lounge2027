import { SkinProfileKey } from '../data/kloungeData';

export interface ClaimedPrize {
  prizeId: string;
  title: string;
  tier: 'Gift' | 'Access' | 'Treat';
  detail: string;
  storeNote: string;
  code: string;
  claimedAt: string;
}

export interface QuizSubmission {
  profileKey: SkinProfileKey;
  hairNeed: 'repair' | 'light';
  answers: Record<string, string>;
  completedAt: string;
}

export type SiteTab =
  | 'popup'
  | 'products'
  | 'passport'
  | 'quiz'
  | 'app'
  | 'games'
  | 'visit'
  | 'faq'
  | 'agent';

export type AppPreviewTab = 'avatar' | 'daily' | 'cycle' | 'nft';

export type AgentActionType =
  | 'NONE'
  | 'NAVIGATE_TAB'
  | 'OPEN_CYCLE_TRACKER'
  | 'START_QUIZ'
  | 'OPEN_BOOKING'
  | 'OPEN_APP_PASS'
  | 'OPEN_BAG'
  | 'ADD_PRODUCT'
  | 'OPEN_PRODUCT';

export interface AgentActionPayload {
  reply: string;
  action: AgentActionType;
  tabId?: SiteTab;
  productId?: string;
  actionSummary?: string;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  via?: 'voice' | 'text';
  actionSummary?: string;
  isError?: boolean;
  timestamp: string;
}

export interface PassportProgress {
  mission1Done: boolean;
  mission2Done: boolean;
  mission3Done: boolean;
  socialHandle: string;
  tombolaTicket: string | null;
  tombolaPrize: string | null;
}

export type CycleSymptom =
  | 'breakouts'
  | 'dryness'
  | 'redness'
  | 'oiliness'
  | 'cramps'
  | 'fatigue';

export interface CycleTrackingState {
  lastPeriodStart: string; // YYYY-MM-DD
  cycleLength: number; // e.g., 21 - 35
  periodLength: number; // e.g., 3 - 7
  loggedDays: string[]; // logged YYYY-MM-DD period dates
  symptomsToday: CycleSymptom[];
}
