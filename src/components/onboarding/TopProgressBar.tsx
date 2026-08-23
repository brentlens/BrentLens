'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const TopProgressBar: React.FC<ProgressProps> = ({ currentStep, totalSteps }) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="flex-1 max-w-[400px]">
      {/* Progress Track */}
      <div className="h-[4px] bg-[var(--bd)] rounded-[2px] overflow-hidden mb-[6px]">
        <motion.div 
          className="h-full bg-gradient-to-r from-[var(--pur)] via-[var(--blue)] to-[var(--cyan)] rounded-[2px]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      {/* Label Text Placement */}
      <div 
        className="text-[11px] select-none font-normal"
        style={{ fontFamily: 'var(--S)', color: 'var(--ink3)' }}
      >
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};