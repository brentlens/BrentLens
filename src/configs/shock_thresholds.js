export const ShockThresHolds = {
    "formula_weights": {
        "brent_momentum": 0.35,
        "sector_sensitivity": 0.30,
        "pass_through_rate": 0.20,
        "inverse_lag": 0.15
    },
    "momentum_normalisation": {
        "divisor": 10,
        "cap": 100,
        "comment": "abs(brent_30d_change_%) × divisor, capped at cap. 10% move = score 100."
    },
    "inverse_lag_formula": {
        "multiplier": 5,
        "comment": "max(0, 100 - (effective_lag_days × multiplier)). 9-day lag = score 55."
    },
    "risk_bands": {
        "HIGH": { "min": 75, "max": 100, "color_hex": "F43F5E", "action": "urgent" },
        "MEDIUM": { "min": 50, "max": 74, "color_hex": "F59E0B", "action": "monitor" },
        "LOW": { "min": 25, "max": 49, "color_hex": "7C3AED", "action": "watch" },
        "MINIMAL": { "min": 0, "max": 24, "color_hex": "10B981", "action": "none" }
    }
}