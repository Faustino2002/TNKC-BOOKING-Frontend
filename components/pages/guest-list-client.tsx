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

// The interface acts as a contract between Frontend and Backend
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
  
  // State Management
  const [guestData, setGuestData] = useState<GuestMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  /**
   * BACKEND INTEGRATION POINT
   * This function is ready for a real API. 
   * The backend developer just needs to replace the URL.
   */
  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Replace '/api/guests' with the actual endpoint
      // Example: const response = await fetch(`/api/guests?search=${searchQuery}`);
      const response = await fetch('/api/guests'); 
      
      if (!response.ok) throw new Error('Failed to fetch guest list');
      
      const data = await response.json();
      setGuestData(data);
    } catch (err) {
      // Fallback to mock data if API fails (for development only)
      console.error("Backend not connected, using mock data:", err);
      const mockData: GuestMember[] = Array.from({ length: 10 }).map((_, i) => ({
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
  }, [searchQuery]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Client-side filtering (Backend developer can move this to API query later)
  const filteredGuests = guestData.filter((guest) =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.guestId.includes(searchQuery)
  );

  return (
    <div className="p-8 flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#1e3a5f]">
      <header className="mb-6">
        <h1 className="text-[40px] font-bold text-[#1e3a5f] mb-6 tracking-tight">Guestlist</h1>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <Filter size={18} className="text-gray-500" />
            </button>
            
            <div className="relative w-[240px]"> 
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F1F5F9] border-none rounded-lg text-sm outline-none placeholder:text-gray-400 font-medium focus:ring-1 ring-blue-200" 
              />
            </div>
          </div>

          <button className="flex items-center gap-2 bg-[#3498db] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#2980b9] transition-all shadow-sm">
            Download PDF <Download size={16} />
          </button>
        </div>
      </header>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">Guest ID</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">Guest Name</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">Seaman ID</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">Rank</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">Vessel</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">Status</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight">Sources</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-tight text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={9} className="py-20 text-center text-gray-400 font-medium">Loading...</td></tr>
            ) : filteredGuests.length === 0 ? (
              <tr><td colSpan={9} className="py-20 text-center text-gray-400 font-medium">No results found</td></tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr key={guest.guestId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="px-4 py-3 text-[13px] text-[#5a7184] font-medium">{guest.guestId}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#64748b] flex items-center justify-center text-[10px] font-bold text-white shrink-0 uppercase border border-gray-100 shadow-sm">
                        {guest.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[13px] font-bold text-[#1e3a5f]">{guest.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#5a7184] font-medium">{guest.seamanId}</td>
                  <td className="px-4 py-3 text-[13px] text-[#5a7184] font-medium">{guest.rank}</td>
                  <td className="px-4 py-3 text-[13px] text-[#5a7184] font-medium">{guest.vessel}</td>
                  <td className="px-4 py-3">
                    <span 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border w-fit"
                      style={{
                        backgroundColor: guest.status === "Reserved" ? "#1967D2" : guest.status === "Confirmed" ? "#E6F4EA" : "#FFF8E1",
                        color: guest.status === "Reserved" ? "white" : guest.status === "Confirmed" ? "#1E7E34" : "#B78103",
                        borderColor: guest.status === "Reserved" ? "transparent" : guest.status === "Confirmed" ? "#C3E6CB" : "#FFE082"
                      }}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: guest.status === "Reserved" ? "white" : guest.status === "Confirmed" ? "#28A745" : "#FFC107" }}
                      />
                      {guest.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#5a7184] font-medium">{guest.source}</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => router.push(`/home/guest-list/crew-details?id=${guest.guestId}`)}
                      className="bg-[#3498db] text-white px-5 py-1.5 rounded-lg text-xs font-bold hover:bg-[#2980b9] shadow-sm transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 bg-white flex items-center justify-between border-t border-gray-100">
          <p className="text-sm text-gray-400 font-medium">Showing {filteredGuests.length} of {guestData.length} entries</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchGuests} // Backend trigger for page refresh
              className="p-1 text-gray-400 hover:text-[#1e3a5f] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={fetchGuests} // Backend trigger for next page
              className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-[#1e3a5f] ml-2 transition-colors"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}