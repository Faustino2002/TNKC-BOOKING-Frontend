"use client";

import React, { useState } from "react";
import { User, Clock, Ship, ChevronRight } from "lucide-react";
import { GuestActivityDrawer } from "./guest-activity-drawer";

interface Guest {
  name: string;
  room: string;
  time: string;
  vessel: string;
}

interface GuestActivityProps {
  checkins: Guest[];
  checkouts: Guest[];
}

export default function GuestActivity({ checkins, checkouts }: GuestActivityProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="xl:col-span-4 bg-white rounded-[32px] p-8 shadow-sm border border-blue-50/50 flex flex-col self-stretch h-full min-h-[600px]">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h3 className="text-xl font-bold text-[#2c4e7a]">Guest Arrival & Departure</h3>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="text-[13px] font-bold text-[#3498db] hover:underline cursor-pointer transition-all active:scale-95"
        >
          See all
        </button>
      </div>

      <div className="space-y-8 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {/* Dashboard View: Strictly limited to 3 items each */}
        <GuestGroup title="Check-in Today" list={checkins} limit={3} />
        <GuestGroup title="Check-out Today" list={checkouts} limit={3} />
      </div>

      {/* The Separate Drawer Component */}
      <GuestActivityDrawer 
        isOpen={isDrawerOpen} 
        onClose={setIsDrawerOpen} 
        checkins={checkins} 
        checkouts={checkouts} 
      />
    </div>
  );
}

// We export this so the Drawer can use the exact same styling for its lists
export const GuestGroup = ({ title, list, limit }: { title: string; list: Guest[]; limit: number }) => {
  const displayList = list.slice(0, limit);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h4 className="text-[14px] font-bold text-[#5a7184]">{title} ({list.length})</h4>
      </div>
      <div className="border border-blue-50 rounded-[24px] overflow-hidden bg-white shadow-sm">
        {displayList.length > 0 ? (
          displayList.map((item, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-between py-4 px-5 hover:bg-slate-50 group cursor-pointer transition-all ${
                i !== displayList.length - 1 ? 'border-b border-blue-50/50' : ''
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center border border-slate-50 shrink-0 group-hover:scale-110 transition-transform">
                  <User size={22} className="text-slate-400 translate-y-1" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#1e3a5f] text-[14px] leading-tight mb-1 truncate">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold">
                    <span className="text-[#3498db]">{item.room}</span>
                    <span className="flex items-center gap-1 text-slate-400 font-semibold italic">
                      <Clock size={12} className="text-slate-300" /> {item.time}
                    </span>
                    <span className="flex items-center gap-1 text-[#3498db] font-semibold truncate max-w-[120px]">
                      <Ship size={12} className="opacity-70 shrink-0" /> {item.vessel}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-[12px] text-slate-400 italic font-medium">
            No activity for today
          </div>
        )}
      </div>
    </div>
  );
};