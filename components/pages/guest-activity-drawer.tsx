"use client";

import React from "react";
import { Search } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetPortal 
} from "@/components/ui/sheet";
import { GuestGroup } from "./guest-activity";

interface Guest {
  name: string;
  room: string;
  time: string;
  vessel: string;
}

interface DrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  checkins: Guest[];
  checkouts: Guest[];
}

export function GuestActivityDrawer({ isOpen, onClose, checkins, checkouts }: DrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetPortal>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-[500px] bg-white border-none rounded-l-[40px] p-0 shadow-2xl"
        >
          <div className="h-full flex flex-col p-10">
            <SheetHeader className="mb-10">
              <SheetTitle className="text-[32px] font-bold text-[#1e3a5f]">Guest Activity</SheetTitle>
              <SheetDescription className="sr-only">Detailed guest logs for today.</SheetDescription>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto space-y-8 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search guests, rooms, vessels..." 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all" 
                />
              </div>
              
              <GuestGroup title="Check-in Today" list={checkins} limit={50} />
              <GuestGroup title="Check-out Today" list={checkouts} limit={50} />
            </div>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}