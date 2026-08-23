/* eslint-disable @typescript-eslint/no-explicit-any */
export const onboarding_mappings :any= {
  "fleet_size": {
    "logistics": {
      "title": "Fleet Size",
      "sub": "How many vehicles are in your fleet?",
      "opts": {
        "1-10":   { "calc_value": 5,   "label": "1 to 10 Vehicles", "desc": "Small fleet" },
        "11-50":  { "calc_value": 25,  "label": "11 to 50 Vehicles", "desc": "Mid-size fleet" },
        "51-250": { "calc_value": 100, "label": "51 to 250 Vehicles", "desc": "Large fleet" },
        "250+":   { "calc_value": 350, "label": "250+ Vehicles", "desc": "Enterprise fleet" }
      }
    },
    "aviation": {
      "title": "Aircraft Fleet",
      "sub": "How many aircraft do you operate?",
      "opts": {
        "1-5":    { "calc_value": 3,   "label": "1 to 5 Aircraft", "desc": "Small operator" },
        "6-25":   { "calc_value": 15,  "label": "6 to 25 Aircraft", "desc": "Regional carrier" },
        "26-100": { "calc_value": 55,  "label": "26 to 100 Aircraft", "desc": "Mid-size airline" },
        "100+":   { "calc_value": 150, "label": "100+ Aircraft", "desc": "Major carrier" }
      }
    },
    "maritime": {
      "title": "Vessel Count",
      "sub": "How many vessels do you operate?",
      "opts": {
        "1-5":    { "calc_value": 3,   "label": "1 to 5 Vessels", "desc": "Small operator" },
        "6-20":   { "calc_value": 12,  "label": "6 to 20 Vessels", "desc": "Mid-size fleet" },
        "21-100": { "calc_value": 55,  "label": "21-100 Vessels", "desc": "Large shipping co." },
        "100+":   { "calc_value": 150, "label": "100+ Vessels", "desc": "Major operator" }
      }
    },
    "construction": {
      "title": "Equipment Scale",
      "sub": "How many fuel-powered assets do you operate?",
      "opts": {
        "1-20":   { "calc_value": 10,  "label": "1 to 20 Assets", "desc": "Small contractor" },
        "21-100": { "calc_value": 55,  "label": "21 to 100 Assets", "desc": "Regional contractor" },
        "101-500":{ "calc_value": 250, "label": "101 to 500 Assets", "desc": "Large contractor" },
        "500+":   { "calc_value": 700, "label": "500+ Assets", "desc": "Enterprise operator" }
      }
    },
    "manufacturing": {
      "title": "Facility Scale",
      "sub": "What is the scale of your manufacturing operations?",
      "opts": {
        "single":   { "scale_multiplier": 0.70, "label": "Single Plant", "desc": "One facility" },
        "regional": { "scale_multiplier": 0.85, "label": "Regional Operations", "desc": "Multiple regional sites" },
        "national": { "scale_multiplier": 1.00, "label": "National Operations", "desc": "Nationwide footprint" },
        "multi":    { "scale_multiplier": 1.20, "label": "Multi-Country Operations", "desc": "International operations" }
      }
    },
    "agribusiness": {
      "title": "Farm / Equipment Scale",
      "sub": "What best describes the scale of your operations?",
      "opts": {
        "small":      { "monthly_litres": 8000,   "label": "Small Scale", "desc": "Under 500 acres / local" },
        "medium":     { "monthly_litres": 35000,  "label": "Medium Scale", "desc": "500 to 5,000 acres / regional" },
        "large":      { "monthly_litres": 120000, "label": "Large Scale", "desc": "5,000+ acres / national" },
        "enterprise": { "monthly_litres": 400000, "label": "Enterprise", "desc": "Multi-region / corporate" }
      }
    }
  },
  "monthly_fuel_spend": {
    "<50k":   { "calc_value_usd": 30000,   "label": "Less than $50,000" , "desc": 'Early-stage or smaller operations'},
    "50-250k":{ "calc_value_usd": 125000,  "label": "$50,000 - $250,000" , "desc":'Mid-size operations'},
    "250k-1m":{ "calc_value_usd": 500000,  "label": "$250,000 - $1,000,000" , "desc":'Large operations'},
    "1m-5m":  { "calc_value_usd": 2500000, "label": "$1M - $5M" , "desc":'Major enterprise'},
    "5m+":    { "calc_value_usd": 7500000, "label": "$5M+" , "desc":'Global or high-volume operations'}
  },
  "fuel_exposure": {
    "low":      { "multiplier": 0.08, "label": "Low", "desc": "Less than 10% of operating costs" },
    "medium":   { "multiplier": 0.15, "label": "Medium", "desc": "10 to 20% of operating costs" },
    "high":     { "multiplier": 0.27, "label": "High", "desc": "20 to 35% of operating costs" },
    "critical": { "multiplier": 0.40, "label": "Critical", "desc": "35%+ of operating costs" },
    "notsure":  { "multiplier": 0.15, "label": "Not Sure", "desc": "I would like help understanding my exposure" }
  },
  "planning_horizon": {
    "7d":    { "alert_threshold_days": 5,  "label": "7 Days", "desc": "Weekly planning cycle" },
    "30d":   { "alert_threshold_days": 20, "label": "30 Days", "desc": "Monthly planning cycle" },
    "60d":   { "alert_threshold_days": 40, "label": "60 Days", "desc": "Bi-monthly planning cycle" },
    "90d+":  { "alert_threshold_days": 60, "label": "90 Days+", "desc": "Quarterly or longer planning" }
  },
  "purchase_strategy": {
    "spot": {
      "label": "Spot Purchases",
      "desc": "We buy fuel at market price as needed"
    },
    "monthly": {
      "label": "Monthly Contracts",
      "desc": "Fixed monthly supplier agreements"
    },
    "longterm": {
      "label": "Long-Term Contracts",
      "desc": "Multi-year supply agreements"
    },
    "mixed": {
      "label": "Mixed Approach",
      "desc": "Combination of contract and spot"
    }
  },
  "primary_goal": {
    "forecast": {
      "label": "Forecast fuel costs",
      "desc": "Predict future fuel expenditure before it arrives"
    },
    "margins": {
      "label": "Protect profit margins",
      "desc": "Get early warning before costs compress margins"
    },
    "budget": {
      "label": "Budget planning",
      "desc": "Build accurate operating budgets with fuel visibility"
    },
    "procurement": {
      "label": "Procurement decisions",
      "desc": "Make better fuel purchasing and contract decisions"
    },
    "reporting": {
      "label": "Executive reporting",
      "desc": "Prepare finance-ready cost variance reports"
    }
  },
  "prefered_subscription": {
    "starter": {
      "label": "Starter",
      "desc": "Live fuel cost exposure tracking, Cost Shock Index, and basic action signal. Best for smaller operations getting started with fuel cost intelligence.",
	  "amount": 49,
	  "features":['1 seat','3mo history','2 alert types'],
	  "most_popular":false
    },
    "pro": {
      "label": "Pro",
      "desc": "Exact personalised cost impact, full action signal with countdown, Cost Outlook scenarios, Scenario Planner, and monthly PDF + CSV reports. The complete product.",
	  "amount": 149,
	  "features":['2 seat','12mo history','All 6 alerts','Monthly reports'],
	  "most_popular":true
    },
    "business": {
      "label": "Business",
      "desc": "Everything in Pro plus REST API access (10K calls/month), white-label reports, unlimited alerts with custom rules, and 5 team seats. For larger operations.",
	  "amount": 399,
	  "features":['5 seat','REST API','White-label','Unlimited alerts'],
	  "most_popular":false
    },
    "not_sure": {
      "label": "Not sure yet",
      "desc": "I want to explore the product first during my trial",
	  "amount": null,
	  "features":null,
	  "most_popular":false
    },

    
  },
  "pre_reg_subscription": {
  "starter": {
    "label": "Starter",
    "amount": 49,
    "desc": "Cost Shock Index, basic action signal, live exposure tracking. For smaller operations.",
    "most_popular": false,
    "originalPriceText": "After 3,500 seats: $79/mo",
    "savingsText": "Save $30/mo",
    "features": [
      "1 seat",
      "3mo history",
      "2 alerts"
    ]
  },
  "pro": {
    "label": "Pro",
    "amount": 149,
    "desc": "Exact cost impact number, full action signal with countdown, Cost Outlook, Scenario Planner, monthly PDF + CSV reports.",
    "most_popular": true,
    "originalPriceText": "After 3,500 seats: $249/mo",
    "savingsText": "Save $100/mo",
    "features": [
      "2 seats",
      "12mo history",
      "All 6 alerts",
      "Monthly reports"
    ]
  },
  "business": {
    "label": "Business",
    "amount": 399,
    "desc": "Everything in Pro plus REST API (10K calls/mo), white-label reports, unlimited alerts, and 5 seats.",
    "most_popular": false,
    "originalPriceText": "After 3,500 seats: $649/mo",
    "savingsText": "Save $250/mo",
    "features": [
      "5 seats",
      "REST API",
      "White-label",
      "Unlimited alerts"
    ]
  }
}
}
