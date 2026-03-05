"use client";

import React, { useState, useEffect } from "react";
import { Bell, ExternalLink, CheckCircle2, Brush, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  // 1. DATA CONTRACT: The backend developer knows exactly what to provide
  const [dashboardStats, setDashboardStats] = useState({
    pending: 0,
    totalCrews: 0,
    totalRooms: 0,
    availableBeds: 0,
  });

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // 2. CONNECTION POINT: The developer replaces this with their API URL
        const response = await fetch('/api/dashboard/summary');
        
        if (response.ok) {
          const data = await response.json();
          // Data is expected in format: { stats: {...}, activities: [...] }
          setDashboardStats(data.stats);
          setActivities(data.activities);
        }
      } catch (error) {
        // Graceful failure: stays at 0 if the backend isn't ready yet
        console.log("Dashboard API connection pending...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-10">
      <header className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-[32px] font-bold text-[#1e3a5f]">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">System Overview</p>
        </div>
        <button className="p-2 text-[#3282B8] hover:bg-blue-50 rounded-full transition-colors relative">
          <Bell size={24} />
        </button>
      </header>

      {/* 3. DYNAMIC STATS: Shows "..." while loading, then real numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Pending" value={isLoading ? "..." : dashboardStats.pending} />
        <StatCard title="Total Crews" value={isLoading ? "..." : dashboardStats.totalCrews} />
        <StatCard title="Total Rooms" value={isLoading ? "..." : dashboardStats.totalRooms} />
        <StatCard title="Available Beds" value={isLoading ? "..." : dashboardStats.availableBeds} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 min-h-[300px] flex items-center justify-center text-gray-300 italic text-sm text-center px-10">
          {isLoading ? "Connecting to analytics database..." : "No Chart Data Available"}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 min-h-[300px]"></div>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="bg-[#82bdf1] px-6 py-4 text-white font-bold">Recent Activity</div>
        <div className="divide-y divide-gray-50">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400 text-sm italic animate-pulse">
              Scanning database for recent logs...
            </div>
          ) : activities.length > 0 ? (
            activities.map((item: any) => <ActivityRow key={item.id} data={item} />)
          ) : (
            <div className="p-10 text-center text-gray-400 text-sm italic">
              There is no recent activity.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---

function StatCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-50 to-transparent opacity-50" />
      <div className="flex justify-between items-start z-10">
        <span className="text-[#3282B8] font-bold text-lg">{title}</span>
        <ExternalLink size={18} className="text-[#3282B8] opacity-60" />
      </div>
      <span className="text-[48px] font-bold text-[#1e3a5f] mt-2 mb-2 z-10">{value}</span>
      <p className="text-[11px] text-gray-400 z-10 font-medium">Live data</p>
    </div>
  );
}

function ActivityRow({ data }: { data: any }) {
  const icons = {
    success: <CheckCircle2 className="text-green-500" size={20} />,
    warning: <Brush className="text-orange-400" size={20} />,
    danger: <AlertCircle className="text-red-400" size={20} />,
  };
  return (
    <div className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-full border border-gray-100">{(icons as any)[data.type]}</div>
        <div>
          <p className="text-sm font-bold text-gray-800 leading-tight">{data.title}</p>
          <p className="text-xs text-gray-400 mt-1">{data.subtitle}</p>
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">{data.time}</span>
    </div>
  );
}