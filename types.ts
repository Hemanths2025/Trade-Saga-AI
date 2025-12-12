export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface TradeScenario {
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  direction: 'long' | 'short';
  notes: string;
}

export interface BacktestResult {
  date: string;
  value: number;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  content: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface StockRecommendation {
  symbol: string;
  name: string;
  reason: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  BACKTESTER = 'BACKTESTER',
  COURSE = 'COURSE',
  TRADE_COACH = 'TRADE_COACH',
  COMPANY_INTEL = 'COMPANY_INTEL',
  COMMUNITY = 'COMMUNITY'
}