export const AdminFlags = {
    "geopolitical_penalty": {
        "value": 10,
        "min": 0,
        "max": 15,
        "description": "Active supply disruption risk. 0=none, 8=moderate, 15=severe.",
        "current_reason": "Strait of Hormuz partial closure — ongoing as of May 2026",
        "last_updated": "2026-05-01",
        "updated_by": "admin"
    },
    "opec_uncertainty": {
        "value": 3,
        "min": 0,
        "max": 5,
        "description": "0=meeting held, no changes. 5=meeting pending, outcome unknown.",
        "current_reason": "OPEC+ meeting pending June 1",
        "last_updated": "2026-04-29",
        "updated_by": "admin"
    },
    "reliability_base": {
        "value": 85,
        "min": 60,
        "max": 95,
        "description": "Baseline reliability % in calm market conditions. Default 85.",
        "last_updated": "2026-01-01",
        "updated_by": "admin"
    },
    "reliability_floor": {
        "value": 40,
        "description": "Minimum reliability % regardless of penalties. Never goes below this.",
        "last_updated": "2026-01-01",
        "updated_by": "admin"
    }
}