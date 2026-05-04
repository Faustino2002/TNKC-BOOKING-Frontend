"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. DATA CONTRACT
interface Reminder {
  id: string | number;
  priority: "high" | "medium" | "low" | "info";
  title: string;
  message: string;
}

interface UserReminderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserReminderDrawer({ isOpen, onClose }: UserReminderDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // 2. BACKEND HOOK
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReminders([
          { id: 1, priority: "high", title: "Reservation Starting Soon", message: "Starts in 2 hours" },
          { id: 2, priority: "medium", title: "Your stay will end soon", message: "Checkout in 4 hours" },
          { id: 3, priority: "low", title: "Reservation Starting Soon", message: "Starts in 2 days" },
          { id: 4, priority: "high", title: "Your stay will end soon", message: "Starts in 1 hour" },
          { id: 5, priority: "high", title: "Reservation Starting Soon", message: "Starts in 30 minutes" },
          { id: 6, priority: "info", title: "Reservation Starting Soon", message: "Starts in 5 hours" },
        ]);
        setIsLoading(false);
      }, 800);
    }
  }, [isOpen]);

  // 3. UI HELPER
  const getPriorityStyles = (priority: Reminder["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-50 text-red-600 border-red-100";
      case "medium": return "bg-orange-50 text-orange-600 border-orange-100";
      case "low": return "bg-green-50 text-green-600 border-green-100";
      case "info": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md border-l border-slate-100 flex flex-col bg-white">
        <SheetHeader className="shrink-0 pt-4">
          <SheetTitle className="text-4xl font-black text-[#1e3a5f] tracking-tight">
            Reminder
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4 overflow-y-auto flex-grow pr-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-2" size={24} />
              <p className="text-sm font-medium">Syncing notifications...</p>
            </div>
          ) : reminders.length > 0 ? (
            reminders.map((r) => (
              <div 
                key={r.id} 
                className="group flex flex-col gap-3 p-5 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-default"
              >
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full border w-fit text-[10px] font-bold uppercase tracking-wider",
                  getPriorityStyles(r.priority)
                )}>
                  <Bell size={10} fill="currentColor" className="opacity-80" />
                  {r.priority}
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Bell size={18} className="text-slate-400" />
                   </div>
                   <div className="space-y-0.5">
                    <p className="text-[15px] font-bold text-slate-900 leading-tight">
                      {r.title}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {r.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400 italic text-sm">No new reminders</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}