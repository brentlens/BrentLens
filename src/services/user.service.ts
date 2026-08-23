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
        // operation_scale: { 
        //   value: data.scaleCalcValue ?? data.scaleMultiplier ?? data.scaleMonthlyLitres, 
        //   label: data.scaleLabel 
        // },
        
        // fuelExposure: { 
        //   value: data.exposureMultiplier, 
        //   label: data.exposureLabel 
        // },
        // horizon: { 
        //   value: data.horizonThresholdDays, 
        //   label: data.horizonLabel 
        // },
        // strategy: { 
        //   value: data.strategy, 
        //   label: data.strategyLabel 
        // },
        // primaryGoal: { 
        //   value: data.primaryGoal, 
        //   label: data.goalLabel 
        // },
        
      },
	  google_linked:data.auth.user_name=="google"?true:false,
    };
    console.log(formattedPayload);
	
    // const response = await fetch('/api/user/onboarding', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formattedPayload)
    // });

    // if (!response.ok) {
    //   const errPayload = await response.json().catch(() => ({}));
    //   throw new Error(errPayload.message || `Transport layer failure status: ${response.status}`);
    // }

    // const payload = await response.json();
    // return { success: true, data: payload };
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network abstraction failure.' };
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