'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DashboardTab, SystemTier } from '@/types/dashboard';

interface NavbarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  tier: SystemTier;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  brentPrice: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  tier,
  theme,
  setTheme,
  brentPrice,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setIsAlertsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="nav">
      {/* Logo */}
      <div className="nav-logo">
        <img 
          src="/assets/landingPage/landing_logo.png" 
          alt="BrentLens" 
          style={{ height: '38px', width: 'auto', display: 'block' }}
        />
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <button 
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-link ${activeTab === 'cost-outlook' ? 'active' : ''}`}
          onClick={() => setActiveTab('cost-outlook')}
        >
          Cost Outlook
        </button>
        <button 
          className={`nav-link ${activeTab === 'scenario-planner' ? 'active' : ''}`}
        //   onClick={() => setActiveTab('scenario-planner')}
        >
          Scenario Planner
        </button>
        <button 
          className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
        //   onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>

        {/* More Menu Dropdown Wrapper */}
        <div className="nav-more-wrap" ref={moreRef}>
          <button 
            className={`nav-link ${(activeTab === 'market-signals' || activeTab === 'impact-history' || activeTab === 'settings') ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsMoreOpen(!isMoreOpen); }}
          >
            More &#9660;
          </button>
          
          <div className={`more-dropdown ${isMoreOpen ? 'open' : ''}`}>
            <button 
              className={`more-item ${activeTab === 'market-signals' ? 'active' : ''}`}
              onClick={() => { setActiveTab('market-signals'); setIsMoreOpen(false); }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 10l3-4 2 2 4-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Market Signals
            </button>
            <button 
              className={`more-item ${activeTab === 'impact-history' ? 'active' : ''}`}
              onClick={() => { setActiveTab('impact-history'); setIsMoreOpen(false); }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Impact History
            </button>
            <div className="divider"></div>
            <button 
              className={`more-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('settings'); setIsMoreOpen(false); }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.75 2.75l1 1M10.25 10.25l1 1M2.75 11.25l1-1M10.25 3.75l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* End Actions Group */}
      <div className="nav-end">
        <div className="live-pill">
          <div className="live-dot"></div>
          Live
        </div>
        <span className={`tier-badge tb-${tier}`}>
          {tier.toUpperCase()}
        </span>

        {/* Theme Switcher Button */}
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            {theme === 'dark' ? (
              <path d="M8 1v1M8 14v1M1 8H0M15 8h1M2.64 2.64l.7.7M12.66 12.66l.7.7M2.64 13.36l.7-.7M12.66 3.34l.7-.7M11 8a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            ) : (
              <path d="M12.3 10.5a5.5 5.5 0 11-6.8-6.8 4 4 0 006.8 6.8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            )}
          </svg>
        </button>

        {/* Alert Trigger and Container Panel */}
        <div className="alert-wrap" ref={alertsRef}>
          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setIsAlertsOpen(!isAlertsOpen); }} title="Alerts">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5A4.5 4.5 0 013.5 6v3l-1 1.5h11L12.5 9V6A4.5 4.5 0 018 1.5z" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M6.5 12.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            <span className="notif-badge">5</span>
          </button>

          <div className={`alert-panel ${isAlertsOpen ? 'open' : ''}`}>
            <div className="alert-hd">
              <span className="alert-hd-t">Alerts</span>
              <span className="alert-hd-c">Mark all read</span>
            </div>
            <div className="alert-items">
              <div className="alert-item">
                <div className="alert-dot ad-red"></div>
                <div className="alert-msg"><strong>Budget Risk Increased</strong><br />Risk level moved from Medium to HIGH for your logistics profile.</div>
                <div className="alert-time">2m ago</div>
              </div>
              <div className="alert-item">
                <div className="alert-dot ad-amber"></div>
                <div className="alert-msg"><strong>Brent Threshold Crossed</strong><br />Brent crude crossed your $87.50 alert threshold upward.</div>
                <div className="alert-time">1h ago</div>
              </div>
              <div className="alert-item">
                <div className="alert-dot ad-green"></div>
                <div className="alert-msg"><strong>Procurement Window</strong><br />Optimal purchasing window opens in 3 days based on lag analysis.</div>
                <div className="alert-time">3h ago</div>
              </div>
              <div className="alert-item">
                <div className="alert-dot ad-pur"></div>
                <div className="alert-msg"><strong>Bull Scenario Probability Up</strong><br />Bull case probability increased from 20% to 28% — model updated.</div>
                <div className="alert-time">6h ago</div>
              </div>
              <div className="alert-item">
                <div className="alert-dot ad-blue"></div>
                <div className="alert-msg"><strong>April Report Ready</strong><br />Your April 2026 Monthly Variance Report is ready to download.</div>
                <div className="alert-time">Yesterday</div>
              </div>
            </div>
            <div className="alert-ft">View all alerts</div>
          </div>
        </div>

        <div className="uav">AK</div>
      </div>
    </nav>
  );
};