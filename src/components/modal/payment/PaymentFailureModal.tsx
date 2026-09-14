'use client';

import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

interface PaymentFailureModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onClose: () => void;
  isRetrying?: boolean;
}

export const PaymentFailureModal: React.FC<PaymentFailureModalProps> = ({
  isOpen,
  onRetry,
  onClose,
  isRetrying = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl border p-6 text-center shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--bg)',
          borderColor: 'var(--bd)',
          color: 'var(--ink)',
        }}
      >
        {/* Error Warning Badge */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500 ring-8 ring-red-500/5">
          <AlertCircle className="h-7 w-7" />
        </div>

        {/* Hardcoded Error Message */}
        <h3 className="text-lg font-bold">Payment Unsuccessful</h3>
        <p 
          className="mt-2 text-sm leading-relaxed"
          style={{ color: 'var(--ink2)' }}
        >
          Your card transaction could not be completed or was declined. No charges were made to your account.
        </p>

        {/* Action Button Container */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            disabled={isRetrying}
            onClick={onRetry}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--r2)] bg-gradient-to-r from-[var(--pur)] via-[var(--blue)] to-[var(--cyan)] py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Redirecting to checkout...' : 'Try Again'}
          </button>

          <button
            type="button"
            disabled={isRetrying}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--r2)] border py-2.5 text-sm font-semibold transition-all hover:bg-[var(--ps)]"
            style={{
              borderColor: 'var(--bd2)',
              color: 'var(--ink2)',
            }}
          >
            <ArrowLeft className="h-4 w-4" /> Return to Review
          </button>
        </div>
      </div>
    </div>
  );
};