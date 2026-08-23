'use client';

import React, { useState } from 'react';
// import { Sun, Moon } from 'lucide-react';
import { saveUserPreOnboarding } from '@/services/user.service';
import { LeftNavigationPanel } from './LeftNavigationPanel';
import { TopProgressBar } from './TopProgressBar';
import { StepOneAuth } from './StepOneAuth';
import { StepTwoIndustry } from './StepTwoIndustry';
import { StepThreeSubscription } from './StepThreeSubscription';
import { usePreRegistration } from '@/contexts/PreRegOnboardingContext';
import { LoadingOverlay } from './LoadingOverlay';
import { SuccessOverlay } from './SuccessOverlay';

export const PreRegOnboardingHub: React.FC = () => {
  const { state, updateState } = usePreRegistration();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalSteps = 3;

  const toggleTheme = () => {
	updateState({ theme: state.theme === 'dark' ? 'light' : 'dark' });
  };

//   const handleNext = async () => {
// 	if (!isValid) return;
// 	if (state.step < totalSteps) {
// 	  updateState({ step: state.step + 1 });
// 	} else {
// 	  setIsSubmitting(true);
// 	  const res = await saveUserPreOnboarding(state);
// 	  setIsSubmitting(false);
// 	  if (res.success) {
// 		setShowSuccess(true);
// 	  } else {
// 		alert(res.error || 'A transmission error occurred.');
// 	  }
// 	}
//   };
   const handleNext = async () => {
	if (!isValid) return;

	if (state.step < totalSteps) {
		updateState({ step: state.step + 1 });
	} else {
		setIsSubmitting(true);

		// Ensure the animation runs for at least 4.8s (1200ms * 4 steps)
		const MIN_ANIMATION_DURATION = 4800;
		const delayPromise = new Promise((resolve) => setTimeout(resolve, MIN_ANIMATION_DURATION));

		try {
		// Execute both the backend save and the minimum timer concurrently
		const [res] = await Promise.all([
			saveUserPreOnboarding(state),
			delayPromise,
		]);

		setIsSubmitting(false);

		if (res.success) {
			setShowSuccess(true);
		} else {
			alert(res.error || 'A transmission error occurred.');
		}
		} catch (error) {
		setIsSubmitting(false);
		alert('An unexpected error occurred during submission.');
		}
	}
  };

  const handleBack = () => {
	if (state.step > 1) {
	  updateState({ step: state.step - 1 });
	}
  };

  return (
	<div className="flex h-screen w-screen overflow-hidden bg-[var(--bg)] text-[var(--ink)]">
	  {/* 280px left boundary layout framing panels */}
	  <LeftNavigationPanel />

	  <div className="flex-1 flex flex-col min-w-0 relative h-full">
		{/* Top Status Filler Header */}
		<header 
			className="flex items-center justify-between p-[16px_32px] border-b shrink-0 select-none transition-colors duration-300"
			style={{
				borderColor: 'var(--bd)',
				backgroundColor: 'var(--bg)'
			}}
			>
			{/* Left Stack: Progress Bar & Progress Step Counter */}
			<TopProgressBar currentStep={state.step} totalSteps={totalSteps} />

			{/* Right Stack: Dynamic Log State & Theme Toggler */}
			<div className="flex items-center gap-[8px]">
				<span 
				className="text-[11px] font-normal"
				style={{ 
					fontFamily: 'var(--S)', 
					color: state.auth.method === 'google' ? 'var(--green)' : 'var(--ink3)' 
				}}
				>
				{state.auth.method === 'google' ? 'Connected via Google' : 'Not signed in'}
				</span>
				{/* <button
				type="button"
				onClick={toggleTheme}
				className="w-[32px] h-[32px] rounded-[8px] bg-[var(--tog-bg)] text-[var(--tog-c)] flex items-center justify-center transition-all duration-[160ms] hover:bg-[var(--ps)] hover:text-[var(--pur2)]"
				>
				{state.theme === 'dark' ? <Sun className="w-[16px] h-[16px]" /> : <Moon className="w-[16px] h-[16px]" />}
				</button> */}
			</div>
		</header>

		{/* Unified Step Content Render Matrix */}
		<main className="flex-1 overflow-y-auto p-8 pb-32 scroll-clean bg-[var(--bg)]">
			<div className="max-w-full mx-auto  p-8  relative">
				
				{/* STEP INDICATOR DOT ROW */}
				<div className="flex items-center gap-[6px] mb-[20px]">
				{Array.from({ length: totalSteps }).map((_, idx) => {
					const stepNum = idx + 1;
					const isDone = state.step > stepNum;
					const isActive = state.step === stepNum;

					return (
					<div
						key={stepNum}
						className="h-[8px] rounded-full transition-all duration-200"
						style={{
						width: isActive ? '20px' : '8px',
						background: isActive 
							? 'var(--grad2)' 
							: isDone 
							? 'var(--green)' 
							: 'var(--bd)',
						}}
					/>
					);
				})}
				</div>
				<div 
					className="text-[13px] text-[#7C3AED] select-none font-bold uppercase"
				>
					Step {state.step} of {totalSteps}
				</div>

				{/* STEP COMPONENT VIEWPORTS */}
				{state.step === 1 && <StepOneAuth onValidStateChange={setIsValid} />}
				{state.step === 2 && <StepTwoIndustry onValidStateChange={setIsValid} />}
				{state.step === 3 && <StepThreeSubscription onValidStateChange={setIsValid} />}
			</div>
		</main>

		{/* Fixed Underpin Navigation Bar */}
		<footer className="absolute bottom-0 right-0 left-0 bg-[var(--bg)] border-t border-[var(--bd)] p-4 px-8 flex items-center justify-between z-10 transition-colors duration-300">
		  <button
			type="button"
			onClick={handleBack}
			className={`px-5 py-2.5 rounded-[var(--r2)] border border-[var(--bd2)] font-semibold text-sm text-[var(--ink2)] hover:bg-[var(--ps)] hover:border-[var(--pm)] hover:text-[var(--pur2)] transition-all ${
			  state.step === 1 ? 'invisible pointer-events-none' : ''
			}`}
		  >
			&larr; Back
		  </button>

		  <button
			type="button"
			disabled={!isValid}
			onClick={handleNext}
			className="px-6 py-2.5 rounded-[var(--r2)] bg-gradient-to-r from-[var(--pur)] via-[var(--blue)] to-[var(--cyan)] text-white font-bold text-sm shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:scale-[1.01] hover:shadow-[0_6px_22px_rgba(124,58,237,0.45)] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all"
		  >
			{state.step === totalSteps ? 'Save' : 'Contine'} &nbsp; &rarr;
		  </button>
		</footer>
	  </div>

	  {/* Transaction Pipeline Loading Overlay Component */}
	  {isSubmitting && <LoadingOverlay />}

	  {/* Success Completion Overlay */}
	  {showSuccess && <SuccessOverlay />}
	</div>
  );
};