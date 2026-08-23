'use client';

import React from 'react';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  selected: boolean;
}

export const Radio: React.FC<RadioProps> = ({ label, sublabel, icon, selected, ...props }) => {
  return (
    <label className={`flex items-start gap-4 p-4 rounded-[var(--r)] border transition-all duration-200 cursor-pointer ${
      selected 
        ? 'bg-[var(--surf2)] border-[var(--pur)] shadow-[var(--sh)]' 
        : 'bg-[var(--card-bg)] border-[var(--bd)] hover:bg-[var(--card-h)] hover:border-[var(--bd2)]'
    }`}>
      <input type="radio" className="sr-only" {...props} />
      {icon && <div className={`mt-0.5 text-xl ${selected ? 'text-[var(--pur)]' : 'text-[var(--ink2)]'}`}>{icon}</div>}
      <div className="flex-1">
        <div className="font-semibold text-sm text-[var(--ink)] tracking-tight">{label}</div>
        {sublabel && <div className="text-xs text-[var(--ink3)] mt-0.5 font-normal leading-relaxed">{sublabel}</div>}
      </div>
      <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
        selected ? 'border-[var(--pur)] bg-[var(--pur)]' : 'border-[var(--ink4)]'
      }`}>
        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
    </label>
  );
};