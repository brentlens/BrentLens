"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  Users,
  CreditCard,
  Code,
  ChevronDown,
} from "lucide-react";

type TabType = "Profile" | "Alerts" | "Team" | "Billing" | "API Keys";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Profile");

  // --- FORM STATES ---
  // Profile Tab
  const [profileForm, setProfileForm] = useState({
    industry: "Logistics",
    country: "Germany",
    monthlyFuelSpend: "$50K – $250K",
    contractType: "Variable rate",
    fullName: "Aakash Kumar",
    workEmail: "aakash@company.com",
  });

  // Alerts Tab
  const [alertsForm, setAlertsForm] = useState({
    budgetRiskIncreased: true,
    brentThresholdCrossed: true,
    procurementWindowOpens: true,
    bullScenarioProbabilityIncreased: true,
    monthlyReportReady: true,
    dailyForecastUpdated: false,
    brentPriceThreshold: "87.50",
  });

  // Active Plan Tier Switcher (Bottom Right Preview)
  const [activePlanTier, setActivePlanTier] = useState<"Starter" | "Pro" | "Business">("Pro");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] p-6 lg:p-10 font-sans relative">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#6366F1] uppercase">
            Account Settings
          </span>
          <h1 className="text-3xl font-extrabold text-[#0F172A] mt-0.5">
            Settings
          </h1>
        </div>

        {/* Save Changes Button */}
        <button
          type="button"
          className="px-6 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:opacity-95 transition"
        >
          Save Changes
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* LEFT NAVIGATION SIDEBAR */}
        <div className="w-full md:w-56 flex flex-col gap-1.5 shrink-0">
          <SidebarTab
            id="Profile"
            label="Profile"
            icon={<User className="w-4 h-4" />}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <SidebarTab
            id="Alerts"
            label="Alerts"
            icon={<Bell className="w-4 h-4" />}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <SidebarTab
            id="Team"
            label="Team"
            icon={<Users className="w-4 h-4" />}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <SidebarTab
            id="Billing"
            label="Billing"
            icon={<CreditCard className="w-4 h-4" />}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <SidebarTab
            id="API Keys"
            label="API Keys"
            icon={<Code className="w-4 h-4" />}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* TAB 1: PROFILE */}
          {activeTab === "Profile" && (
            <>
              {/* Operational Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                <h2 className="text-base font-bold text-[#0F172A] mb-5">
                  Operational Profile
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Industry
                    </label>
                    <div className="relative">
                      <select
                        value={profileForm.industry}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, industry: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Logistics">Logistics</option>
                        <option value="Aviation">Aviation</option>
                        <option value="Maritime">Maritime</option>
                        <option value="Manufacturing">Manufacturing</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Country
                    </label>
                    <div className="relative">
                      <select
                        value={profileForm.country}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, country: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Germany">Germany</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="India">India</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Monthly Fuel Spend
                    </label>
                    <div className="relative">
                      <select
                        value={profileForm.monthlyFuelSpend}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            monthlyFuelSpend: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="$50K – $250K">$50K – $250K</option>
                        <option value="<$50K">&lt;$50K</option>
                        <option value="$250K – $1M">$250K – $1M</option>
                        <option value=">$1M">&gt;$1M</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Contract Type
                    </label>
                    <div className="relative">
                      <select
                        value={profileForm.contractType}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            contractType: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      >
                        <option value="Variable rate">Variable rate</option>
                        <option value="Fixed rate">Fixed rate</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                <h2 className="text-base font-bold text-[#0F172A] mb-5">
                  Account Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, fullName: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.workEmail}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, workEmail: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: ALERTS */}
          {activeTab === "Alerts" && (
            <>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-4">
                <AlertRow
                  color="#EF4444"
                  title="Budget Risk Increased"
                  description="When risk level changes from Medium to HIGH"
                  checked={alertsForm.budgetRiskIncreased}
                  onToggle={() =>
                    setAlertsForm({
                      ...alertsForm,
                      budgetRiskIncreased: !alertsForm.budgetRiskIncreased,
                    })
                  }
                />
                <AlertRow
                  color="#F59E0B"
                  title="Brent Threshold Crossed"
                  description="When Brent crosses your custom price threshold"
                  checked={alertsForm.brentThresholdCrossed}
                  onToggle={() =>
                    setAlertsForm({
                      ...alertsForm,
                      brentThresholdCrossed: !alertsForm.brentThresholdCrossed,
                    })
                  }
                />
                <AlertRow
                  color="#10B981"
                  title="Procurement Window Opens"
                  description="When a favourable purchasing window is identified"
                  checked={alertsForm.procurementWindowOpens}
                  onToggle={() =>
                    setAlertsForm({
                      ...alertsForm,
                      procurementWindowOpens: !alertsForm.procurementWindowOpens,
                    })
                  }
                />
                <AlertRow
                  color="#8B5CF6"
                  title="Bull Scenario Probability Increased"
                  description="When the model shifts toward a higher cost scenario"
                  checked={alertsForm.bullScenarioProbabilityIncreased}
                  onToggle={() =>
                    setAlertsForm({
                      ...alertsForm,
                      bullScenarioProbabilityIncreased:
                        !alertsForm.bullScenarioProbabilityIncreased,
                    })
                  }
                />
                <AlertRow
                  color="#06B6D4"
                  title="Monthly Report Ready"
                  description="When your monthly variance report is generated"
                  checked={alertsForm.monthlyReportReady}
                  onToggle={() =>
                    setAlertsForm({
                      ...alertsForm,
                      monthlyReportReady: !alertsForm.monthlyReportReady,
                    })
                  }
                />
                <AlertRow
                  color="#64748B"
                  title="Daily Forecast Updated"
                  description="When the daily model refresh runs — off by default"
                  checked={alertsForm.dailyForecastUpdated}
                  onToggle={() =>
                    setAlertsForm({
                      ...alertsForm,
                      dailyForecastUpdated: !alertsForm.dailyForecastUpdated,
                    })
                  }
                />
              </div>

              {/* Brent Price Threshold Box */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
                <h2 className="text-base font-bold text-[#0F172A] mb-5">
                  Brent Price Threshold
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-500">
                    Alert when Brent crosses:
                  </span>
                  <input
                    type="text"
                    value={alertsForm.brentPriceThreshold}
                    onChange={(e) =>
                      setAlertsForm({
                        ...alertsForm,
                        brentPriceThreshold: e.target.value,
                      })
                    }
                    className="w-32 bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* TAB 3: TEAM */}
          {activeTab === "Team" && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-base font-bold text-[#0F172A]">
                  Team Members
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  1 of 2 seats used
                </span>
              </div>

              {/* User Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6366F1] text-white text-xs font-bold flex items-center justify-center">
                    AK
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Aakash Kumar
                    </h3>
                    <p className="text-xs text-slate-400">
                      aakash@company.com · <span className="font-medium text-slate-500">Owner</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Invite Team Member Button */}
              <button
                type="button"
                className="w-full py-3 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition text-center"
              >
                + Invite team member
              </button>
            </div>
          )}

          {/* TAB 4: BILLING */}
          {activeTab === "Billing" && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <h2 className="text-base font-bold text-[#0F172A] mb-5">
                Current Plan
              </h2>

              {/* Plan Banner */}
              <div className="bg-[#F3F0FF] border border-[#E9D5FF] rounded-2xl p-6 mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#8B5CF6]">Pro Plan</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    €99/month · Founding Member rate · Locked forever
                  </p>
                </div>
                <span className="bg-[#DDD6FE] text-[#7C3AED] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                  Active
                </span>
              </div>

              <div className="text-xs text-slate-500 space-y-1 mb-6 font-medium">
                <p>Next billing date: June 1, 2026 · €99.00</p>
                <p>Payment method: Visa ending 4242</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Upgrade to Business
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Manage Billing
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: API KEYS */}
          {activeTab === "API Keys" && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-[#0F172A]">
                  API Keys
                </h2>
                <span className="bg-[#F3F0FF] text-[#7C3AED] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                  Business Only
                </span>
              </div>

              {/* Locked Notice Banner */}
              <div className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  API access requires Business tier
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  REST API with 10,000 calls/month, white-label reports, and 5 team seats
                </p>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#3B82F6] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 hover:opacity-95 transition"
                >
                  Upgrade to Business →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Sidebar Tab Component
function SidebarTab({
  id,
  label,
  icon,
  activeTab,
  onClick,
}: {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  activeTab: TabType;
  onClick: (id: TabType) => void;
}) {
  const isActive = activeTab === id;
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
        isActive
          ? "bg-[#F3F0FF] text-[#7C3AED]"
          : "text-slate-500 hover:bg-slate-100/60 hover:text-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// Helper Alert Row Component for Alerts Tab
function AlertRow({
  color,
  title,
  description,
  checked,
  onToggle,
}: {
  color: string;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-slate-200 transition">
      <div className="flex items-start gap-3">
        <span
          className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
          style={{ backgroundColor: color }}
        />
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Switch Toggle */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
          checked ? "bg-[#8B5CF6]" : "bg-slate-200"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}