"use client";

import React from "react";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import SidebarHeader from "@/components/sidebar/sidebarHeader";
import SidebarContent from "@/components/sidebar/sidebarContent";
import SidebarFooter from "@/components/sidebar/sidebarFooter";

export default function HomeLayoutView({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="group w-20 hover:w-64 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out shadow-sm z-30 overflow-hidden shrink-0">
        <SidebarHeader />
        <SidebarContent />
        <SidebarFooter />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        
        {/* HEADER SECTION - FULL WIDTH STRETCH */}
        {/* Reduced padding to px-2/px-4 to match the tight spacing of the Guestlist dashboard */}
        <div className="w-full px-2 md:px-4 pt-10 pb-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="text-5xl font-black text-[#1e3a5f] tracking-tighter">
                <Breadcrumbs />
              </div>
            </div>
            <div id="header-utility-slot" className="flex items-center"></div> 
          </div>
        </div>

        {/* PAGE CONTENT SECTION - FULL WIDTH STRETCH */}
        {/* Removed all max-width constraints and minimized horizontal padding */}
        <div className="w-full px-2 md:px-4 pb-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}