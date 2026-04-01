"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Relative path to find the routes folder at the project root
import { homeRoutes } from "../../routes/homeRoutes"; 

// Reusable sidebar components (Task 3)
import NavItem from "@/components/sidebar/NavItem";
import DropdownNavItem from "@/components/sidebar/DropdownNavItem";

// Dynamic Breadcrumb Component (Task 5)
import Breadcrumbs from "@/components/navigation/Breadcrumbs";

// Define strict types for TypeScript (Task 4)
interface RouteItem {
  label: string;
  href?: string;
  icon: any;
  children?: { label: string; href: string }[];
}

interface RouteSection {
  section: string;
  items: RouteItem[];
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* SIDEBAR - pure UI renderer (Task 2) */}
      <aside className="group w-20 hover:w-64 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out shadow-sm z-30 overflow-hidden">
        
        {/* LOGO SECTION */}
        <div className="flex items-center px-5 py-8 h-24 shrink-0">
          <div className="relative h-10 w-10 shrink-0">
            <Image src="/logoonly.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="ml-4 text-[#3282B8] font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            TNKC HOUSE
          </span>
        </div>

        {/* NAVIGATION - Dynamic loop through homeRoutes (Task 1 & 2) */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
          {homeRoutes.map((section: RouteSection) => (
            <div key={section.section}>
              
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
                <span className="group-hover:hidden block text-center">...</span>
                <span className="hidden group-hover:block">{section.section}</span>
              </p>

              <div className="space-y-2">
                {section.items.map((item: RouteItem) => (
                  item.children ? (
                    // DropdownNavItem handles its own expandable logic (Task 3)
                    <DropdownNavItem key={item.label} item={item} />
                  ) : (
                    // NavItem for single navigation links (Task 3)
                    <NavItem
                      key={item.href}
                      href={item.href!}
                      icon={<item.icon size={22} />}
                      label={item.label}
                      // Active route detection (Task 4)
                      isActive={pathname === item.href || pathname.startsWith(item.href!)}
                    />
                  )
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* USER PROFILE FOOTER */}
        <div className="mt-auto p-4 border-t border-gray-50 flex items-center shrink-0">
          <div className="h-10 w-10 rounded-full bg-[#3498db] flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
            KM
          </div>
          <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <p className="text-sm font-bold text-black">Klare Marasigan</p>
            <p className="text-[11px] text-gray-400">Frontdesk</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Dynamic Breadcrumbs matching current route (Task 5) */}
        <Breadcrumbs />
        
        <div className="mt-4">
          {children}
        </div>
      </main>
    </div>
  );
}