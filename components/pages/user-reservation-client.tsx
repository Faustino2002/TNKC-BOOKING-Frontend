"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, Loader2, Calendar, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. DATA CONTRACT
interface Booking {
  id: string;
  roomNumber: string;
  roomType: string;
  image: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: "new" | "completed" | "cancelled";
}

const tabs = [
  { id: "new", label: "New Booking" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled Booking" },
];

export default function ReservationClientPage() {
  const [activeTab, setActiveTab] = useState("new");
  const [view, setView] = useState<"list" | "booking">("list");
  const [searchQuery, setSearchQuery] = useState("");
  
  // BACKEND READY STATES
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // TRACKS CLICKED ITEM
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    seamanId: "000107882325",
    firstName: "John",
    lastName: "Doe",
    middleName: "Legarda",
    contactNumber: "09746271885",
    email: "john.doe@gmail.com",
    rank: "Chief Officer",
    purpose: "Training",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData: Booking[] = [
          { id: "1", roomNumber: "502", roomType: "Shared Cabin", image: "/room-placeholder.jpg", checkIn: "03/01/2026", checkOut: "03/03/2026", duration: "2 nights", status: "new" },
          { id: "4", roomNumber: "301", roomType: "Private Suite", image: "/room-placeholder.jpg", checkIn: "02/10/2026", checkOut: "02/12/2026", duration: "2 nights", status: "completed" },
          { id: "6", roomNumber: "105", roomType: "Shared Cabin", image: "/room-placeholder.jpg", checkIn: "01/15/2026", checkOut: "01/16/2026", duration: "1 night", status: "cancelled" },
        ];
        setBookings(mockData);
      } catch (err) {
        setError("Failed to load reservations.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const displayBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesTab = b.status === activeTab;
      const matchesSearch = b.roomNumber.includes(searchQuery) || b.roomType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, bookings]);

  // READ-ONLY VIEW DETAILS (NOW FULLY DYNAMIC)
  if (view === "booking" && selectedBooking) {
    return (
      <div className="min-h-screen bg-white p-8 md:p-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => { setView("list"); setSelectedBooking(null); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-10 transition-colors">
            <span className="text-2xl font-semibold text-[#1e3a5f]">Reservation</span>
            <span className="text-slate-300 text-2xl font-light">{">"}</span>
            <span className="text-2xl font-semibold text-[#3498db]">View Details</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Side: Dynamic Room Card */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 sticky top-10">
                <div className="h-64 w-full relative">
                  <Image src={selectedBooking.image} alt={selectedBooking.roomNumber} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#2ecc71] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Confirmed</span>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-bold text-slate-900">Room {selectedBooking.roomNumber}</h3>
                  <p className="text-slate-500 font-medium">{selectedBooking.roomType}</p>
                </div>
              </div>
            </div>

            {/* Right Side: Dynamic Information Display */}
            <div className="lg:col-span-8 space-y-10">
              <section>
                <div className="bg-[#3498db] text-white px-5 py-3 rounded-lg text-lg font-bold mb-6">Booking Details</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Check-in</label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">
                      <Calendar size={14} /> {selectedBooking.checkIn}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Check-out</label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">
                      <Calendar size={14} /> {selectedBooking.checkOut}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Duration</label>
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">
                      {selectedBooking.duration}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="bg-[#3498db] text-white px-5 py-3 rounded-lg text-lg font-bold mb-6">Personal Information</div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Seaman ID</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">{formData.seamanId}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label><div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">{formData.firstName}</div></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label><div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">{formData.lastName}</div></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Middle Name</label><div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">{formData.middleName}</div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</label><div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">{formData.contactNumber}</div></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label><div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-sm">{formData.email}</div></div>
                  </div>
                </div>
              </section>

              <section>
                <div className="bg-[#3498db] text-white px-5 py-3 rounded-lg text-lg font-bold mb-6">Documentation</div>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl shadow-sm bg-white">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#3498db]" size={24} />
                    <p className="font-bold text-slate-800 text-sm">ID_Verification.pdf</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#2ecc71] uppercase tracking-wider">Verified Document</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD LIST VIEW
  return (
    <div className="flex-1 p-12 bg-white min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">Reservation</h1>
        <p className="text-slate-500 font-medium">View and manage your upcoming and past bookings</p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("px-6 py-2 rounded-md text-sm font-semibold transition-all", activeTab === tab.id ? "bg-[#3498db] text-white shadow-sm" : "text-slate-500 hover:text-slate-800")}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Search by room..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#3498db] transition-all" 
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm">Loading reservations...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {displayBookings.map((booking) => (
            <div key={booking.id} className="flex items-center gap-6 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[#3498db]/30 transition-all">
              <div className="relative w-64 h-40 rounded-xl overflow-hidden shrink-0"><Image src={booking.image} alt="Room" fill className="object-cover" /></div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Room {booking.roomNumber}</h2>
                  <p className="text-slate-500 font-medium">{booking.roomType}</p>
                </div>
                <button 
                  onClick={() => { setSelectedBooking(booking); setView("booking"); }} 
                  className={cn(
                    "px-8 py-3 font-bold rounded-xl active:scale-95 transition-all",
                    activeTab === "new" ? "bg-[#3498db] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  View details
                </button>
              </div>
            </div>
          ))}
          {displayBookings.length === 0 && (
            <div className="text-center py-20 text-slate-400 italic font-medium">No {activeTab} bookings found.</div>
          )}
        </div>
      )}
    </div>
  );
}