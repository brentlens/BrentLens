export const TierAccess = {
    "starter": {
        "cost_impact_precision": "approximate",
        "shock_index_sub_bars": false,
        "action_signal_full": false,
        "cost_outlook_access": false,
        "scenario_planner_access": false,
        "monthly_report_pdf": false,
        "monthly_report_csv": false,
        "white_label_report": false,
        "market_signals_full": false,
        "market_signals_basic": true,
        "impact_history_months": 3,
        "brent_chart_months": 3,
        "alert_types_allowed": ["budget_risk", "threshold_crossed"],
        "monthly_alert_limit": 2,
        "user_seats": 1,
        "api_access": false,
        "csv_data_export": false
    },
    "pro": {
        "cost_impact_precision": "exact",
        "shock_index_sub_bars": true,
        "action_signal_full": true,
        "cost_outlook_access": true,
        "scenario_planner_access": true,
        "monthly_report_pdf": true,
        "monthly_report_csv": true,
        "white_label_report": false,
        "market_signals_full": true,
        "market_signals_basic": true,
        "impact_history_months": 12,
        "brent_chart_months": 6,
        "alert_types_allowed": [
            "budget_risk", "threshold_crossed", "procurement_window",
            "bull_scenario_up", "report_ready", "forecast_updated"
        ],
        "monthly_alert_limit": 10,
        "user_seats": 2,
        "api_access": false,
        "csv_data_export": true
    },
    "business": {
        "cost_impact_precision": "exact",
        "shock_index_sub_bars": true,
        "action_signal_full": true,
        "cost_outlook_access": true,
        "scenario_planner_access": true,
        "monthly_report_pdf": true,
        "monthly_report_csv": true,
        "white_label_report": true,
        "market_signals_full": true,
        "market_signals_basic": true,
        "impact_history_months": 999,
        "brent_chart_months": 999,
        "alert_types_allowed": [
            "budget_risk", "threshold_crossed", "procurement_window",
            "bull_scenario_up", "report_ready", "forecast_updated", "custom"
        ],
        "monthly_alert_limit": 99999,
        "user_seats": 5,
        "api_access": true,
        "api_monthly_calls": 10000,
        "csv_data_export": true
    }
}