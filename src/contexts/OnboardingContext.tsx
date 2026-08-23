/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OnboardingStore } from '../types/onboarding';

const SESSION_STORAGE_KEY = 'brentlens_onboarding_session_v1';

const defaultState: OnboardingStore = {
  step: 1,
  auth: { 
    method: null, 
    user_name: '', 
    email: '', 
    password: '' 
  },
  theme: 'light',

  // Step 2
  industry: '',
  industryLabel: 'Not set',

  // Step 3
  country: '',
  countryLabel: 'Not set',

  // Step 4
  scale: '',
  scaleLabel: 'Not set',
  scaleCalcValue: undefined,
  scaleMultiplier: undefined,
  scaleMonthlyLitres: undefined,

  // Step 5
  fuelSpend: '',
  spendLabel: 'Not set',
  spendCalcValueUsd: undefined,

  // Step 6
  fuelExposure: '',
  exposureLabel: 'Not set',
  exposureMultiplier: undefined,

  // Step 7
  horizon: '',
  horizonLabel: 'Not set',
  horizonThresholdDays: undefined,

  // Step 8
  strategy: '',
  strategyLabel: 'Not set',

  // Step 9
  primaryGoal: '',
  goalLabel: 'Not set',
  // Step 9
  preferredPlan: '',
  planLabel: 'Not set',
  planAmount: undefined,
};

type OnboardingContextType = {
  state: OnboardingStore;
  updateState: (updater: Partial<OnboardingStore> | ((prev: OnboardingStore) => OnboardingStore)) => void;
  resetContext: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<OnboardingStore>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Read session metrics from sessionStorage safely upon initialization mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setState({ ...defaultState, ...parsed });
        } catch (e) {
          console.error("Context session parsing malfunction occurred.", e);
        }
      }
      setHydrated(true);
    }
  }, []);

  // Write variations cleanly out to sessionStorage loop references 
  useEffect(() => {
    if (hydrated && typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [state, hydrated]);

  const updateState = (updater: Partial<OnboardingStore> | ((prev: OnboardingStore) => OnboardingStore)) => {
    setState((prev) => {
      const partial = typeof updater === 'function' ? updater(prev) : updater;
      return { ...prev, ...partial };
    });
  };

  const resetContext = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setState(defaultState);
  };

  if (!hydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#070C19]">
        <div className="w-12 h-12 border-4 border-t-purple-600 rounded-full animate-spin border-purple-900/30" />
      </div>
    );
  }

  return (
    <OnboardingContext.Provider value={{ state, updateState, resetContext }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be instantiated inside OnboardingProvider.');
  return ctx;
};