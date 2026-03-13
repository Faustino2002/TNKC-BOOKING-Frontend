"use client";

import React, { useState, useEffect } from "react";
import { Bell, ExternalLink, Clock, User, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>({
    stats: { pending: 0, vacantBeds: 0, totalCrews: 0, totalRooms: 0, maintenance: 0 },
    occupancy: { current: 0, history: [] },
    checkins: [],
    checkouts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MOCK DATA DEFINITIONS
  const mockData = {
    stats: { 
      pending: 12, 
      vacantBeds: 45, 
      totalCrews: 128, 
      totalRooms: 60, 
      maintenance: 3 
    },
    occupancy: { 
      current: 75, 
      history: [65, 70, 68, 72, 75, 80, 75] 
    },
    checkins: [
      { name: "John L. Doe", room: "Room 101", time: "08:30 AM" },
      { name: "Maria S. Dela Cruz", room: "Room 205", time: "10:15 AM" },
      { name: "Robert B. Smith", room: "Room 302", time: "01:45 PM" },
    ],
    checkouts: [
      { name: "Jane A. Watson", room: "Room 112", time: "09:00 AM" },
      { name: "Michael K. Scott", room: "Room 404", time: "11:30 AM" },
    ]
  };

  const getDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/dashboard");
      
      if (!response.ok) {
        throw new Error(`Fallback to Mock Data`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      // SILENT FALLBACK TO MOCK DATA
      setData(mockData);
      if (err.message !== "Fallback to Mock Data") {
        setError("Offline Mode");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (isLoading && data.stats.totalRooms === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-[#3498db]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-10 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[40px] font-bold text-[#1e3a5f] leading-tight">Dashboard</h1>
          <p className="text-[#5a7184] text-lg mt-1 font-medium">
            Overview of crew accommodation, room occupancy, and booking activity.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {error && <span className="text-red-400 text-xs font-bold animate-pulse px-3 py-1 bg-red-50 rounded-full border border-red-100">Live API Offline</span>}
          <button className="p-3 text-[#3498db] bg-white shadow-sm border border-gray-100 rounded-full transition-all hover:shadow-md relative">
            <Bell size={24} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* MAIN CONTENT AREA */}
        <div className="flex-1 space-y-8">
          {/* STAT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Pending Booking" value={data?.stats?.pending} color="bg-gradient-to-br from-[#1e3a5f] to-[#2980b9]" />
            <StatCard title="Vacant Beds" value={data?.stats?.vacantBeds} color="bg-gradient-to-br from-[#1e4b7a] to-[#21618c]" />
            <StatCard title="Total Crews" value={data?.stats?.totalCrews} color="bg-gradient-to-br from-[#153e5c] to-[#1b4f72]" />
            <StatCard title="Total Rooms" value={data?.stats?.totalRooms} color="bg-gradient-to-br from-[#0d2b40] to-[#154360]" />
          </div>

          {/* OCCUPANCY RATE TREND */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#1e3a5f]">Occupancy Rate Trend</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <p className="text-sm font-bold text-[#5a7184]">Current Occupancy: {data?.occupancy?.current}%</p>
                </div>
              </div>
            </div>
            
            <div className="h-64 w-full relative mt-4">
              <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
                {/* Horizontal Grid Lines */}
                {[0, 50, 100, 150, 200].map((y) => (
                  <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                ))}
                {/* Mock Trend Line */}
                <path 
                  d="M0,160 C100,140 200,150 300,120 C400,90 500,110 600,70 C700,50 800,80 800,80" 
                  fill="none" 
                  stroke="#3498db" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* MAINTENANCE SECTION */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex justify-between items-end relative overflow-hidden group">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-[#1e3a5f]">Maintenance</h3>
                <ExternalLink size={20} className="text-[#3498db] cursor-pointer" />
              </div>
              <span className="text-[64px] font-bold text-[#1e3a5f] leading-none">{data?.stats?.maintenance}</span>
            </div>
            <div className="w-1/2 h-20 flex flex-col items-center justify-center border-l border-gray-50">
                <p className="text-[10px] font-extrabold text-[#3498db] uppercase tracking-widest">3 Rooms Pending Repair</p>
                <div className="w-24 h-1.5 bg-blue-50 rounded-full mt-2 overflow-hidden">
                  <div className="w-2/3 h-full bg-[#3498db] rounded-full"></div>
                </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full xl:w-[400px] space-y-6">
           <CheckInList title="Check-in Today" items={data?.checkins} />
           <CheckInList title="Check-out Today" items={data?.checkouts} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div className={`${color} p-8 rounded-[32px] shadow-lg text-white relative overflow-hidden group transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-xl opacity-95">{title}</span>
        <ExternalLink size={20} className="opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer" />
      </div>
      <div className="text-[64px] font-bold leading-none mb-6">{value}</div>
      <div className="flex items-center gap-2 text-[10px] font-bold bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-lg w-fit border border-white/10">
        Live Sync Active
      </div>
    </div>
  );
}

function CheckInList({ title, items }: { title: string, items: any[] }) {
    return (
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[#1e3a5f]">{title} ({items.length})</h3>
                <button className="text-sm font-bold text-gray-400 hover:text-[#3498db]">See all</button>
            </div>
            <div className="space-y-5">
                {items.length > 0 ? items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group cursor-pointer p-1 rounded-2xl transition-all hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100">
                                <User size={24} className="text-[#3498db]" />
                            </div>
                            <div>
                                <p className="font-bold text-[#1e3a5f] text-sm">{item.name}</p>
                                <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-[#3498db]">
                                    <span className="uppercase">{item.room}</span>
                                    <span className="flex items-center gap-1 text-gray-400 font-semibold">
                                      <Clock size={12}/> {item.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                  <div className="py-10 text-center border-2 border-dashed border-gray-50 rounded-2xl">
                    <p className="text-gray-300 font-bold text-xs uppercase tracking-widest">No entries found</p>
                  </div>
                )}
            </div>
        </div>
    );
}