/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PreRegistrationStore {
  step: number;
  auth: {
    method: 'email' | 'google' | 'sso' | null;
    user_name: string;
    email: string;
    password?: string;
  };
  theme: 'light' | 'dark';

  // Step 2
  industry: string;
  industryLabel: string;
  country: string;
  countryLabel: string;
  fuelSpend: string;
  spendLabel: string;
  spendCalcValueUsd?: number;

  // Step 3
  preferredPlan: string;
  planLabel: string;
  planAmount?: number;
}

const SESSION_STORAGE_KEY = 'brentlens_preregistration_session_v1';

const defaultState: PreRegistrationStore = {
  step: 1,
  auth: {
    method: null,
    user_name: '',
    email: '',
    password: '',
  },
  theme: 'light',

  // Step 2
  industry: '',
  industryLabel: 'Not set',
  country: '',
  countryLabel: 'Not set',
  fuelSpend: '',
  spendLabel: 'Not set',
  spendCalcValueUsd: undefined,

  // Step 3
  preferredPlan: '',
  planLabel: 'Not set',
  planAmount: undefined,
};

type PreRegistrationContextType = {
  state: PreRegistrationStore;
  updateState: (
    updater: Partial<PreRegistrationStore> | ((prev: PreRegistrationStore) => PreRegistrationStore)
  ) => void;
  resetContext: () => void;
};

const PreRegistrationContext = createContext<PreRegistrationContextType | undefined>(undefined);

export const PreRegistrationProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<PreRegistrationStore>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Read session metrics from sessionStorage safely upon mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setState({ ...defaultState, ...parsed });
        } catch (e) {
          console.error('Pre-registration session parsing failed:', e);
        }
      }
      setHydrated(true);
    }
  }, []);

  // Sync state changes to sessionStorage and HTML element attribute
  useEffect(() => {
    if (hydrated && typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [state, hydrated]);

  const updateState = (
    updater: Partial<PreRegistrationStore> | ((prev: PreRegistrationStore) => PreRegistrationStore)
  ) => {
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
    <PreRegistrationContext.Provider value={{ state, updateState, resetContext }}>
      {children}
    </PreRegistrationContext.Provider>
  );
};

export const usePreRegistration = () => {
  const ctx = useContext(PreRegistrationContext);
  if (!ctx) {
    throw new Error('usePreRegistration must be used within a PreRegistrationProvider.');
  }
  return ctx;
};