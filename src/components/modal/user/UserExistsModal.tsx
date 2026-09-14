'use client';

import React from 'react';
import { UserCheck, ArrowLeft } from 'lucide-react';

interface UserExistsModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
}

export const UserExistsModal: React.FC<UserExistsModalProps> = ({
  isOpen,
  email,
  onClose,
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
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
          <UserCheck className="h-7 w-7" />
        </div>

        <h3 className="text-lg font-bold">Account Already Registered</h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink2)' }}>
          An account associated with <span className="font-semibold text-[var(--ink)]">{email}</span> has already completed pre-registration.
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--r2)] border py-2.5 text-sm font-semibold transition-all hover:bg-[var(--ps)]"
            style={{
              borderColor: 'var(--bd2)',
              color: 'var(--ink2)',
            }}
          >
            <ArrowLeft className="h-4 w-4" /> Use Another Email
          </button>
        </div>
      </div>
    </div>
  );
};