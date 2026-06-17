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
  
  // CHANGED: track menu position instead of just the ID
  const [menuConfig, setMenuConfig] = useState<{ id: string, x: number, y: number } | null>(null);
  
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
        setMenuConfig(null);
      }
    };
    // Close on scroll to prevent the fixed menu from "floating" away from the button
    const handleScroll = () => setMenuConfig(null);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  // ADDED: Logic to calculate position
  const toggleMenu = (e: React.MouseEvent, id: string) => {
    if (menuConfig?.id === id) {
      setMenuConfig(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuConfig({
        id,
        x: rect.left - 120, // Offset to the left so it aligns with button
        y: rect.bottom + 8    // Small gap below button
      });
    }
  };

  const handleActionClick = (id: string, name: string, newStatus: string) => {
    setPendingAction({ id, name, status: newStatus });
    setIsModalOpen(true);
    setMenuConfig(null);
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
    <div className="w-full flex flex-col min-h-screen bg-transparent relative font-sans text-slate-900">
      
      <header className="mb-8 w-full">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={fetchBookings} className="p-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all shrink-0">
              <RefreshCw size={20} className={`${isLoading ? "animate-spin text-blue-500" : "text-gray-400"}`} />
            </button>
            
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                className="pl-10 pr-4 py-2.5 border border-gray-200 bg-white rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-100 shadow-sm" 
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-white border border-red-100 rounded-lg shadow-sm">
              <span className="text-red-500">Pending</span> 
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-xs font-bold">97</span>
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#3498db] text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-600 transition-all">
              Add booking <PlusCircle size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-gray-100 bg-slate-50/30">
                <th className="px-6 py-5 w-12"><input type="checkbox" className="rounded border-gray-300 text-blue-500" /></th>
                <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wider">Booking ID</th>
                <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wider">Guest Name</th>
                <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wider">Check-in</th>
                <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wider">Check-out</th>
                <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wider">Status</th>
                <th className="px-4 py-5 text-[13px] font-bold text-[#1e3a5f] uppercase tracking-wider text-center">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                <tr key={booking.dbId} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-4 py-4 text-[13px] text-gray-500 font-medium">{booking.bookingId}</td>
                    <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {booking.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <span className="text-[13px] text-gray-700 font-semibold truncate max-w-[150px]">{booking.name}</span>
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
                    <td className="px-4 py-4 text-center">
                    <button 
                        onClick={(e) => toggleMenu(e, booking.dbId)}
                        className="px-6 py-1.5 bg-[#3498db] text-white text-[13px] font-bold rounded-lg shadow-sm hover:bg-blue-600 transition-all"
                    >
                        Manage
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* CHANGED: Popover is now outside the table loop and uses fixed positioning */}
      {menuConfig && (
          <div 
            ref={menuRef} 
            style={{ top: `${menuConfig.y}px`, left: `${menuConfig.x}px` }}
            className="fixed w-44 bg-white border border-gray-100 rounded-xl shadow-2xl z-[999] py-2 animate-in fade-in zoom-in-95 duration-200"
          >
            <button onClick={() => handleActionClick(menuConfig.id, bookings.find(b => b.dbId === menuConfig.id)?.name, "Approved")} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#2ecc71] hover:bg-gray-50 font-bold border-b border-gray-50/50 text-left">
                <Check size={16} /> Approve
            </button>
            <button onClick={() => handleActionClick(menuConfig.id, bookings.find(b => b.dbId === menuConfig.id)?.name, "Rejected")} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#e74c3c] hover:bg-gray-50 font-bold border-b border-gray-50/50 text-left">
                <X size={16} /> Reject
            </button>
            <button onClick={() => router.push(`/home/booking-list/booking-details?id=${menuConfig.id}`)} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#3498db] hover:bg-gray-50 font-bold text-left">
                <Eye size={16} /> View Details
            </button>
          </div>
      )}

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