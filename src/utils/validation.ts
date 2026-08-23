import { OnboardingStore } from '../types/onboarding';

export const validateEmail = (email?: string): boolean => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password?: string): boolean => {
  if (!password) return false;
  // Minimum length 8, contains at least 1 digit and 1 special char
  return password.length >= 8 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
};

export const validateStep = (step: number, state: OnboardingStore): { isValid: boolean; message: string } => {
  switch (step) {
    case 1:
      if (state.auth.method === 'google') return { isValid: true, message: '' };
      if (state.auth.method === 'email') {
        if (!validateEmail(state.auth.email)) return { isValid: false, message: 'Please enter a valid email address.' };
        if (!validatePassword(state.auth.password)) return { isValid: false, message: 'Please enter a password.' };
        return { isValid: true, message: '' };
      }
      return { isValid: false, message: 'Authentication required. Choose Google or Email login.' };
    case 2:
      return state.industry ? { isValid: true, message: '' } : { isValid: false, message: 'Please select an industry classification.' };
    case 3:
      return state.country ? { isValid: true, message: '' } : { isValid: false, message: 'Please select your operating domain country.' };
    case 4:
      return state.scale ? { isValid: true, message: '' } : { isValid: false, message: 'Operational metric scale selection is required.' };
    case 5:
      return state.fuelSpend ? { isValid: true, message: '' } : { isValid: false, message: 'Please specify your corporate annual fuel expenditure.' };
    case 6:
      return state.primaryGoal ? { isValid: true, message: '' } : { isValid: false, message: 'Please select a primary workflow deployment goal.' };
    case 7:
      return state.horizon ? { isValid: true, message: '' } : { isValid: false, message: 'Analytical pipeline evaluation horizon must be defined.' };
    case 8:
      return state.features.length > 0 ? { isValid: true, message: '' } : { isValid: false, message: 'Select at least one functional application framework module.' };
    case 9:
      if (state.teamSize <= 0) return { isValid: false, message: 'Total operational seat allocation count must exceed 0.' };
      if (state.teamMembers.length === 0) return { isValid: false, message: 'Please append at least one engineering team user entity.' };
      for (const m of state.teamMembers) {
        if (!m.name || !m.role || !validateEmail(m.email)) {
          return { isValid: false, message: 'All appended team entities must contain complete name, operational role, and unique valid email criteria.' };
        }
      }
      return { isValid: true, message: '' };
    default:
      return { isValid: false, message: 'Unknown step scope reference encountered.' };
  }
};