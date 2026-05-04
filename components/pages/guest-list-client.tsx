"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Filter 
} from "lucide-react";

interface GuestMember {
  guestId: string;
  name: string;
  seamanId: string;
  rank: string;
  vessel: string;
  status: "Confirmed" | "Reserved" | "Waiting Arrival";
  source: string;
}

export default function GuestListClient() {
  const router = useRouter();
  
  const [guestData, setGuestData] = useState<GuestMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/guests'); 
      
      if (!response.ok) throw new Error('Failed to fetch guest list');
      
      const data = await response.json();
      setGuestData(data);
    } catch (err) {
      console.error("Backend not connected, using mock data:", err);
      const mockData: GuestMember[] = Array.from({ length: 12 }).map((_, i) => ({
        guestId: `000000${24 - i}`,
        name: i % 2 === 0 ? "John L. Doe" : "Jane A. Smith",
        seamanId: "0012385700",
        rank: i < 7 ? "Chief Officer" : "Cadet",
        vessel: "MV Pacific Star",
        status: i % 3 === 1 ? "Reserved" : i % 3 === 0 ? "Confirmed" : "Waiting Arrival",
        source: "Self-Service Kiosk",
      }));
      setGuestData(mockData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const filteredGuests = guestData.filter((guest) =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.guestId.includes(searchQuery)
  );

  return (
    <div className="w-full animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-10 w-full">
        <div>
          <p className="text-[#5a7184] text-xl font-semibold tracking-tight">
            Manage and monitor crew member arrivals.
          </p>
        </div>
        
        <button className="flex items-center gap-2 bg-[#3498db] text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-[#2980b9] transition-all shadow-lg active:scale-95">
          Download PDF <Download size={18} />
        </button>
      </header>

      {/* Toolbar Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 w-full">
        {/* Search & Filter Group - White background only applied here */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-fit">
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-gray-500">
            <Filter size={20} />
          </button>
          
          <div className="relative w-80"> 
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, name, or vessel..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-transparent rounded-xl text-sm outline-none placeholder:text-gray-400 font-medium focus:bg-white focus:ring-2 ring-blue-100 transition-all" 
            />
          </div>
        </div>
        
        {/* Total Guests - Left alone outside the white box */}
        <div className="flex items-center gap-2 text-sm text-[#5a7184] font-semibold">
          <span>Total Guests:</span>
          <span className="bg-blue-50 text-[#3498db] px-3 py-1 rounded-lg">{guestData.length}</span>
        </div>
      </div>
      
      {/* Table Section */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC]/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 w-10 text-center">
                  <input type="checkbox" className="rounded-md border-gray-300 text-[#3498db] focus:ring-[#3498db] w-4 h-4" />
                </th>
                <th className="px-4 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Guest ID</th>
                <th className="px-4 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Guest Name</th>
                <th className="px-4 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Seaman ID</th>
                <th className="px-4 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Rank</th>
                <th className="px-4 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Vessel</th>
                <th className="px-4 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Sources</th>
                <th className="px-4 py-5 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={9} className="py-32 text-center text-gray-400 font-bold uppercase tracking-widest">Loading Records...</td></tr>
              ) : filteredGuests.length === 0 ? (
                <tr><td colSpan={9} className="py-32 text-center text-gray-400 font-bold uppercase tracking-widest">No results found</td></tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.guestId} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded-md border-gray-300 text-[#3498db] focus:ring-[#3498db] w-4 h-4" />
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#5a7184] font-bold">{guest.guestId}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500 shrink-0 uppercase border border-white shadow-sm group-hover:scale-110 transition-transform">
                          {guest.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[14px] font-bold text-[#1e3a5f]">{guest.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#5a7184] font-semibold">{guest.seamanId}</td>
                    <td className="px-4 py-4 text-[13px] text-[#5a7184] font-semibold">{guest.rank}</td>
                    <td className="px-4 py-4 text-[13px] text-[#5a7184] font-semibold">{guest.vessel}</td>
                    <td className="px-4 py-4">
                      <span 
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold border"
                        style={{
                          backgroundColor: guest.status === "Reserved" ? "#ebf5ff" : guest.status === "Confirmed" ? "#ecfdf5" : "#fffbeb",
                          color: guest.status === "Reserved" ? "#1d4ed8" : guest.status === "Confirmed" ? "#047857" : "#b45309",
                          borderColor: guest.status === "Reserved" ? "#dbeafe" : guest.status === "Confirmed" ? "#d1fae5" : "#fef3c7"
                        }}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: guest.status === "Reserved" ? "#1d4ed8" : guest.status === "Confirmed" ? "#10b981" : "#f59e0b" }}
                        />
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#5a7184] font-semibold">{guest.source}</td>
                    <td className="px-4 py-4 text-center">
                      <button 
                        onClick={() => router.push(`/home/guest-list/crew-details?id=${guest.guestId}`)}
                        className="bg-[#3498db] text-white px-6 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider hover:bg-[#2980b9] shadow-sm transition-all active:scale-95"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-8 py-6 bg-[#F8FAFC]/30 flex items-center justify-between border-t border-gray-100">
          <p className="text-sm text-gray-400 font-bold">
            Showing <span className="text-[#1e3a5f]">{filteredGuests.length}</span> of <span className="text-[#1e3a5f]">{guestData.length}</span> entries
          </p>
          <div className="flex items-center gap-6">
            <button 
              onClick={fetchGuests}
              className="p-2 text-gray-400 hover:text-[#3498db] transition-colors rounded-lg hover:bg-white hover:shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={fetchGuests}
              className="group flex items-center gap-2 text-sm font-extrabold text-[#5a7184] hover:text-[#3498db] transition-all uppercase tracking-widest"
            >
              Next <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}