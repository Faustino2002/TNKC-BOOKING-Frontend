"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Added import
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import SidebarHeader from "@/components/sidebar/sidebarHeader";
import SidebarContent from "@/components/sidebar/sidebarContent";
import SidebarFooter from "@/components/sidebar/sidebarFooter";
import { NotificationBell } from "./notification-bell";

export default function HomeLayoutView({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname(); // Added to track current page

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    
    if (storedRole) {
      const role = storedRole.replace(/"/g, "").toLowerCase();
      
      if (role === "frontdesk") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, []);

  // Check if current path is exactly the admin dashboard
  const isDashboardPage = pathname === "/home/dashboard";

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="group w-20 hover:w-64 bg-[#082731] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out shadow-sm z-30 overflow-hidden shrink-0">
        <SidebarHeader />
        <SidebarContent />
        <SidebarFooter />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        
        {/* HEADER SECTION */}
        <div className="w-full px-4 md:px-8 pt-10 pb-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="text-5xl font-black text-[#1e3a5f] tracking-tighter">
                <Breadcrumbs />
              </div>
            </div>
            
            <div id="header-utility-slot" className="flex items-center">
              {/* UPDATED: Bell only shows if user is Frontdesk AND on the dashboard page */}
              {isAdmin && isDashboardPage && (
                <div className="scale-110 translate-y-1">
                  <NotificationBell />
                </div>
              )}
            </div> 
          </div>
        </div>

        {/* PAGE CONTENT SECTION */}
        <div className="w-full px-4 md:px-8 pb-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}