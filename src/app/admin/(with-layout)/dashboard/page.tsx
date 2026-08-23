/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { 
  Search,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- Mock Data Structures ---

const stats = [
  { label: 'Pending review', value: '7', change: '3 since yesterday', trend: 'up' },
  { label: 'Total published', value: '1,284', change: '23% this year', trend: 'up' },
  { label: 'Verified', value: '847', change: '23% this year', trend: 'up' },
  { label: 'Ingested today', value: '18', change: 'Via RSS pipeline', trend: 'neutral' },
  { label: 'Active alerts', value: '2', change: 'Needs Attention', trend: 'alert' },
];

const recentIncidents = [
  { id: 1, title: 'Mosque defaced with graffiti i...', state: 'Uttar Pradesh', date: '22 Apr 2026', community: 'Muslim', color: 'text-orange-600' },
  { id: 2, title: 'Mosque defaced with graffiti i...', state: 'Uttar Pradesh', date: '22 Apr 2026', community: 'Christian', color: 'text-red-600' },
  { id: 3, title: 'Temple gates damaged during...', state: 'Uttar Pradesh', date: '30 May 2026', community: 'Dalit', color: 'text-orange-500' },
  { id: 4, title: 'Synagogue attacked amid risin...', state: 'Maharashtra', date: '12 Jun 2026', community: 'Sikh', color: 'text-green-700' },
  { id: 5, title: 'Temple gates damaged during...', state: 'Uttar Pradesh', date: '30 May 2026', community: 'Dalit', color: 'text-orange-500' },
  { id: 6, title: 'Sikh gurudwara vandalized in...', state: 'Punjab', date: '05 Jul 2026', community: 'Adivasi', color: 'text-purple-700' },
  { id: 7, title: 'Temple gates damaged during...', state: 'Uttar Pradesh', date: '30 May 2026', community: 'Dalit', color: 'text-orange-500' },
];

const sourceHealth = [
  { name: 'Hindustan Times', time: '5 min ago', status: '+4' },
  { name: 'The Hindu', time: '10 min ago', status: '+4' },
  { name: 'NDTV', time: '15 min ago', status: '+4' },
  { name: 'Times of India', time: '20 min ago', status: '+4' },
  { name: 'The Statesman', time: '25 min ago', status: '+4' },
  { name: 'Deccan Chronicle', time: '30 min ago', status: '+4' },
  { name: 'Indian Express', time: '35 min ago', status: '+4' },
  { name: 'The Pioneer', time: '40 min ago', status: '+4' },
];


export default function AdminPortal() {
const router = useRouter();
  return (
    <div className="flex min-h-screen bg-[#F4F4F4] text-[#2D2D2D] font-sans p-6">
      <main className="flex-1 overflow-auto">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
			<h1 className="text-xl font-playfair text-[#C05646] font-medium">Admin portal</h1>
			
			<div className="flex items-center gap-4 w-full sm:w-auto">
				{/* Create Incident Action Trigger Button */}
				<button
				type="button"
				onClick={() => {
					router.push('/admin/incidents/create'); 
				}}
				className="shrink-0 bg-white hover:bg-zinc-50 border border-[#E34A3B] text-[#2D2D2D] px-2 py-2 rounded-md text-sm font-medium shadow-sm transition-all flex items-center gap-2 tracking-wide"
				>
				<span className="text-lg font-bold text-[#E34A3B] leading-none mb-0.5">+</span > 
				<span>Create</span>
				</button>

				{/* Search Box Input Field Container */}
				<div className="relative w-full sm:w-80 md:w-96">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
				<input 
					type="text" 
					placeholder="Search" 
					className="w-full pl-12 pr-4 py-3 bg-white text-zinc-900 rounded-full border-none shadow-sm focus:ring-1 focus:ring-[#C05646] outline-none text-sm font-medium"
				/>
				</div>
			</div>
		</header>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-[16px] mb-8 font-playfair">{stat.label}</p>
              <p className="text-[40px] font-normal mb-4 tracking-tighter">{stat.value}</p>
              <div className="flex items-center gap-1">
                {stat.trend === 'up' && <TrendingUp size={14} className="text-green-600" />}
                <span className={`text-sm font-semibold ${
                  stat.trend === 'alert' ? 'text-red-500' : stat.trend === 'neutral' ? 'text-black' : 'text-green-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-8">
          
          {/* Recent Incidents Table Card */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-playfair font-bold">Recent incidents</h2>
              <Link 
					href="/admin/review" 
					className="flex items-center text-gray-400 hover:text-[#C05646] transition-colors text-sm font-medium group"
					>
                Review Queue <ChevronRight size={18} />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-[13px] border-b border-gray-50">
                    <th className="pb-4 font-medium">Title</th>
                    <th className="pb-4 font-medium">State</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Community</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentIncidents.map((incident) => (
                    <tr key={incident.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 pr-4 text-[13px] text-gray-500 max-w-[220px] truncate">
                        {incident.title}
                      </td>
                      <td className="py-4 text-[13px] text-gray-500">{incident.state}</td>
                      <td className="py-4 text-[13px] text-gray-500">{incident.date}</td>
                      <td className={`py-4 text-[12px] ${incident.color}`}>
                        {incident.community}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Source Health List Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-playfair font-bold mb-8">Source health</h2>
            <div className="space-y-1">
              {sourceHealth.map((source, idx) => (
                <div 
                  key={idx} 
                  className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                    idx % 2 === 0 ? 'bg-gray-50' : 'bg-transparent'
                  }`}
                >
                  <span className="text-[13px] font-medium text-gray-600">{source.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] text-gray-400">{source.time}</span>
                    <span className="text-xs font-bold text-orange-500">{source.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}