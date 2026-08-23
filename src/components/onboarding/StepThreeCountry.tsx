'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { StepProps,CountryItem } from '@/types/onboarding';
import { Search } from 'lucide-react';


const countries : CountryItem[] = [
  {code:'DE',name:'Germany'},{code:'GB',name:'United Kingdom'},{code:'FR',name:'France'},{code:'US',name:'United States'},
  {code:'CA',name:'Canada'},{code:'AU',name:'Australia'},{code:'IN',name:'India'},{code:'JP',name:'Japan'},
  {code:'KR',name:'South Korea'},{code:'AE',name:'United Arab Emirates'},{code:'SA',name:'Saudi Arabia'},
  {code:'SG',name:'Singapore'},{code:'BR',name:'Brazil'},{code:'MX',name:'Mexico'},{code:'ZA',name:'South Africa'},
  {code:'NL',name:'Netherlands'},{code:'BE',name:'Belgium'},{code:'PL',name:'Poland'},{code:'ES',name:'Spain'},
  {code:'IT',name:'Italy'},{code:'CH',name:'Switzerland'},{code:'SE',name:'Sweden'},{code:'NO',name:'Norway'},
  {code:'DK',name:'Denmark'},{code:'FI',name:'Finland'},{code:'AT',name:'Austria'},{code:'PT',name:'Portugal'},
  {code:'NZ',name:'New Zealand'},{code:'ID',name:'Indonesia'},{code:'MY',name:'Malaysia'},{code:'TH',name:'Thailand'},
  {code:'PH',name:'Philippines'},{code:'VN',name:'Vietnam'},{code:'CN',name:'China'},{code:'HK',name:'Hong Kong'},
  {code:'TW',name:'Taiwan'},{code:'PK',name:'Pakistan'},{code:'BD',name:'Bangladesh'},{code:'EG',name:'Egypt'},
  {code:'NG',name:'Nigeria'},{code:'GH',name:'Ghana'},{code:'KE',name:'Kenya'},{code:'TZ',name:'Tanzania'},
  {code:'ET',name:'Ethiopia'},{code:'AR',name:'Argentina'},{code:'CL',name:'Chile'},{code:'CO',name:'Colombia'},
  {code:'PE',name:'Peru'},{code:'UY',name:'Uruguay'},{code:'RU',name:'Russia'},{code:'UA',name:'Ukraine'},
  {code:'TR',name:'Turkey'},{code:'IL',name:'Israel'},{code:'IQ',name:'Iraq'},{code:'QA',name:'Qatar'},
  {code:'KW',name:'Kuwait'},{code:'OM',name:'Oman'},{code:'BH',name:'Bahrain'},{code:'JO',name:'Jordan'},
  {code:'MA',name:'Morocco'},{code:'TN',name:'Tunisia'},{code:'LY',name:'Libya'},{code:'AO',name:'Angola'},
  {code:'UZ',name:'Uzbekistan'},{code:'KZ',name:'Kazakhstan'},{code:'AZ',name:'Azerbaijan'},{code:'CZ',name:'Czech Republic'}
];

export const StepThreeCountry: React.FC<StepProps> = ({ onValidStateChange }) => {
  const { state, updateState } = useOnboarding();
  const [query, setQuery] = useState('');

  useEffect(() => {
    onValidStateChange(!!state.country);
  }, [state.country, onValidStateChange]);

  const filtered = useMemo(() => {
    return countries.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="space-y-6 w-full mx-auto py-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight font-[var(--font-sora)]">Primary operating country</h2>
        <p className="text-sm text-[var(--ink3)]">We use your country to apply the correct market pass-through model and cost lag periods.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink3)]" />
        <input
          type="text"
          placeholder="Filter regions, nodes or trade hubs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 p-3.5 text-sm bg-[var(--input-bg)] border border-[var(--bd)] rounded-[var(--r)] text-[var(--ink)] focus:border-[var(--pur)] focus:ring-2 focus:ring-[var(--ps)] transition-all"
        />
      </div>

      <div className="border border-[var(--bd)] bg-[var(--card-bg)] rounded-[var(--r)] divide-y divide-[var(--bd)] max-h-[260px] overflow-y-auto scroll-clean shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-[var(--ink3)] font-medium">No computational legal nodes match lookup parameters.</div>
        ) : (
          filtered.map((c) => {
            const isSelected = state.country === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => updateState({ country: c.code, countryLabel: c.name })}
                className={`w-full flex items-center justify-between p-3.5 text-left text-sm font-semibold transition-all ${
                  isSelected ? 'bg-[var(--surf2)] text-[var(--pur)]' : 'hover:bg-[var(--surf)] text-[var(--ink)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="tracking-tight">{c.name}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};