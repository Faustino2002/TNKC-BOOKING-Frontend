"use client";

import React, { useState, useEffect } from "react";
import { Clock, User, Loader2, Bed, CalendarDays, Users, DoorOpen, Ship, RotateCcw, Filter } from "lucide-react";
// Import your new component
import GuestActivity from "@/components/pages/guest-activity";

const mockData = {
  stats: { pending: 12, vacantBeds: 12, totalCrews: 80, totalRooms: 80, maintenance: 12 },
  occupancy: { 
    current: 68, 
    history: [42, 55, 48, 40, 52, 60, 45, 50, 48, 55, 58] 
  },
  checkins: [
    { name: "Pedro Santos", room: "Room A-10", time: "12:30 PM", vessel: "MV Pacific Star" },
    { name: "Kaila Madrigal", room: "Room A-15", time: "12:30 PM", vessel: "Maria Nuevaca" },
    { name: "Nevera Gascon", room: "Room B-12", time: "11:45 PM", vessel: "Maria Nuevaca" },
  ],
  checkouts: [
    { name: "Christian Aguilar", room: "Room A-10", time: "12:30 PM", vessel: "MV Pacific Star" },
    { name: "Jose Della Cruz", room: "Room A-15", time: "12:30 PM", vessel: "Maria Nuevaca" },
    { name: "Mark Reyes", room: "Room A-15", time: "12:30 PM", vessel: "Maria Nuevaca" },
    { name: "Pablo Alegre", room: "Room A-15", time: "12:30 PM", vessel: "Maria Nuevaca" },
  ]
};

export default function DashboardClient() {
  const [data, setData] = useState<any>({
    stats: { pending: 0, vacantBeds: 0, totalCrews: 0, totalRooms: 0, maintenance: 0 },
    occupancy: { current: 0, history: [] }, checkins: [], checkouts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(5);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/dashboard");
        setData(res.ok ? await res.json() : mockData);
      } catch { setData(mockData); }
      finally { setIsLoading(false); }
    })();
  }, []);

  if (isLoading && data.stats.totalRooms === 0) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-[#3498db]" size={40} />
    </div>
  );

  // Chart Logic Constants
  const chartWidth = 1000;
  const chartHeight = 250;
  const dataPointsY = [150, 120, 160, 180, 140, 120, 180, 160, 100]; 
  const stepX = chartWidth / (dataPointsY.length - 1);

  const getDynamicTooltipData = (index: number) => {
    const rate = data.occupancy.history[index] || 0;
    const total = data.stats.totalRooms || 80;
    const occupied = Math.round((rate / 100) * total);
    const maintenance = Math.floor(data.stats.maintenance / 2);
    const vacant = total - occupied - maintenance;
    return { rate, occupied, maintenance, vacant };
  };

  const tooltipData = activeIndex !== null ? getDynamicTooltipData(activeIndex) : null;

  return (
    <div className="w-full animate-in fade-in duration-500 pb-10">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 w-full">
        <StatCard title="Vacant Beds" value={data.stats.vacantBeds} icon={<Bed size={22} />} />
        <StatCard title="Pending Booking" value={data.stats.pending} icon={<CalendarDays size={22} />} />
        <StatCard title="Total Crews" value={data.stats.totalCrews} icon={<Users size={22} />} />
        <StatCard title="Total Rooms" value={data.stats.totalRooms} icon={<DoorOpen size={22} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full items-stretch">
        {/* Left Column: Chart & Maintenance */}
        <div className="xl:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
               <div>
                  <h3 className="text-xl font-bold text-[#1e3a5f]">Occupancy Rate Trend</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#3498db]" />
                    <span className="text-[12px] text-[#5a7184] font-medium">Current Occupancy: {data.occupancy.current}%</span>
                  </div>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[12px] font-bold text-[#5a7184] hover:bg-slate-50 transition-colors">
                 <Filter size={14} /> Filter
               </button>
             </div>

             <div className="relative h-[300px] w-full mt-10">
               <div className="absolute left-0 h-full flex flex-col justify-between text-[10px] font-bold text-slate-300 pb-10">
                 <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
               </div>

               {activeIndex !== null && tooltipData && (
                  <div 
                    className="absolute z-20 bg-white border border-slate-100 shadow-2xl rounded-xl p-3 w-40 transition-all duration-300 ease-out pointer-events-none"
                    style={{ 
                      left: `${(activeIndex * (100 / (dataPointsY.length - 1)))}%`, 
                      top: `${(dataPointsY[activeIndex] / 2.5) - 60}px`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <p className="text-[10px] font-bold text-[#1e3a5f] mb-1">Occupancy Rate: {tooltipData.rate}%</p>
                    <div className="space-y-0.5 text-[9px] font-semibold text-[#5a7184]">
                      <p>Occupied Beds: {tooltipData.occupied}</p>
                      <p>Vacant Beds: {tooltipData.vacant}</p>
                      <p>Under Maintenance: {tooltipData.maintenance}</p>
                    </div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-100 rotate-45" />
                  </div>
               )}

               <svg className="w-full h-full pl-10 overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                 {[0, 50, 100, 150, 200, 250].map((y) => (
                   <line key={y} x1="0" y1={y} x2={chartWidth} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                 ))}
                 <path d="M800,100 L900,40 L1000,150 L1000,250 L800,250 Z" fill="#eef6ff" opacity="0.8" />
                 <path d="M800,100 L900,40 L1000,150" fill="none" stroke="#3498db" strokeWidth="3" strokeDasharray="6 6" />
                 <path 
                    d="M0,150 L125,120 L250,160 L375,180 L500,140 L625,120 L750,180 L875,160 L1000,100" 
                    fill="none" stroke="#3498db" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" 
                  />
                  {dataPointsY.map((y, i) => (
                   <g key={i} className="cursor-pointer" onMouseEnter={() => setActiveIndex(i)}>
                      <rect x={(i * stepX) - 25} y="0" width="50" height="250" fill="transparent" />
                      {activeIndex === i && (
                        <circle cx={i * stepX} cy={y} r="6" fill="#1e3a5f" stroke="white" strokeWidth="2" />
                      )}
                   </g>
                  ))}
               </svg>

               <div className="flex justify-between pl-10 mt-6 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                 <span>Mar 1</span><span>Mar 2</span><span>Mar 3</span><span>Mar 4</span><span>Mar 5</span><span>Mar 6</span><span>Mar 7</span><span>Mar 8</span><span>Mar 9</span>
               </div>
             </div>
          </div>

          <div className="bg-[#f0f7ff] p-8 rounded-[32px] shadow-sm border border-blue-100 relative overflow-hidden h-[200px] flex justify-between items-center group">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <h3 className="text-xl font-bold text-[#1e3a5f]">Maintenance (Under repair)</h3>
              <div>
                <div className="text-[64px] font-bold text-[#1e3a5f] leading-none mb-4">{data.stats.maintenance}</div>
                <div className="flex items-center gap-2">
                  <div className="bg-white border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold text-[#3498db] shadow-sm">
                    13 <span className="text-[8px] opacity-70">▣</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#5a7184] uppercase tracking-tight">Increased from yesterday</span>
                </div>
              </div>
            </div>
            <div className="w-1/2 h-full flex items-end justify-end relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#3498db]/10 to-transparent rounded-full blur-3xl -bottom-10 right-0 w-[80%]" />
              <svg viewBox="0 0 400 150" className="w-full h-32 overflow-visible relative z-10">
                <defs>
                  <linearGradient id="lineShade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3498db" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3498db" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,120 L50,100 L100,130 L150,80 L200,110 L250,40 L300,90 L350,50 L400,100 V150 H0 Z" fill="url(#lineShade)" />
                <path d="M0,120 L50,100 L100,130 L150,80 L200,110 L250,40 L300,90 L350,50 L400,100" fill="none" stroke="#3498db" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <RotateCcw className="absolute top-6 right-8 text-[#5a7184] opacity-40 hover:opacity-100 hover:rotate-180 transition-all cursor-pointer" size={24} />
          </div>
        </div>

        {/* Right Column: Using the new GuestActivity component */}
        <GuestActivity 
          checkins={data.checkins} 
          checkouts={data.checkouts} 
        />
      </div>
    </div>
  );
}

// Reusable StatCard Component
const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => {
  return (
    <div 
      style={{ background: "linear-gradient(135deg, #14547F 0%, #1C76B2 35%, #2087CB 70%, #2497E5 100%)" }}
      className="p-7 rounded-[32px] shadow-xl text-white flex flex-col h-[200px] transition-all hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-2 relative z-10">
        <h4 className="uppercase text-[11px] font-extrabold tracking-[0.15em] opacity-80 leading-tight">{title}</h4>
        <div className="opacity-30 group-hover:opacity-60 transition-opacity">{icon}</div>
      </div>
      <div className="text-[72px] font-bold leading-none mb-auto relative z-10 tracking-tighter">{value}</div>
      <div className="flex items-center gap-3 relative z-10">
        <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center justify-center border border-white/20 shadow-sm">
           <span className="text-[12px] font-bold">13</span>
           <span className="text-[8px] ml-1.5 opacity-60">▣</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Increased from last month</span>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
    </div>
  );
};