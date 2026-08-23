export interface AuthData {
  method: 'google' | 'email' | null;
  user_name?: string;
  email?: string;
  password?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface OnboardingStore {
  step: number;
  auth: AuthData;
  theme: 'light' | 'dark';
  
  // Step 2
  industry: string;
  industryLabel: string;
  
  // Step 3
  country: string;
  countryLabel: string;
  
  // Step 4: Scale Metrics
  scale: string;
  scaleLabel: string;
  scaleCalcValue?: number;      // e.g., 5, 25, 100, 350
  scaleMultiplier?: number;     // e.g., 0.70, 1.00
  scaleMonthlyLitres?: number;  // e.g., 8000, 35000
  
  // Step 5: Expenditure Matrix 
  fuelSpend: string;
  spendLabel: string;
  spendCalcValueUsd?: number;   // e.g., 30000, 125000, 500000
  
  // Step 6: Volatility Exposure Multiplier
  fuelExposure: string;
  exposureLabel: string;
  exposureMultiplier?: number;  // e.g., 0.08, 0.15, 0.27, 0.40
  
  // Step 7: Planning Window Thresholds
  horizon: string;
  horizonLabel: string;
  horizonThresholdDays?: number; // e.g., 5, 20, 40, 60
  
  // Step 8 & 9
  strategy: string;
  strategyLabel: string;
  primaryGoal: string;
  goalLabel: string;
  // Step 10
  preferredPlan: string;
  planLabel: string;
  planAmount?: number; // e.g., 5, 20, 40, 60
}

export interface CountryItem {
  code: string;
  name: string;
}

export type StepProps = {
  onValidStateChange: (isValid: boolean) => void;
};

export interface IUserSetting{
  country: string,
  passThroughRate: number,
  sector: string,
  sensitivity: number,
  spendBucket: number,
  brent30Days: number
}