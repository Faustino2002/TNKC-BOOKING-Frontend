"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; 
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Star, 
  CheckCircle2, 
  ExternalLink,
  Bell
} from "lucide-react";
// Import the drawer component you created
import { UserReminderDrawer } from "@/components/pages/user-reminder-drawer";

export default function UserDashboardClient() {
  const [userName, setUserName] = useState("John Doe");
  const [date, setDate] = useState<Date | undefined>(new Date());
  // Added state to control the reminders drawer
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("userFullName");
    if (name) setUserName(name);
  }, []);

  return (
    /* Main wrapper: Ensure w-full and min-h-screen to prevent layout collapse */
    <div className="w-full min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
        
        {/* LEFT COLUMN (8 Units) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Hero Welcome Banner */}
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover"
              alt="Hero Background"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-10 text-white">
              <h1 className="text-4xl font-bold mb-4">Good morning, {userName}</h1>
              <Button className="w-fit bg-[#3282B8] hover:bg-[#2c71a0] rounded-full px-6 flex gap-2">
                <PlusCircle size={18} />
                Add booking
              </Button>
            </div>
          </div>

          {/* 2. Current Reservation List */}
          <Card className="rounded-3xl border-none shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">Current Reservation</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <Star size={20} className="text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-800">Shared Training</p>
                      <p className="text-xs text-slate-400">March 01 - 03 | 2 nights</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#FEECEC] text-[#D32F2F] hover:bg-[#FEECEC] border-none px-3 py-1">Pending</Badge>
                    <Button size="sm" className="bg-[#3282B8] hover:bg-[#1e3a5f]">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 3. Recent Activity Feed */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
            <div className="bg-[#3282B8] p-4 flex justify-between items-center text-white font-semibold">
              <span>Recent Activity</span>
              <ExternalLink size={18} className="cursor-pointer" />
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 size={24} className="text-green-500 bg-green-50 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Created new booking</p>
                      <p className="text-[11px] text-slate-400">Assigned to A-05 - Single Cabin</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 italic">2 hours ago</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (4 Units) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* 4. Mini Calendar */}
          <Card className="rounded-3xl border-none shadow-sm p-4 flex flex-col items-center justify-center shrink-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-0 flex justify-center"
              classNames={{
                months: "w-full",
                month: "w-full space-y-4",
                caption: "flex justify-center pt-1 relative items-center mb-4",
                caption_label: "text-sm font-bold text-slate-900",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                table: "w-full border-collapse",
                head_row: "grid grid-cols-7 w-full mb-2", 
                head_cell: "text-slate-400 font-normal text-[0.7rem] text-center",
                tbody: "grid grid-cols-1 w-full",
                row: "grid grid-cols-7 w-full mt-2", 
                cell: "flex items-center justify-center p-0 relative focus-within:z-20",
                day: "h-8 w-8 p-0 font-normal hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all",
                day_selected: "bg-[#3282B8] text-white hover:bg-[#3282B8] hover:text-white focus:bg-[#3282B8] focus:text-white rounded-lg font-bold",
                day_today: "bg-slate-100 text-slate-900",
                day_outside: "text-slate-300 opacity-50",
                day_disabled: "text-slate-300 opacity-50",
                day_hidden: "invisible",
              }}
            />
          </Card>

          {/* 5. Reminders Section */}
          <Card className="rounded-3xl border-none shadow-sm overflow-hidden flex flex-col flex-grow">
            <div className="bg-white p-4 flex justify-between items-center border-b border-slate-50 shrink-0">
              <h2 className="font-bold text-slate-800">Reminders</h2>
              {/* Added onClick to trigger the drawer */}
              <span 
                onClick={() => setIsReminderOpen(true)}
                className="text-[#3282B8] text-xs font-bold cursor-pointer hover:underline"
              >
                See all
              </span>
            </div>
            
            <div className="p-4 space-y-4 flex-grow">
              {[
                { color: 'bg-red-500', label: 'High' },
                { color: 'bg-orange-400', label: 'High' },
                { color: 'bg-green-500', label: 'Low' },
                { color: 'bg-blue-400', label: 'Info' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Reservation Starting Soon</p>
                    <p className="text-[11px] text-slate-400">Starts in 2 hours</p>
                  </div>
                  <Badge className={`${r.color} text-white border-none text-[10px] flex items-center gap-1 px-3 py-1 rounded-full`}>
                    <Bell size={10} /> {r.label}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* RENDER DRAWER OUTSIDE GRID FLOW */}
      <UserReminderDrawer 
        isOpen={isReminderOpen} 
        onClose={() => setIsReminderOpen(false)} 
      />
    </div>
  );
}