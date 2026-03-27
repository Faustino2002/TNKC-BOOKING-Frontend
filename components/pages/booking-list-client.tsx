"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, RefreshCw, Check, X, Eye, PlusCircle
} from "lucide-react";

export default function BookingListClient() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: string, name: string, status: string } | null>(null);
  
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings"); 
      if (!response.ok) throw new Error("No backend found");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      setBookings([
        { dbId: "1200975771", bookingId: "#1200975771", name: "Maria S. Dela Cruz", checkIn: "06/25/2026", checkOut: "06/28/2026", status: "Pending" },
        { dbId: "1200975770", bookingId: "#1200975770", name: "Jane L. Doe", checkIn: "05/20/2026", checkOut: "05/22/2026", status: "Pending" },
        { dbId: "1200975773", bookingId: "#1200975773", name: "System User", checkIn: "05/20/2026", checkOut: "05/22/2026", status: "Approved" },
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

  const handleActionClick = (id: string, name: string, newStatus: string) => {
    setPendingAction({ id, name, status: newStatus });
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmAction = async () => {
    if (!pendingAction) return;
    const { id, status } = pendingAction;

    try {
      setBookings(prev => prev.map(b => b.dbId === id ? { ...b, status } : b));
      await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (error) {
      console.error("Update failed, state updated locally.");
    } finally {
      setIsModalOpen(false);
      setPendingAction(null);
    }
  };

  return (
    <div className="p-10 flex flex-col min-h-screen bg-[#F8FAFC] relative font-sans text-slate-900">
      <header className="mb-8">
        <h1 className="text-[44px] font-bold text-[#1e3a5f]">Booking List</h1>
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={fetchBookings} className="p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all">
              <RefreshCw size={20} className={`${isLoading ? "animate-spin text-blue-500" : "text-gray-400"}`} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search" className="pl-10 pr-4 py-2.5 border border-gray-200 bg-white rounded-lg w-80 text-sm outline-none focus:ring-2 focus:ring-blue-100 shadow-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-white border border-red-100 rounded-lg shadow-sm">
              <span className="text-red-500">Pending</span> <span className="text-gray-400">97</span>
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3498db] text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-600 transition-all">
              Add booking <PlusCircle size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border border-gray-100 rounded-xl overflow-visible shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-5 w-12"><input type="checkbox" className="rounded border-gray-300 text-blue-500" /></th>
              <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f]">Booking ID</th>
              <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f]">Guest Name</th>
              <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f]">Check-in</th>
              <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f]">Check-out</th>
              <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f]">Status</th>
              <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f] text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map((booking) => (
              <tr key={booking.dbId} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="px-4 py-4 text-[13px] text-gray-500 font-medium">{booking.bookingId}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-[10px] font-bold">
                      {booking.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <span className="text-[13px] text-gray-700 font-semibold">{booking.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-[13px] text-gray-500">{booking.checkIn}</td>
                <td className="px-4 py-4 text-[13px] text-gray-500">{booking.checkOut}</td>
                <td className="px-4 py-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${
                    booking.status === "Approved" 
                    ? "bg-green-50 text-green-600 border-green-100" 
                    : "bg-red-50 text-red-500 border-red-100"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      booking.status === "Approved" ? "bg-green-500" : "bg-red-500"
                    }`} />
                    <span className="text-[11px] font-bold uppercase tracking-tight">{booking.status}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === booking.dbId ? null : booking.dbId)}
                    className="px-6 py-1.5 bg-[#3498db] text-white text-[13px] font-bold rounded-lg shadow-sm hover:bg-blue-600 transition-all"
                  >
                    Manage
                  </button>

                  {openMenuId === booking.dbId && (
                    <div ref={menuRef} className="absolute right-4 top-14 w-44 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 py-2">
                      <button onClick={() => handleActionClick(booking.dbId, booking.name, "Approved")} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#2ecc71] hover:bg-gray-50 font-bold border-b border-gray-50/50">
                        <Check size={16} /> Approve
                      </button>
                      <button onClick={() => handleActionClick(booking.dbId, booking.name, "Rejected")} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#e74c3c] hover:bg-gray-50 font-bold border-b border-gray-50/50">
                        <X size={16} /> Reject
                      </button>
                      <button onClick={() => router.push(`/home/booking-list/booking-details?id=${booking.dbId}`)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#3498db] hover:bg-gray-50 font-bold">
                        <Eye size={16} /> View Details
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && pendingAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] p-8 border border-gray-100">
            <div className="flex items-start justify-between text-left">
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-xl bg-[#FEE2E2] flex items-center justify-center shrink-0">
                  <div className="w-7 h-7 bg-[#EF4444] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[22px] font-bold text-[#EF4444]">
                    {pendingAction.status} Book Request
                  </h3>
                  <p className="text-gray-600 text-[15px] mt-2 leading-snug">
                    Are you sure you want to {pendingAction.status.toLowerCase()} {pendingAction.name} booking request?
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-end gap-3 mt-10">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 font-semibold text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmAction} className="px-8 py-2.5 rounded-lg text-white font-bold text-sm bg-[#EF4444] hover:bg-red-600 shadow-md">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}