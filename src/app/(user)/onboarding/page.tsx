import { OnboardingHub } from '@/components/onboarding/OnboardingHub';
import { PreRegOnboardingHub } from '@/components/preRegestration/PreRegOnboardingHub';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { PreRegistrationProvider } from '@/contexts/PreRegOnboardingContext';
import React from 'react';

export const metadata = {
  title: 'BrentLens — Secure Account Setup Pipeline',
  description: 'Enterprise workflow deployment orchestration portal configuration system.',
};

export default function OnboardingCompletePage() {
  const isPreOnboarding = true;
  return isPreOnboarding ? (
    <PreRegistrationProvider>
      <PreRegOnboardingHub />
    </PreRegistrationProvider>
  ) : (
    <OnboardingProvider>
      <OnboardingHub />
    </OnboardingProvider>
  );
}