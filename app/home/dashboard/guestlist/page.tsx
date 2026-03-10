"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { 
  Search, RefreshCw, Download, ChevronLeft, ChevronRight, Users, Eye, ChevronDown 
} from "lucide-react";

interface GuestMember {
  guestId: string;
  name: string;
  seamanId: string;
  rank: string;
  vessel: string;
  email: string;
  status: "Active" | "Inactive" | string;
  source: string;
}

export default function GuestlistPage() {
  const router = useRouter(); 
  const [guestData, setGuestData] = useState<GuestMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // MOCK DATA matching the image's "Data" placeholders
  const mockGuests: GuestMember[] = Array(10).fill(null).map((_, i) => ({
    guestId: "Data",
    name: i === 0 ? "John L. Doe" : "Data",
    seamanId: i === 0 ? "0012385700" : "Data",
    rank: i === 0 ? "Chief Officer" : "Data",
    vessel: i === 0 ? "MV Pacific Star" : "Data",
    email: i === 0 ? "john.doe@gmail.com" : "Data",
    status: i === 0 ? "Active" : "Data",
    source: i === 0 ? "Self-Service Kiosk" : "Data",
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

  // Helper to get initials for Avatar
  const getInitials = (name: string) => {
    if (name === "Data") return "D";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  // Navigation Handler
  const handleViewDetails = (guest: GuestMember) => {
    const params = new URLSearchParams({
      id: guest.guestId,
      name: guest.name,
      rank: guest.rank,
      seamanId: guest.seamanId,
      vessel: guest.vessel,
      email: guest.email,
      status: guest.status,
    });
    router.push(`/home/dashboard/guestlist/crewdetails?${params.toString()}`);
  };

  return (
    <div className="p-10 flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <header className="mb-6">
        <h1 className="text-[48px] font-bold text-[#1e3a5f] mb-8">Guestlist</h1>
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => window.location.reload()} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <RefreshCw size={20} className={isLoading ? "animate-spin text-blue-500" : "text-gray-400"} />
            </button>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full pl-12 pr-4 py-2.5 bg-[#E2E8F0] border-none rounded-xl text-sm outline-none placeholder:text-gray-500" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FilterDropdown label="Status" />
            <FilterDropdown label="Availability" />
            <button className="flex items-center gap-2 bg-[#3498db] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-100">
              Download PDF <Download size={18} />
            </button>
          </div>
        </div>
      </header>
      
      {/* TABLE SECTION */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#E2E8F0] text-[#5a7184] text-[13px] font-bold">
            <tr>
              <th className="px-6 py-4 w-10 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="px-6 py-4">Guest ID</th>
              <th className="px-6 py-4">Guest Name</th>
              <th className="px-6 py-4">Seaman ID</th>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Vessel</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Sources</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {guestData.map((guest, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="px-6 py-4 text-sm text-gray-500">{guest.guestId}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold text-white shrink-0 uppercase">
                      {getInitials(guest.name)}
                    </div>
                    <span className="text-sm font-semibold text-[#1e3a5f]">{guest.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{guest.seamanId}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{guest.rank}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{guest.vessel}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{guest.email}</td>
                <td className="px-6 py-4">
                  {guest.status === "Active" ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">{guest.status}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{guest.source}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleViewDetails(guest)}
                    className="bg-[#3498db] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION FOOTER */}
        <div className="px-8 py-6 flex items-center justify-between border-t border-gray-100 bg-white">
          <p className="text-sm text-gray-400 font-medium">Showing 1-10 out of 100</p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-gray-400 hover:text-[#3498db] text-sm font-bold transition-colors">
              <ChevronLeft size={18} /> Previous
            </button>
            <div className="flex items-center gap-1 mx-4">
              {[1, 2, 3].map((p) => (
                <button 
                  key={p} 
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${p === 1 ? "bg-[#3498db]/10 text-[#3498db] border border-[#3498db]/20" : "text-gray-400 hover:bg-gray-50"}`}
                >
                  {p}
                </button>
              ))}
              <span className="text-gray-300 mx-1">...</span>
            </div>
            <button className="flex items-center gap-1 text-gray-400 hover:text-[#3498db] text-sm font-bold transition-colors">
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
    <button className="flex items-center justify-between gap-8 bg-[#E2E8F0] text-[#5a7184] px-4 py-2.5 rounded-xl text-sm font-bold min-w-[140px]">
      {label} <ChevronDown size={16} />
    </button>
  );
}