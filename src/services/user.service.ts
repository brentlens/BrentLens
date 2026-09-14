/* eslint-disable @typescript-eslint/no-explicit-any */
import { OnboardingStore } from '../types/onboarding';

export const saveUserOnboarding = async (data: OnboardingStore): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Reconstruct flat data structure to fit the strict layout requested
    const formattedPayload = {
      email: data.auth.email || "",
      name: data.auth.user_name || "",
      pass: data.auth.password || "", // remains empty string for OAuth methods
      preference: {
        industry: { 
          value: data.industry, 
          label: data.industryLabel 
        },
        country: { 
          value: data.country, 
          label: data.countryLabel 
        },
        operation_scale: { 
          value: data.scaleCalcValue ?? data.scaleMultiplier ?? data.scaleMonthlyLitres, 
          label: data.scaleLabel 
        },
        fuelSpend: { 
          value: data.spendCalcValueUsd, 
          label: data.spendLabel 
        },
        fuelExposure: { 
          value: data.exposureMultiplier, 
          label: data.exposureLabel 
        },
        horizon: { 
          value: data.horizonThresholdDays, 
          label: data.horizonLabel 
        },
        strategy: { 
          value: data.strategy, 
          label: data.strategyLabel 
        },
        primaryGoal: { 
          value: data.primaryGoal, 
          label: data.goalLabel 
        },
        preferredPlan: { 
          value: data.planAmount, 
          label: data.planLabel 
        },
      },
	  google_linked:data.auth.user_name=="google"?true:false,
    };
    console.log(formattedPayload);
	
    const response = await fetch('/api/user/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedPayload)
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Transport layer failure status: ${response.status}`);
    }

    const payload = await response.json();
    return { success: true, data: payload };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network abstraction failure.' };
  }
};

export const createDodoCheckoutSession = async (
  state: any
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Derive plan key from selected plan (e.g. "Starter", "Pro", "Business" -> "starter", "pro", "business")
    const planKey = (
      state.selectedPlanKey ||
      state.planLabel ||
      (state.planAmount === 49 ? 'starter' : state.planAmount === 399 ? 'business' : 'pro')
    ).toLowerCase().trim();

    const res = await fetch('/api/dodo/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: state.auth?.email,
        name: state.auth?.user_name,
        planKey, // Send only the identifier; server decides price & product ID
        statePayload: {
          industry: state.industry,
          country: state.country,
        },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to initiate checkout');
    return { success: true, url: data.url };
  } catch (error: any) {
    return { success: false, error: error.message || 'Payment initiation failed' };
  }
};
export const saveUserPreOnboarding = async (data: any): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Reconstruct flat data structure to fit the strict layout requested
    const formattedPayload = {
      email: data.auth.email || "",
      name: data.auth.user_name || "",
      pass: data.auth.password || "", // remains empty string for OAuth methods
	  usertype: "pre_registered",
      preference: {
        industry: { 
          value: data.industry, 
          label: data.industryLabel 
        },
        country: { 
          value: data.country, 
          label: data.countryLabel 
        },
		fuelSpend: { 
          value: data.spendCalcValueUsd, 
          label: data.spendLabel 
        },
		preferredPlan: { 
          value: data.planAmount, 
          label: data.planLabel 
        },
      },
	  role:data.planLabel?.toLowerCase(),
	  google_linked:data.auth.user_name=="google"?true:false,
    };
    const response = await fetch('/api/user/preOnboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedPayload)
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Transport layer failure status: ${response.status}`);
    }

    const payload = await response.json();
    return { success: true, data: payload };
    // return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network abstraction failure.' };
  }
};
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch('/api/user/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    return Boolean(data.exists);
  } catch (error) {
    console.error('Failed to verify email:', error);
    return false;
  }
};
export const verifyDodoTransaction = async (params: {
  paymentId?: string;
  subscriptionId?: string;
}): Promise<{ success: boolean; status?: string; error?: string }> => {
  try {
    const res = await fetch('/api/dodo/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// export const fetchUserSettings = async (id: number): Promise<{ success: boolean; data?: any; error?: string }> => {
//   try {
    	
//     const response = await fetch('/api/user/onboarding', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formattedPayload)
//     });

//     if (!response.ok) {
//       const errPayload = await response.json().catch(() => ({}));
//       throw new Error(errPayload.message || `Transport layer failure status: ${response.status}`);
//     }

//     const payload = await response.json();
//     return { success: true, data: payload };
//   } catch (error: any) {
//     return { success: false, error: error.message || 'Network abstraction failure.' };
//   }
// };