"use client";

import React, { useState } from "react";
import { Bell, ExternalLink } from "lucide-react"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationDrawer } from "./notification-drawer"; 

export function NotificationBell() { 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsPopoverOpen(false); 
    // Wait for the Popover's focus-trap to release before mounting the Sheet
    setTimeout(() => {
      setIsDrawerOpen(true); 
    }, 150); 
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={false}>
        <PopoverTrigger asChild>
          <button className="p-3 text-[#3498db] bg-white shadow-sm border border-gray-100 rounded-full relative z-40 cursor-pointer">
            <Bell size={24} />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[400px] p-6 rounded-[24px] shadow-2xl z-[50]" align="end">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-[#1e3a5f]">Notification</h3>
            <button onClick={handleOpenDrawer} className="cursor-pointer">
              <ExternalLink size={20} className="text-[#3498db]" />
            </button>
          </div>
          <button onClick={handleOpenDrawer} className="w-full mt-4 py-3 bg-slate-50 rounded-xl text-[#3498db] font-bold">
            See all notifications
          </button>
        </PopoverContent>
      </Popover>

      {/* THE KEY FIX: Unique key forces a fresh re-render to avoid overlay conflicts */}
      <NotificationDrawer 
        key={isDrawerOpen ? "active-notifications" : "inactive"}
        isOpen={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
        notifications={[{ id: 1, user: "System", action: "Checking notifications...", time: "Just now" }]} 
      />
    </>
  );
}