export const sectors = {
  "logistics": {
    "display_name": "Logistics & Freight",
    "sensitivity_score": 92,
    "sensitivity_normalised": 0.92,
    "lag_adjustment_days": -1,
    "description": "Direct diesel 30-40% of OpEx. Surcharges applied within days."
  },
  "aviation": {
    "display_name": "Aviation",
    "sensitivity_score": 97,
    "sensitivity_normalised": 0.97,
    "lag_adjustment_days": -2,
    "description": "Jet-A fuel 25-35% of OpEx. Tracks crude within hours."
  },
  "maritime": {
    "display_name": "Maritime",
    "sensitivity_score": 88,
    "sensitivity_normalised": 0.88,
    "lag_adjustment_days": 2,
    "description": "Bunker fuel 40-60% of voyage cost. Rotterdam/Singapore lag."
  },
  "manufacturing": {
    "display_name": "Manufacturing",
    "sensitivity_score": 74,
    "sensitivity_normalised": 0.74,
    "lag_adjustment_days": 5,
    "description": "Energy inputs + logistics. Multiple supply chain steps add lag."
  },
  "construction": {
    "display_name": "Construction",
    "sensitivity_score": 71,
    "sensitivity_normalised": 0.71,
    "lag_adjustment_days": 5,
    "description": "Heavy plant diesel + bitumen. Long project cycles smooth impact."
  },
  "agribusiness": {
    "display_name": "Agriculture & Agribusiness",
    "sensitivity_score": 68,
    "sensitivity_normalised": 0.68,
    "lag_adjustment_days": 7,
    "description": "Diesel + fertiliser + freight. Seasonal exposure only."
  }
}