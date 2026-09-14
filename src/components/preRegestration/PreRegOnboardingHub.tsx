/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { saveUserPreOnboarding, createDodoCheckoutSession, verifyDodoTransaction, checkEmailExists } from '@/services/user.service';
import { LeftNavigationPanel } from './LeftNavigationPanel';
import { TopProgressBar } from './TopProgressBar';
import { StepOneAuth } from './StepOneAuth';
import { StepTwoIndustry } from './StepTwoIndustry';
import { StepThreeSubscription } from './StepThreeSubscription';
import { usePreRegistration } from '@/contexts/PreRegOnboardingContext';
import { LoadingOverlay } from './LoadingOverlay';
import { SuccessOverlay } from './SuccessOverlay';
import { PaymentFailureModal } from '../modal/payment/PaymentFailureModal';
import { UserExistsModal } from '../modal/user/UserExistsModal';
import { MdKeyboardArrowLeft } from "react-icons/md";

const ONBOARDING_CACHE_KEY = 'pre_reg_onboarding_state';

export const PreRegOnboardingHub: React.FC = () => {
  const { state, updateState } = usePreRegistration();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showUserExistsModal, setShowUserExistsModal] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const totalSteps = 3;

  const claimed = 12;
  const total = 3500;
  const subtitle = 'Rate locked forever'
  const percentage = Math.min(Math.max((claimed / total) * 100, 0), 100);


  // Handles starting or retrying Dodo Payment checkout
  const initiatePayment = async (dataState: any) => {
    setIsSubmitting(true);
    try {
      localStorage.setItem(ONBOARDING_CACHE_KEY, JSON.stringify(dataState));
      const sessionRes = await createDodoCheckoutSession(dataState);

      if (sessionRes.success && sessionRes.url) {
        window.location.href = sessionRes.url;
      } else {
        setIsSubmitting(false);
        setShowFailureModal(true);
      }
    } catch {
      setIsSubmitting(false);
      setShowFailureModal(true);
    }
  };

// ... inside your component:
const hasExecutedPaymentSync = useRef(false);

useEffect(() => {
  const rawStatus = searchParams.get('status');
  const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');
  const subscriptionId = searchParams.get('subscription_id') || searchParams.get('subscriptionId');

  // 1. Dodo explicit failure or cancel redirect
  if (rawStatus === 'failed' || rawStatus === 'cancelled') {
    setIsSubmitting(false);
    setShowSuccess(false);
    setShowFailureModal(true);
    router.replace(window.location.pathname);
    return;
  }

  // 2. Dodo return with potential success
  if (rawStatus === 'success' || paymentId || subscriptionId) {
    // HARD LOCK: Abort if already started/executed in this mount cycle
    if (hasExecutedPaymentSync.current) {
      return;
    }
    hasExecutedPaymentSync.current = true;

    // Immediately clean the URL query string so subsequent re-renders don't re-read the tokens
    window.history.replaceState({}, '', window.location.pathname);

    const executePostPaymentSync = async () => {
      setIsSubmitting(true);

      if (paymentId || subscriptionId) {
        const verifyRes = await verifyDodoTransaction({
          paymentId: paymentId || undefined,
          subscriptionId: subscriptionId || undefined,
        });

        if (!verifyRes.success) {
          setIsSubmitting(false);
          setShowSuccess(false);
          setShowFailureModal(true);
          return;
        }
      }

      try {
        const cachedData = localStorage.getItem(ONBOARDING_CACHE_KEY);
        const finalState = cachedData ? JSON.parse(cachedData) : state;

        const res = await saveUserPreOnboarding(finalState);
        if (res.success) {
          localStorage.removeItem(ONBOARDING_CACHE_KEY);
          setShowSuccess(true);
        } else {
          setShowFailureModal(true);
        }
      } catch {
        setShowFailureModal(true);
      } finally {
        setIsSubmitting(false);
      }
    };

    executePostPaymentSync();
  }
}, [searchParams]);

  const handleNext = async () => {
    if (!isValid || isCheckingEmail) return;

    // Step 1: Intercept and verify if email exists before moving to Step 2
    if (state.step === 1) {
      const emailToCheck = state.auth?.email;
      if (!emailToCheck) return;

      setIsCheckingEmail(true);
      const exists = await checkEmailExists(emailToCheck);
      setIsCheckingEmail(false);

      if (exists) {
        setShowUserExistsModal(true);
        return; // Halt forward navigation
      }

      updateState({ step: 2 });
      return;
    }

    // Next step navigation
    if (state.step < totalSteps) {
      updateState({ step: state.step + 1 });
    } else {
      await initiatePayment(state);
    }
  };

  const handleRetryPayment = () => {
    const cachedData = localStorage.getItem(ONBOARDING_CACHE_KEY);
    const dataToUse = cachedData ? JSON.parse(cachedData) : state;
    initiatePayment(dataToUse);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg)] text-[var(--ink)]">
      <LeftNavigationPanel />
      <div className="flex-1 flex flex-col min-w-0 relative h-full">

{/* back btn */}
          <button
            type="button"
            onClick={() => state.step > 1 && updateState({ step: state.step - 1 })}
            className={` absolute top-3 block sm:hidden left-0 mx-4 rounded-[var(--r2)] border border-[var(--bd2)] font-semibold text-sm text-[var(--ink2)] hover:bg-[var(--ps)] transition-all ${state.step === 1 ? 'invisible pointer-events-none' : ''
              }`}
          >
            <MdKeyboardArrowLeft size={30} />
          </button>


        <div className="flex justify-center align-center">

          <div className="flex sm:hidden items-center gap-0 mb-[5px] mt-[10px] shrink-0">
            <img
              src="/assets/landingPage/landing_logo.png"
              alt="BrentLens"
              id="nav-logo"
              className="h-[30px] w-auto block"
            />
          </div>


        </div>


        {/* Header */}
        <header
          className="w-full flex items-center justify-between p-[16px_32px] border-b shrink-0 select-none transition-colors duration-300"
          style={{ borderColor: 'var(--bd)', backgroundColor: 'var(--bg)' }}
        >
          <TopProgressBar currentStep={state.step} totalSteps={totalSteps} />
          <div className="hidden sm:flex items-center gap-[8px] dis">
            <span
              className="text-[11px] font-normal"
              style={{
                fontFamily: 'var(--S)',
                color: state.auth?.method === 'google' ? 'var(--green)' : 'var(--ink3)',
              }}
            >
              {state.auth?.method === 'google' ? 'Connected via Google' : 'Not signed in'}
            </span>
          </div>
        </header>


        <div className="w-full sm:hidden border border-[#9ee3d1]/60 bg-[#00a86a1c] px-8 py-4 font-sans text-xs flex items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00a86b] absolute " />
          <p className=" text-[12px] font-normal leading-tight text-[#00a86b] ms-4 ">
            <span className="font-bold ">
              {claimed.toLocaleString()}
            </span>{' '}
            of {total.toLocaleString()} founding seats claimed  · {subtitle}
          </p>
        </div>


        {/* Content */}
        <main className="flex-1 overflow-y-auto sm:p-8 p-4 pb-32 scroll-clean bg-[var(--bg)]">
          <div className="max-w-full mx-auto sm:p-8 relative">
            <div className="text-[13px] text-[#7C3AED] select-none font-bold uppercase mb-4">
              Step {state.step} of {totalSteps}
            </div>

            {state.step === 1 && <StepOneAuth onValidStateChange={setIsValid} />}
            {state.step === 2 && <StepTwoIndustry onValidStateChange={setIsValid} />}
            {state.step === 3 && <StepThreeSubscription onValidStateChange={setIsValid} />}
          </div>
        </main>

        {/* Footer */}
        <footer className="absolute bottom-0 right-0 left-0 bg-[var(--bg)] border-t border-[var(--bd)] p-4 px-8 flex items-center justify-between z-10 transition-colors duration-300">
          <button
            type="button"
            onClick={() => state.step > 1 && updateState({ step: state.step - 1 })}
            className={` hidden sm:block sm:w-auto px-5 py-2.5 rounded-[var(--r2)] border border-[var(--bd2)] font-semibold text-sm text-[var(--ink2)] hover:bg-[var(--ps)] transition-all ${state.step === 1 ? 'invisible pointer-events-none' : ''
              }`}
          >
            &larr; Back
          </button>
          {/* <button
            type="button"
            disabled={!isValid || isSubmitting}
            onClick={handleNext}
            className="px-6 py-2.5 rounded-[var(--r2)] bg-gradient-to-r from-[var(--pur)] via-[var(--blue)] to-[var(--cyan)] text-white font-bold text-sm shadow-md transition-all disabled:opacity-40"
          >
            {state.step === totalSteps ? 'Proceed to Payment' : 'Continue'} &nbsp; &rarr;
          </button> */}
          <button
            type="button"
            disabled={!isValid || isSubmitting || isCheckingEmail}
            onClick={handleNext}
            className="w-full md:w-fit px-6 py-2.5 rounded-[var(--r2)] bg-gradient-to-r from-[var(--pur)] via-[var(--blue)] to-[var(--cyan)] text-white font-bold text-sm shadow-md transition-all disabled:opacity-40"
          >
            {isCheckingEmail ? 'Checking...' : state.step === totalSteps ? 'Proceed to Payment' : 'Continue'} &nbsp; &rarr;
          </button>
        </footer>
      </div>

      {/* Overlays & Modals */}
      {isSubmitting && <LoadingOverlay />}
      {showSuccess && <SuccessOverlay />}
      <PaymentFailureModal
        isOpen={showFailureModal}
        onRetry={handleRetryPayment}
        onClose={() => setShowFailureModal(false)}
        isRetrying={isSubmitting}
      />
      <UserExistsModal
        isOpen={showUserExistsModal}
        email={state.auth?.email || ''}
        onClose={() => setShowUserExistsModal(false)}
      />
    </div>
  );
};