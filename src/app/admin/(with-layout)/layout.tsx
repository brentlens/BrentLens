/* eslint-disable @next/next/no-img-element */
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Review Queue / pending drafts', href: '/admin/review' },
    { name: 'All incidents', href: '/admin/incidents' },
    // { name: 'Pipeline monitor', href: '/admin/pipeline' },
    { name: 'Source heath', href: '/admin/health' },
    { name: 'Audit log', href: '/admin/audit' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F4F4]">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-8 mb-4">
          <Link href="/admin">
            <img src="/assets/admin/adminLogo.png" alt="TruthPin" className="w-36" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            // Logic to handle exact match or sub-routes
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-sm ${
                  isActive 
                    ? 'bg-[#F2E8E6] text-[#C05646] border-l-[4px] border-[#C05646]' 
                    : 'text-gray-600 hover:bg-gray-50 border-l-[4px] border-transparent'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-52">
        {/* We keep the children as the dynamic part */}
        <div className="p-0"> 
          {children}
        </div>
      </main>
    </div>
  );
}