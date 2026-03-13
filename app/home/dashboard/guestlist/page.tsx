"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { 
  Search, RefreshCw, Download, ChevronLeft, ChevronRight, ChevronDown 
} from "lucide-react";

interface GuestMember {
  guestId: string;
  name: string;
  seamanId: string;
  rank: string;
  vessel: string;
  status: string;
  source: string;
}

export default function GuestlistPage() {
  const router = useRouter(); 
  const [guestData, setGuestData] = useState<GuestMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockGuests: GuestMember[] = Array(10).fill(null).map((_, i) => ({
    guestId: "000000" + (24 - i),
    name: "John L. Doe",
    seamanId: "0012385700",
    rank: i < 5 ? "Chief Officer" : "Cadet",
    vessel: "MV Pacific Star",
    status: i === 0 ? "Confirmed" : "Data",
    source: "Self-Service Kiosk",
  }));

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/guests'); 
        if (!response.ok) throw new Error();
        const data = await response.json();
        setGuestData(data);
      } catch (err) {
        setGuestData(mockGuests);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuests();
  }, []);

  
  const handleViewDetails = (guest: GuestMember) => {
    const params = new URLSearchParams({
      id: guest.guestId,
      name: guest.name,
      rank: guest.rank,
      seamanId: guest.seamanId,
      vessel: guest.vessel,
      status: guest.status,
    });
    router.push(`/home/dashboard/guestlist/crewdetails?${params.toString()}`);
  };

  return (
    <div className="p-10 flex flex-col min-h-screen bg-[#F8FAFC] font-sans">
      <header className="mb-6">
        <h1 className="text-[48px] font-bold text-[#1e3a5f] mb-8">Guestlist</h1>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => window.location.reload()} className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <RefreshCw size={20} className={isLoading ? "animate-spin text-blue-500" : "text-gray-400"} />
            </button>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full pl-11 pr-4 py-2 bg-[#F1F5F9] border-none rounded-lg text-sm outline-none placeholder:text-gray-400 font-medium" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FilterDropdown label="Status" />
            <FilterDropdown label="Availability" />
            <button className="flex items-center gap-2 bg-[#3498db] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-600 transition-all shadow-sm">
              Download PDF <Download size={16} />
            </button>
          </div>
        </div>
      </header>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F8FAFC] border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Guest ID</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Guest Name</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Seaman ID</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Vessel</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">Sources</th>
              <th className="px-4 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider text-right pr-8">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {guestData.map((guest, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="px-4 py-3.5 text-sm text-gray-600 font-medium">{guest.guestId}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#64748b] flex items-center justify-center text-[11px] font-bold text-white shrink-0 border border-gray-300 shadow-sm">
                      JD
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{guest.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-500">{guest.seamanId}</td>
                <td className="px-4 py-3.5 text-sm text-gray-500">{guest.rank}</td>
                <td className="px-4 py-3.5 text-sm text-gray-500">{guest.vessel}</td>
                <td className="px-4 py-3.5">
                  {guest.status === "Confirmed" ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 w-fit">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Confirmed
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">{guest.status}</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-500">{guest.source}</td>
                <td className="px-4 py-3.5 text-right pr-6">
                  {/* onClick */}
                  <button 
                    onClick={() => handleViewDetails(guest)}
                    className="bg-[#3498db] text-white px-5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION FOOTER */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-white">
          <p className="text-[13px] text-gray-400 font-medium italic">Showing 1-10 out of 100</p>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-gray-500 hover:text-[#3498db] text-sm font-semibold transition-colors">
              <ChevronLeft size={18} /> Previous
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((p) => (
                <button 
                  key={p} 
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${p === 1 ? "bg-[#3498db]/10 text-[#3498db] border border-blue-200" : "text-gray-400 hover:bg-gray-50"}`}
                >
                  {p}
                </button>
              ))}
              <span className="text-gray-300 mx-1">...</span>
            </div>
            <button className="flex items-center gap-1 text-gray-500 hover:text-[#3498db] text-sm font-semibold transition-colors">
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center justify-between gap-4 bg-[#F1F5F9] text-gray-600 px-4 py-2.5 rounded-lg text-sm font-semibold min-w-[140px] hover:bg-gray-200 transition-colors">
      {label} <ChevronDown size={16} className="text-gray-400" />
    </button>
  );
}