import { WaitlistComponent } from "@/components/waitList/WaitListOnboardingHub";
import { PreRegistrationProvider } from "@/contexts/PreRegOnboardingContext";
import React from "react";
export const metadata = {
  title: "Join the Waitlist",
  description: "Get early access to our platform.",
};

export default function WaitlistPage() {
  return (
    <PreRegistrationProvider>
		  <WaitlistComponent />
	</PreRegistrationProvider>
  );
}