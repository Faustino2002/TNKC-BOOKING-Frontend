"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- TYPES ---
type BookingType = "approved" | "requested" | "maintenance";

interface Booking {
  id: string;
  name: string;
  date: number;   
  start: number; 
  end: number;   
  type: BookingType;
  isCheckIn?: boolean;
  isCheckOut?: boolean;
}

interface RoomData {
  room: string;
  type: string;
  bookings: Booking[];
}

// --- UTILS ---
const getBookingStyles = (type: BookingType) => {
  switch (type) {
    case "approved": return "bg-[#1e3a8a] text-white border-none";
    case "requested": return "bg-[#fee2e2] text-slate-700 border border-red-200";
    case "maintenance": return "bg-[#f39c12] text-white border-none";
    default: return "bg-slate-200 text-slate-700";
  }
};

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  return `${hour}${i < 12 ? "AM" : "PM"}`;
});

export default function FrontdeskDashboardClient() {
  const [view, setView] = useState<"Day" | "Week" | "Month">("Day");
  const [isLoading, setIsLoading] = useState(true);

  // Synchronized Date Reference
  const today = useMemo(() => new Date(), []);
  const currentDay = today.getDate();
  const currentMonthYear = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Dynamically generated data to match the calendar "Today"
  const dashboardData: Record<string, RoomData[]> = useMemo(() => ({
    "TNKC Floor 2": [
      { 
        room: "202", 
        type: "Single", 
        bookings: [
          { id: "1", name: "John Doe (In)", date: currentDay, start: 2, end: 10, type: "approved", isCheckIn: true },
          { id: "4", name: "Alice Blue (Out)", date: currentDay, start: 16, end: 22, type: "approved", isCheckOut: true }
        ] 
      },
      { 
        room: "203", 
        type: "Single", 
        bookings: [
          { id: "2", name: "Jane Smith (Req)", date: currentDay, start: 10, end: 15, type: "requested" }
        ] 
      },
    ],
    "TNKC Floor 3": [
      { 
        room: "303", 
        type: "Single", 
        bookings: [
          { id: "3", name: "Maintenance", date: currentDay, start: 8, end: 14, type: "maintenance" }
        ] 
      },
    ]
  }), [currentDay]);

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return {
        day: day.toLocaleDateString("en-US", { weekday: "long" }),
        date: day.getDate(),
      };
    });
  }, [today]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-[#1e3a8a]">Dashboard</h1>
        <Bell size={24} className="text-blue-400 cursor-pointer" />
      </div>

      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-slate-50"><ChevronLeft size={16} /></button>
            <span className="text-sm font-medium">Today</span>
            <button className="p-1 hover:bg-slate-50"><ChevronRight size={16} /></button>
          </div>
          <span className="font-bold text-lg">{currentMonthYear}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg mr-2">
            {(["Day", "Week", "Month"] as const).map((v) => (
              <button 
                key={v} 
                onClick={() => setView(v)} 
                className={`px-4 py-1 text-xs font-semibold rounded-md transition-all ${view === v ? "bg-white shadow-sm text-[#1e3a8a]" : "text-slate-500"}`}
              >
                {v}
              </button>
            ))}
          </div>
          <Button className="bg-[#3498db] text-white text-xs px-4 py-1.5 rounded-lg flex gap-2">
            Add booking <Plus size={14} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {view === "Month" ? (
            <MonthGridView data={dashboardData} currentDayRef={currentDay} />
          ) : (
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="bg-[#2c3e50] text-white">
                  <th className="w-16 p-2 text-[10px] font-bold border-r border-slate-600 text-left">Room #</th>
                  <th className="w-16 p-2 text-[10px] font-bold border-r border-slate-600 text-left">Type</th>
                  <th className="p-0">
                    <div className={`grid ${view === "Day" ? "grid-cols-24" : "grid-cols-7"}`}>
                      {view === "Day" ? HOURS.map((h, i) => (
                        <div key={i} className="text-[9px] py-2 border-r border-slate-600 text-center opacity-70">{h}</div>
                      )) : weekDays.map((wd, i) => (
                        <div key={i} className="py-2 border-r border-slate-600 text-center">
                          <span className="text-[9px] block opacity-60 uppercase">{wd.day.slice(0,3)}</span>
                          <span className="text-[10px] font-bold">{wd.date}</span>
                        </div>
                      ))}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dashboardData).map(([floor, rooms]) => (
                  <React.Fragment key={floor}>
                    <tr className="bg-[#475569] text-white">
                      <td colSpan={3} className="px-3 py-1.5 font-bold text-[11px] uppercase tracking-wider">{floor}</td>
                    </tr>
                    {rooms.map((room) => (
                      <TimelineRow 
                        key={room.room} 
                        {...room} 
                        view={view} 
                        weekDays={weekDays} 
                        currentDayRef={currentDay}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-6 px-2">
        <span className="text-xs font-bold text-slate-400">Legend:</span>
        <LegendItem color="bg-[#1e3a8a]" label="Approved Bookings" />
        <LegendItem color="bg-[#fee2e2]" label="Requested Bookings" border="border border-red-200" />
        <LegendItem color="bg-[#f39c12]" label="Maintenance" />
        <LegendItem color="bg-emerald-500" label="Check-in indicator" isCircle />
        <LegendItem color="bg-red-500" label="Check-out indicator" isCircle />
      </div>
    </div>
  );
}

function TimelineRow({ room, type, bookings, view, weekDays, currentDayRef }: any) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors h-12">
      <td className="p-2 border-r text-center font-bold text-[10px] text-slate-700">{room}</td>
      <td className="p-2 border-r text-center text-slate-500 text-[10px]">{type}</td>
      <td className="p-0 relative">
        <div className={`grid h-full ${view === "Day" ? "grid-cols-24" : "grid-cols-7"}`}>
          {Array.from({ length: view === "Day" ? 24 : 7 }).map((_, i) => (
            <div key={i} className="border-r border-slate-50 h-full" />
          ))}
          
          {bookings.map((b: any) => {
            if (view === "Day" && b.date === currentDayRef) {
              return (
                <div
                  key={b.id}
                  style={{ gridColumn: `${b.start + 1} / span ${b.end - b.start}` }}
                  className={`mx-1 self-center h-8 rounded relative flex items-center px-2 text-[9px] font-bold shadow-sm z-10 ${getBookingStyles(b.type)}`}
                >
                  {b.isCheckIn && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l" />}
                  {b.isCheckOut && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-r" />}
                  <span className="truncate">{b.name}</span>
                </div>
              );
            }
            if (view === "Week") {
              const weekColumn = weekDays.findIndex((wd: any) => wd.date === b.date);
              if (weekColumn === -1) return null;
              return (
                <div
                  key={b.id}
                  style={{ gridColumn: `${weekColumn + 1} / span 1` }}
                  className={`mx-1 self-center h-8 rounded flex items-center px-2 text-[8px] font-bold truncate z-10 ${getBookingStyles(b.type)}`}
                >
                  {b.name}
                </div>
              );
            }
            return null;
          })}
        </div>
      </td>
    </tr>
  );
}

function MonthGridView({ data, currentDayRef }: { data: Record<string, RoomData[]>, currentDayRef: number }) {
  const allBookings = Object.values(data).flat().flatMap(room => room.bookings);
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  return (
    <div className="bg-white overflow-hidden">
      <div className="grid grid-cols-7 bg-[#2c3e50] text-white">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="p-2 text-center font-bold text-[10px] border-r border-slate-600">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-[120px]">
        {Array.from({ length: 35 }, (_, i) => {
          const dayNumber = i - firstDayOfMonth + 1; 
          const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
          const dayBookings = isValidDay ? allBookings.filter(b => b.date === dayNumber) : [];
          
          return (
            <div key={i} className={`border-r border-b p-1 flex flex-col ${!isValidDay ? "bg-slate-50" : "bg-white"}`}>
              {isValidDay && (
                <span className={`text-[10px] font-bold p-1 mb-1 ${dayNumber === currentDayRef ? "bg-[#1e3a8a] text-white w-5 h-5 flex items-center justify-center rounded-full" : "text-slate-400"}`}>
                  {dayNumber}
                </span>
              )}
              <div className="flex flex-col gap-1 overflow-y-auto">
                {dayBookings.map(b => (
                  <div key={b.id} className={`p-1 rounded text-[8px] font-bold truncate ${getBookingStyles(b.type)}`}>
                    {b.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LegendItem({ color, label, border = "", isCircle = false }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${isCircle ? "w-3 h-3 rounded-full" : "w-5 h-2.5 rounded-sm"} ${color} ${border}`}></div>
      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
    </div>
  );
}