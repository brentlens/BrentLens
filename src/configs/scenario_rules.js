export const ScenarioRules = {
    "price_targets": {
        "base_formula": "current_price × (1 + rolling_30d_return)",
        "bear_formula": "base_price - (volatility_30d × bear_multiplier)",
        "bull_formula": "base_price + (volatility_30d × bull_multiplier)",
        "bear_multiplier": 0.85,
        "bull_multiplier": 1.15
    },
    "market_regimes": {
        "strong_uptrend": {
            "condition": "return_30d > 0.05 AND shock_index > 70",
            "bear_probability": 0.15,
            "base_probability": 0.55,
            "bull_probability": 0.30
        },
        "moderate_uptrend": {
            "condition": "return_30d >= 0.02 AND return_30d <= 0.05",
            "bear_probability": 0.20,
            "base_probability": 0.60,
            "bull_probability": 0.20
        },
        "flat_sideways": {
            "condition": "return_30d > -0.02 AND return_30d < 0.02",
            "bear_probability": 0.30,
            "base_probability": 0.50,
            "bull_probability": 0.20
        },
        "moderate_downtrend": {
            "condition": "return_30d <= -0.02 AND return_30d >= -0.05",
            "bear_probability": 0.20,
            "base_probability": 0.60,
            "bull_probability": 0.20
        },
        "strong_downtrend": {
            "condition": "return_30d < -0.05",
            "bear_probability": 0.30,
            "base_probability": 0.55,
            "bull_probability": 0.15
        }
    }
}