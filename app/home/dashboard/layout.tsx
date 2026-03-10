"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, CalendarCheck, BookOpen, 
  Settings, LifeBuoy, ChevronDown, ChevronUp
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* SHARED SIDEBAR */}
      <aside className="group w-20 hover:w-64 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out shadow-sm z-30 overflow-hidden">
        <div className="flex items-center px-5 py-8 h-24 shrink-0">
          <div className="relative h-10 w-10 shrink-0">
            <Image src="/logoonly.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="ml-4 text-[#3282B8] font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            TNKC HOUSE
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
            <span className="group-hover:hidden block text-center">...</span>
            <span className="hidden group-hover:block">Menu</span>
          </p>
          
          <NavItem href="/home/dashboard" icon={<LayoutDashboard size={22} />} label="Dashboard" isActive={pathname === "/home/dashboard"} />
          
          <NavItem 
            href="/home/dashboard/guestlist" 
            icon={<Users size={22} />} 
            label="Guest List" 
            isActive={pathname === "/home/dashboard/guestlist"} 
          />
          
          <NavItem href="/home/dashboard/pending" icon={<CalendarCheck size={22} />} label="Pending Booking" isActive={pathname === "/home/dashboard/pending"} />

          {/* DROPDOWN: Floor Catalog */}
          <div className="relative">
            <button 
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className={`w-full flex items-center rounded-lg cursor-pointer transition-all duration-200 h-12 px-3 
                ${isCatalogOpen ? "text-[#3282B8] bg-[#E7F0FF]" : "text-gray-400 hover:bg-[#E7F0FF] hover:text-[#3282B8]"}`}
            >
              <div className="shrink-0 w-6 flex justify-center"><BookOpen size={22} /></div>
              <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap flex-1 text-left">
                Floor Catalog
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isCatalogOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out hidden group-hover:block ${
              isCatalogOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
            }`}>
              <SubNavItem href="/home/dashboard/catalog/rooms" label="Room Catalog" isActive={pathname === "/home/dashboard/catalog/rooms"} />
              <SubNavItem href="/home/dashboard/catalog/floor1" label="1st Floor" isActive={pathname === "/home/dashboard/catalog/floor1"} />
              <SubNavItem href="/home/dashboard/catalog/floor2" label="2nd Floor" isActive={pathname === "/home/dashboard/catalog/floor2"} />
            </div>
          </div>

          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 mt-8 px-2">
            <span className="group-hover:hidden block text-center">...</span>
            <span className="hidden group-hover:block">General</span>
          </p>
          
          <NavItem href="/home/dashboard/settings" icon={<Settings size={22} />} label="Settings" isActive={pathname === "/home/dashboard/settings"} />
          <NavItem href="/home/dashboard/support" icon={<LifeBuoy size={22} />} label="Support" isActive={pathname === "/home/dashboard/support"} />
        </nav>

        {/* Profile Section */}
        <div className="mt-auto p-4 border-t border-gray-50 flex items-center shrink-0">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">MG</div>
          <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <p className="text-sm font-bold text-black">Mellissa Grey</p>
            <p className="text-[11px] text-gray-400">Frontdesk</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

// --- MISSING COMPONENTS ADDED BELOW ---

function NavItem({ icon, label, isActive, href }: { icon: React.ReactNode, label: string, isActive: boolean, href: string }) {
  return (
    <Link href={href}>
      <div className={`flex items-center rounded-lg cursor-pointer transition-all duration-200 h-12 px-3 
        ${isActive ? "bg-[#3498db] text-white" : "text-gray-400 hover:bg-[#E7F0FF] hover:text-[#3282B8]"}`}>
        <div className="shrink-0 w-6 flex justify-center">{icon}</div>
        <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
          {label}
        </span>
      </div>
    </Link>
  );
}

function SubNavItem({ href, label, isActive }: { href: string, label: string, isActive: boolean }) {
  return (
    <Link href={href}>
      <div className={`pl-14 py-2 text-sm font-medium transition-colors hover:text-[#3282B8] ${
        isActive ? "text-[#3282B8]" : "text-gray-400"
      }`}>
        {label}
      </div>
    </Link>
  );
}