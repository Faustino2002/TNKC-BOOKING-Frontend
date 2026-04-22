"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Bell, Home, ChevronRight } from "lucide-react";
// Import your existing logic component
import Breadcrumbs from "@/components/navigation/Breadcrumbs"; 

interface UserReminderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserReminderDrawer({ isOpen, onClose }: UserReminderDrawerProps) {
  // Mock data for the reminders list
  const allReminders = [
    { id: 1, color: 'bg-red-500', label: 'High', title: 'Reservation Starting Soon', time: 'Starts in 2 hours' },
    { id: 2, color: 'bg-orange-400', label: 'High', title: 'Payment Verification', time: 'Due in 5 hours' },
    { id: 3, color: 'bg-green-500', label: 'Low', title: 'Check-out Instructions', time: 'Tomorrow' },
    { id: 4, color: 'bg-blue-400', label: 'Info', title: 'New Facility Hours', time: '2 days ago' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md border-l border-slate-100 flex flex-col">
        <SheetHeader className="space-y-4 shrink-0">
          
          {/* Custom Styled Breadcrumb using your existing Breadcrumbs.tsx */}
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            <Home size={12} />
            <ChevronRight size={12} />
            <div className="hover:text-[#3282B8] cursor-pointer transition-colors">
               <Breadcrumbs />
            </div>
            <ChevronRight size={12} />
            <span className="text-slate-900">Reminders</span>
          </div>
          
          <SheetTitle className="text-2xl font-bold text-slate-800">All Reminders</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4 overflow-y-auto flex-grow pr-2">
          {allReminders.map((r) => (
            <div 
              key={r.id} 
              className="flex items-start justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group cursor-default"
            >
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 group-hover:text-[#3282B8] transition-all">
                  {r.title}
                </p>
                <p className="text-xs text-slate-500">{r.time}</p>
              </div>
              <Badge className={`${r.color} text-white border-none text-[10px] flex items-center gap-1 px-3 py-1 rounded-full shrink-0`}>
                <Bell size={10} /> {r.label}
              </Badge>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}