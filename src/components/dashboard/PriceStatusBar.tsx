/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createClient } from '@/lib/client';
import React, { useEffect, useState } from 'react';

interface PriceStatusBarProps {
  initialBrentPrice?: number;
  initialPriceChangePercent?: number;
}

export const PriceStatusBar: React.FC<PriceStatusBarProps> = ({
  initialBrentPrice = 72.12,
  initialPriceChangePercent = 0.78,
}) => {
  const [brentPrice, setBrentPrice] = useState<number>(initialBrentPrice);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(initialPriceChangePercent);
  const [brent30DPercent, setBrent30DPercent] = useState<number>(-25.95); 
  const [updatedAt, setUpdatedAt] = useState<string>('14:32 UTC');

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const updatePriceStates = (record: any) => {
    if (record && record.price !== undefined) {
      setBrentPrice(record.price);
      
      if (record.changes) {
        // Handle parsing safely if it arrives as a string or raw object
        const changesObj = typeof record.changes === 'string' ? JSON.parse(record.changes) : record.changes;
        
        // 1. Map "24h" -> Brent Today
        if (changesObj?.["24h"]?.percent !== undefined) {
          setPriceChangePercent(changesObj["24h"].percent);
        }
        
        // 2. Map "30d" -> Brent 30D
        if (changesObj?.["30d"]?.percent !== undefined) {
          setBrent30DPercent(changesObj["30d"].percent);
        }
      }
      
      setUpdatedAt(formatTime(record.created_at || record.updated_at));
    }
  };

  useEffect(() => {
    let priceSubscription: any = null;

    const initSupabaseAndSubscribe = async () => {
      // Fixed top-level await bug by initializing inside the hook
      const supabase = await createClient();

      const fetchLatestPrice = async () => {
        const { data, error } = await supabase
          .from('brentLens_brent_crude') 
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          updatePriceStates(data);
        }
      };

      await fetchLatestPrice();

      priceSubscription = supabase
        .channel('brent-price-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT', 
            schema: 'public',
            table: 'brentLens_brent_crude', 
          },
          (payload) => {
            updatePriceStates(payload.new);
          }
        )
        .subscribe();
    };

    initSupabaseAndSubscribe();

    return () => {
      if (priceSubscription) {
        // Automatically unsubscribes when the component unmounts
        createClient().then((supabase) => {
          supabase.removeChannel(priceSubscription);
        });
      }
    };
  }, []);

  // Logical Helpers
  const isTodayIncreased = priceChangePercent > 0;
  const is30DIncreased = brent30DPercent > 0;

  // Color mappings based on user criteria:
  // Increased price (+) = Red (Loss/Bad)
  // Decreased price (-) = Green (Gain/Good)
  const todayColor = isTodayIncreased ? 'var(--red, #F43F5E)' : 'var(--green, #10B981)';
  const thirtyDayColor = is30DIncreased ? 'var(--red, #F43F5E)' : 'var(--green, #10B981)';

  return (
    <div className="biz-bar">
      <div className="biz-item">
        <div className="biz-l">Expected Cost Impact</div>
        <div className="biz-v"><span className="up">+&euro;8,400</span></div>
        <div className="biz-s">This month</div>
      </div>

      <div className="biz-item">
        <div className="biz-l">Budget Risk</div>
        <div className="biz-v"><span className="up">HIGH</span></div>
        <div className="biz-s">Act within 9 days</div>
      </div>

      <div className="biz-item">
        <div className="biz-l">Time to Impact</div>
        <div className="biz-v"><span className="up">9 days</span></div>
        <div className="biz-s">Logistics lag</div>
      </div>

      <div className="biz-item">
        <div className="biz-l">Forecast Reliability</div>
        <div className="biz-v"><span style={{ color: 'var(--pur2)' }}>72%</span></div>
        <div className="biz-s">Model accuracy</div>
      </div>

      <div className="biz-item">
        <div className="biz-l">Brent Today</div>
        <div className="biz-v">
          <span>${brentPrice.toFixed(2)}</span>
          &nbsp;
          <span 
            className="up" 
            style={{ 
              fontSize: '10px', 
              fontWeight: '700', 
              marginLeft: '4px',
              color: todayColor
            }}
          >
            {isTodayIncreased ? '▲ +' : '▼ '}{priceChangePercent.toFixed(2)}%
          </span>
        </div>
        <div className="biz-s">Updated {updatedAt}</div>
      </div>

      <div className="biz-item">
        <div className="biz-l">Brent 30D</div>
        <div className="biz-v">
          <span 
            className="up"
            style={{ 
              color: thirtyDayColor
            }}
          >
            {is30DIncreased ? '+' : ''}{brent30DPercent.toFixed(2)}%
          </span>
        </div>
        <div className="biz-s">{is30DIncreased ? 'Accelerating' : 'Decelerating'}</div>
      </div>
    </div>
  );
};