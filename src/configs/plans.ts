export interface PlanDefinition {
  id: string; // The Plan Key
  label: string;
  amount: number;
  dodoProductId: string;
}

export const SERVER_PLANS: Record<string, PlanDefinition> = {
  starter: {
    id: 'starter',
    label: 'Starter',
    amount: 49,
    dodoProductId: process.env.DODO_PROD_STARTER || 'pdt_0NmWH0rAX2JTS0Vj1Ya40',
  },
  pro: {
    id: 'pro',
    label: 'Pro',
    amount: 149,
    dodoProductId: process.env.DODO_PROD_PRO || 'pdt_0NmWH0rAX2JTS0Vj1Ya40',
  },
  business: {
    id: 'business',
    label: 'Business',
    amount: 399,
    dodoProductId: process.env.DODO_PROD_BUSINESS || 'pdt_0NmWH0rAX2JTS0Vj1Ya40',
  },
};