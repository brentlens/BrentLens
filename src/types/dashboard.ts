export type DashboardTab = 
  | 'dashboard' 
  | 'cost-outlook' 
  | 'scenario-planner' 
  | 'reports' 
  | 'market-signals' 
  | 'impact-history' 
  | 'settings';

export type SystemTier = 'starter' | 'pro' | 'business';




export interface DashboardHomeProps {
  setActiveTab: (tab: any) => void;
  tier: any;
  setTier: (tier: any) => void;
}

export interface RiskLevels {
  shock: number,
  risk: any,
  riskLevel: string
}

export type RiskBand = {
  min: number;
  max: number;
  color_hex: string;
  action: string;
};

export type RiskBandResult = RiskBand & {
    riskLevel: string;
};

export type BrentData = {
    pass_through_rate: number;
    sensitivity_score: number;
    spend_bracket: number;
    brent_30_days_move: number;
    sectorName: string;
    impactLag: number;
    currentPrice: number;
    formattedPrice: string;
    additionalCostToday: number;
    totalCalc: number;
    days_remaining: number;
    latest_shock: RiskBandResult | null;
    last_shock: RiskBandResult | null;
};