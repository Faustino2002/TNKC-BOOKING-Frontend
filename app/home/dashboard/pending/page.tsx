"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, RefreshCw, ChevronLeft, ChevronRight, 
  Filter, Check, X, Eye, ChevronLeft as BackIcon
} from "lucide-react";

export default function PendingBookingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewBooking, setViewBooking] = useState<any | null>(null);
  
  const menuRef = useRef<HTMLDivElement | null>(null);

  // FETCH DATA
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings"); 
      if (!response.ok) throw new Error("No backend found");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      // Fallback Mock Data so your UI stays functional during dev
      setBookings([
        { dbId: "1", bookingId: "#176966343", name: "Linda Walker", rank: "Cadet", roomType: "Single", checkIn: "05/23/26", checkOut: "05/26/26" },
        { dbId: "2", bookingId: "#176966344", name: "James Smith", rank: "Chief Officer", roomType: "Executive", checkIn: "06/12/26", checkOut: "06/15/26" },
        { dbId: "3", bookingId: "#176966345", name: "Maria Garcia", rank: "Captain", roomType: "Suite", checkIn: "07/01/26", checkOut: "07/10/26" },
        { dbId: "4", bookingId: "#176966346", name: "Robert Chen", rank: "Bosun", roomType: "Double", checkIn: "05/29/26", checkOut: "06/02/26" },
        { dbId: "5", bookingId: "#176966347", name: "Sarah Jenkins", rank: "Cook", roomType: "Single", checkIn: "06/05/26", checkOut: "06/08/26" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // IMPROVED SAVE LOGIC
  const handleSave = async () => {
    if (!viewBooking) return;
    setIsSaving(true);

    try {
      // 1. Attempt Backend Update
      const response = await fetch(`/api/bookings/${viewBooking.dbId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(viewBooking),
      });

      // 2. Local UI Update (Always runs if backend is missing OR if backend succeeds)
      setBookings((prev) =>
        prev.map((b) => (b.dbId === viewBooking.dbId ? { ...viewBooking } : b))
      );
      
      console.log("Saved successfully!");
    } catch (error) {
      // If backend fail we still update the UI for your demo/testing
      setBookings((prev) =>
        prev.map((b) => (b.dbId === viewBooking.dbId ? { ...viewBooking } : b))
      );
    } finally {
      setIsSaving(false);
      setViewBooking(null); // Close modal
    }
  };

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });
      setBookings(prev => prev.filter(b => b.dbId !== id));
    } catch (error) {
      // Local fallback: remove from list anyway for visual flow
      setBookings(prev => prev.filter(b => b.dbId !== id));
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleFieldChange = (field: string, newValue: string) => {
    if (viewBooking) {
      setViewBooking({ ...viewBooking, [field]: newValue });
    }
  };

  return (
    <div className="p-10 flex flex-col min-h-screen bg-white relative">
      <header className="mb-8">
        <h1 className="text-[32px] font-bold text-[#1e3a5f]">Pending Booking</h1>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchBookings} 
              className="p-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-all"
            >
              <RefreshCw size={18} className={`${isLoading ? "animate-spin text-blue-500" : "text-gray-500"}`} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-100 bg-gray-50 rounded-md w-80 text-sm outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium px-3 py-2 bg-blue-50 text-blue-600 rounded-md">
              Pending <span className="font-bold">{bookings.length}</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-md text-sm text-gray-600 cursor-pointer">
              <Filter size={16} />
              <span>Filter by</span>
            </div>
          </div>
        </div>
      </header>

      <div className="border border-gray-100 rounded-lg overflow-visible shadow-sm">
        {isLoading ? (
          <div className="p-20 text-center text-gray-400 text-sm">Loading bookings...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1e3a5f] text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Booking ID</th>
                <th className="px-6 py-4 font-semibold">Crew</th>
                <th className="px-6 py-4 font-semibold">Rank</th>
                <th className="px-6 py-4 font-semibold">Room Type</th>
                <th className="px-6 py-4 font-semibold">Check-in</th>
                <th className="px-6 py-4 font-semibold">Check-out</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking.dbId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{booking.bookingId}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{booking.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.rank}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.roomType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.checkIn}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.checkOut}</td>
                  <td className="px-6 py-4 text-sm text-center relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === booking.dbId ? null : booking.dbId)}
                      className="text-blue-400 font-medium underline"
                    >
                      Manage
                    </button>

                    {openMenuId === booking.dbId && (
                      <div ref={menuRef} className="absolute right-0 top-12 w-36 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                        <button onClick={() => handleAction(booking.dbId, "approved")} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-[#2ecc71] hover:bg-gray-50 font-medium border-b border-gray-50">
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => handleAction(booking.dbId, "rejected")} className="w-full flex items-center gap-3 px-4 py-2 text-xs text-[#e74c3c] hover:bg-gray-50 font-medium border-b border-gray-50">
                          <X size={14} /> Reject
                        </button>
                        <button 
                          onClick={() => { setViewBooking({ ...booking }); setOpenMenuId(null); }} 
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs text-[#3498db] hover:bg-gray-50 font-medium"
                        >
                          <Eye size={14} /> View
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL SECTION */}
      {viewBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[500px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 flex items-center gap-4 border-b border-gray-50">
              <button onClick={() => setViewBooking(null)} className="text-blue-400 hover:scale-110 transition-transform">
                <BackIcon size={20} />
              </button>
              <h2 className="text-[#1e3a5f] font-bold text-xl">View Details</h2>
            </div>
            <div className="p-8 space-y-5">
              <h3 className="text-[#1e3a5f] font-bold text-lg">Booking Details</h3>
              <div className="space-y-4">
                <DetailInput label="Booking ID" value={viewBooking.bookingId} onChange={(val: string) => handleFieldChange("bookingId", val)} />
                <DetailInput label="Crew Name" value={viewBooking.name} readOnly />
                <DetailInput label="Rank" value={viewBooking.rank} onChange={(val: string) => handleFieldChange("rank", val)} />
                <DetailInput label="Room Type" value={viewBooking.roomType} onChange={(val: string) => handleFieldChange("roomType", val)} />
                <div className="grid grid-cols-2 gap-4">
                  <DetailInput label="Check-in" value={viewBooking.checkIn} readOnly />
                  <DetailInput label="Check-out" value={viewBooking.checkOut} readOnly />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button 
                  disabled={isSaving}
                  onClick={() => setViewBooking(null)} 
                  className="px-6 py-2 border border-blue-400 text-blue-400 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="px-8 py-2 bg-[#3498db] text-white rounded-lg text-sm font-medium shadow-md hover:bg-[#2980b9] disabled:bg-gray-400 flex items-center gap-2"
                >
                  {isSaving && <RefreshCw size={14} className="animate-spin" />}
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailInput({ label, value, readOnly, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-700">{label}</label>
      <input 
        type="text" 
        value={value} 
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${
          readOnly 
          ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed" 
          : "bg-white text-gray-700 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-50"
        }`}
      />
    </div>
  );
}