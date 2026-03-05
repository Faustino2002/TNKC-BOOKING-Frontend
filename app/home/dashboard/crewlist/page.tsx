"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, RefreshCw, Download, ChevronLeft, ChevronRight, Users, Eye 
} from "lucide-react";

interface CrewMember {
  bookingId: string;
  name: string;
  rank: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
}

export default function CrewlistPage() {
  const [crewData, setCrewData] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // MOCK DATA ARRAY
  const mockCrew = [
    { bookingId: "#176966343", name: "Linda Walker", rank: "Cadet", roomType: "Single", checkIn: "05/23/26", checkOut: "05/26/26" },
    { bookingId: "#176966344", name: "James Smith", rank: "Chief Officer", roomType: "Executive", checkIn: "06/12/26", checkOut: "06/15/26" },
    { bookingId: "#176966345", name: "Maria Garcia", rank: "Captain", roomType: "Suite", checkIn: "07/01/26", checkOut: "07/10/26" },
    { bookingId: "#176966346", name: "Robert Chen", rank: "Bosun", roomType: "Double", checkIn: "05/29/26", checkOut: "06/02/26" },
    { bookingId: "#176966347", name: "Sarah Jenkins", rank: "Cook", roomType: "Single", checkIn: "06/05/26", checkOut: "06/08/26" },
    { bookingId: "#176966348", name: "Michael Ross", rank: "Deckhand", roomType: "Double", checkIn: "05/20/26", checkOut: "05/25/26" }
  ];

  useEffect(() => {
    const getCrewFromDatabase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/crews'); 
        if (!response.ok) throw new Error("Server not found");
        const data = await response.json();
        setCrewData(data);
      } catch (err) {
        setCrewData(mockCrew);
      } finally {
        setIsLoading(false);
      }
    };
    getCrewFromDatabase();
  }, []);

  return (
    <div className="p-10 flex flex-col min-h-screen">
      <header className="mb-8">
        <h1 className="text-[32px] font-bold text-[#1e3a5f]">Crewlist</h1>
        
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.reload()} 
              className="p-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-all"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin text-blue-500" : "text-gray-500"} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-64 text-sm outline-none focus:ring-2 focus:ring-blue-100" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center text-xs font-medium gap-4 text-gray-500">
              <span>Total <span className="text-blue-500 ml-1 font-bold">{crewData.length}</span></span>
            </div>
            <button className="flex items-center gap-2 bg-[#3498db] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e3a5f] text-white text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Booking ID</th>
              <th className="px-6 py-4 font-semibold">Crew</th>
              <th className="px-6 py-4 font-semibold">Rank</th>
              <th className="px-6 py-4 font-semibold">Room Type</th>
              <th className="px-6 py-4 font-semibold">Check-in</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(6)].map((_, i) => <TableSkeleton key={i} />)
            ) : crewData.length > 0 ? (
              crewData.map((crew, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{crew.bookingId}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#1e3a5f]">{crew.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{crew.rank}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{crew.roomType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{crew.checkIn}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    {/* Updated Action Button */}
                    <button className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-700 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-blue-200">
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-32 text-center text-gray-400">
                  <Users size={40} className="mx-auto mb-4 opacity-20" />
                  No crew members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <span>Showing {crewData.length} records</span>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:text-blue-500"><ChevronLeft size={18} /></button>
          <button className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 font-bold text-xs">1</button>
          <button className="p-2 hover:text-blue-500"><ChevronRight size={18} /></button>
        </div>
      </footer>
    </div>
  );
}

function TableSkeleton() {
  return (
    <tr className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
      ))}
    </tr>
  );
}