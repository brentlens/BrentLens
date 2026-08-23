'use client';

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const tasks = [
  'Creating your account...',
  'Locking in your founding rate...',
  'Calculating your fuel exposure profile...',
  'Preparing your dashboard access...'
];

export const LoadingOverlay: React.FC = () => {
  const [activeTask, setActiveTask] = useState(0);

  useEffect(() => {
    const handle = setInterval(() => {
      setActiveTask((prev) => {
        if (prev < tasks.length - 1) {
          return prev + 1;
        }
        clearInterval(handle);
        return prev;
      });
    }, 1200);

    return () => clearInterval(handle);
  }, []);

  return (
    <div className="fixed inset-0 bg-[var(--loading-bg)] z-[500] flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-5 flex flex-col items-center">
          <img 
            src="/assets/landingPage/landing_logo.png"
            alt="BrentLens" 
            id="nav-logo" 
            className="h-[80px] w-auto block"
          />
          <h3 className="text-2xl font-extrabold tracking-tight font-[var(--font-sora)]">
            Setting up your account.
          </h3>
        </div>

        <div className="space-y-3.5">
          {tasks.map((t, idx) => {
            const isDone = idx < activeTask;
            const isActive = idx === activeTask;

            return (
              <div 
                key={idx} 
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  isDone || isActive ? 'opacity-100' : 'opacity-25'
                }`}
              >
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    isDone 
                      ? 'bg-[var(--green)] border-[var(--green)] text-white' 
                      : isActive 
                      ? 'border-[var(--pur2)] bg-transparent' 
                      : 'border-[var(--bd2)]'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-[var(--pur2)] animate-ping" />
                  ) : null}
                </div>
                <span className={`text-lg font-semibold ${isDone ? 'text-[var(--ink3)]' : 'text-[var(--ink)]'}`}>
                  {t}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full h-1 bg-[var(--bd)] rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-[var(--pur)] to-[var(--cyan)] animate-[loadingBar_4.8s_linear_forwards]" 
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
};