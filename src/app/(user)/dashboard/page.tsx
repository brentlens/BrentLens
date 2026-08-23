
// File: src/app/(user)/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DashboardTab, SystemTier } from '@/types/dashboard';
import { Navbar } from '@/components/dashboard/Navbar';
import { PriceStatusBar } from '@/components/dashboard/PriceStatusBar';
import DashboardHome from '@/components/dashboard/DashboardHome';
import CostOutlook from '@/components/costOutlook/CostOutlook';
import ScenarioPlanner from '@/components/scenarioPlanner/ScenarioPlanner';
import MonthlyVarianceReports from '@/components/Reports/MonthlyVarianceReports';

export default function DashboardClientPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [tier, setTier] = useState<SystemTier>('pro');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [brentPrice, setBrentPrice] = useState<number>(87.42);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(1.44);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardHome 
            setActiveTab={setActiveTab} 
            tier={tier} 
            setTier={setTier} 
          />
        );
      case 'cost-outlook':
        return (
          <CostOutlook/>
          // <div className="page active" style={{ padding: '20px 28px' }}>
          //   <h2 className="sec-title">Cost Outlook Workspace</h2>
          //   <p className="sec-sub">Bloomberg Terminal style analytics engine container placeholder.</p>
          // </div>
        );
      case 'scenario-planner':
        return (
          <ScenarioPlanner/>
          // <div className="page active" style={{ padding: '20px 28px' }}>
          //   <h2 className="sec-title">Scenario Planner Workspace</h2>
          //   <p className="sec-sub">Interactive single-page live model simulation container placeholder.</p>
          // </div>
        );
      case 'reports':
        return (
          <MonthlyVarianceReports/>
          // <div className="page active" style={{ padding: '20px 28px' }}>
          //   <h2 className="sec-title">Reports Archive</h2>
          //   <p className="sec-sub">Monthly executive statement and file delivery manager container placeholder.</p>
          // </div>
        );
      case 'market-signals':
        return (
          <div className="page active" style={{ padding: '20px 28px' }}>
            <h2 className="sec-title">Real-Time Market Signals</h2>
            <p className="sec-sub">Upstream price alert feed container placeholder.</p>
          </div>
        );
      case 'impact-history':
        return (
          <div className="page active" style={{ padding: '20px 28px' }}>
            <h2 className="sec-title">Historical Impact Log</h2>
            <p className="sec-sub">Logged performance variance history container placeholder.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="page active" style={{ padding: '20px 28px' }}>
            <h2 className="sec-title">Settings & Parameters</h2>
            <p className="sec-sub">System global variable toggles and configuration matrix container placeholder.</p>
          </div>
        );
      default:
        return <DashboardHome setActiveTab={setActiveTab} tier={tier} setTier={setTier} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tier={tier} 
        theme={theme} 
        setTheme={setTheme} 
        brentPrice={brentPrice} 
      />
      <PriceStatusBar 
        initialBrentPrice={brentPrice} 
        initialPriceChangePercent={priceChangePercent} 
      />
      <div className="page-wrap">
        {renderActiveComponent()}
      </div>
    </div>
  );
}