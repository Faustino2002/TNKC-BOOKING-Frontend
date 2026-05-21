"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, DoorOpen, ChevronDown, Eye, CheckCircle, XCircle, AlertCircle, X, Calendar, Clock, CreditCard, User, Mail, Phone, Award } from "lucide-react";
import { RoomData, Guest } from "./frontdesk-types";

interface FrontdeskGuestlistProps {
  rooms?: RoomData[];
  directGuestsList?: Guest[];
}

export function FrontdeskGuestlist({ rooms = [], directGuestsList }: FrontdeskGuestlistProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 🏪 Component UI Dialog States
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | null;
    guest: Guest | null;
  }>({ isOpen: false, type: null, guest: null });

  // Close active dropdowns when clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔄 Prioritize direct backend array override or fallback to filtering the dashboard live state
  const guests: Guest[] = directGuestsList || rooms.flatMap((room) =>
    room.bookings
      .filter((booking) => booking.type === "requested")
      .map((booking) => {
        return {
          id: booking.id,
          name: booking.name,
          room: room.room,
          type: room.type,
          checkIn: booking.date,
          status: "Pending",
          // 🟢 FIXED: Extract values via your nested guestProfile type structure safely
          seamanId: booking.guestProfile?.seamanId || "000000000445002",
          rank: booking.guestProfile?.rank || "Chief Cadet",
          contactNumber: booking.guestProfile?.contactNumber || "0947181716689",
          email: booking.guestProfile?.email || `${booking.name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
          duration: booking.duration || "3 days",
          checkOutDate: booking.checkOutDate || "2026-04-09",
          checkInTime: booking.checkInTime || "11:00 AM",
          checkOutTime: booking.checkOutTime || "4:00 PM",
          bedAssignment: booking.bedAssignment || `${room.room} - B1`
        };
      })
  );

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.room.includes(searchQuery)
  );

  // 🛠️ Action Handlers (Ready for your backend dev to hook up database API calls)
  const openConfirmation = (type: "approve" | "reject", guest: Guest) => {
    setConfirmationModal({ isOpen: true, type, guest });
    setActiveDropdown(null);
  };

  const executeAction = () => {
    if (!confirmationModal.guest || !confirmationModal.type) return;
    
    if (confirmationModal.type === "approve") {
      console.log("DATABASE COMMAND: Approve Booking ID ->", confirmationModal.guest.id);
    } else {
      console.log("DATABASE COMMAND: Reject Booking ID ->", confirmationModal.guest.id);
    }

    // Reset modals and drawers after saving
    setConfirmationModal({ isOpen: false, type: null, guest: null });
    setIsDrawerOpen(false);
  };

  return (
    <div className="w-full flex flex-col bg-transparent font-sans text-slate-900 p-6 relative min-h-screen">
      
      {/* TOOLBAR SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search pending requests..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* GUEST TABLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Guest</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Requested Room</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Target Check-In</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-sm text-slate-400 font-medium">
                    No pending room requests found.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                          {guest.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{guest.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{guest.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DoorOpen size={16} className="text-slate-400" />
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Room {guest.room}</p>
                          <p className="text-[11px] text-slate-400">{guest.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {guest.checkIn}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border bg-rose-50 text-rose-600 border-rose-100">
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <div className="inline-block text-left" ref={activeDropdown === guest.id ? dropdownRef : null}>
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === guest.id ? null : guest.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-all shadow-sm"
                        >
                          Manage
                          <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === guest.id ? "rotate-180" : ""}`} />
                        </button>

                        {activeDropdown === guest.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-40 py-1 divide-y divide-slate-50 animate-in fade-in slide-in-from-top-1 duration-150">
                            <button 
                              onClick={() => { setSelectedGuest(guest); setIsDrawerOpen(true); setActiveDropdown(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                            >
                              <Eye size={14} className="text-slate-400" /> View Details
                            </button>
                            <button 
                              onClick={() => openConfirmation("approve", guest)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-emerald-600 hover:bg-emerald-50/50 font-semibold transition-colors"
                            >
                              <CheckCircle size={14} className="text-emerald-500" /> Approve
                            </button>
                            <button 
                              onClick={() => openConfirmation("reject", guest)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50/50 font-semibold transition-colors"
                            >
                              <XCircle size={14} className="text-rose-500" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1️⃣ POPUP MODAL: APPROVE / REJECT CONFIRMATION */}
      {confirmationModal.isOpen && confirmationModal.guest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setConfirmationModal({ isOpen: false, type: null, guest: null })}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
            >
              <X size={18} />
            </button>
            
            <div className="flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${confirmationModal.type === "approve" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 capitalize">
                  {confirmationModal.type} Book Request
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Are you sure you want to {confirmationModal.type} <span className="font-semibold text-slate-800">{confirmationModal.guest.name}</span> booking request?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button 
                onClick={() => setConfirmationModal({ isOpen: false, type: null, guest: null })}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={executeAction}
                className={`px-4 py-2 text-white rounded-lg text-sm font-semibold shadow-sm transition-all ${confirmationModal.type === "approve" ? "bg-blue-600 hover:bg-blue-700" : "bg-rose-600 hover:bg-rose-700"}`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2️⃣ DRAWER MODAL: VIEW BOOKING DETAILS */}
      {isDrawerOpen && selectedGuest && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-100 animate-in slide-in-from-right duration-300 overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#1e3a8a]">View Booking Details</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Needs Approval Banner */}
            <div className="mx-5 mt-4 p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-center gap-3">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-800">Needs Approval</p>
                <p className="text-[11px] text-rose-600/90 font-medium">Approve {selectedGuest.name}&apos;s booking request.</p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col gap-6">
              {/* Status Section */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Status</span>
                <span className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 rounded-full">
                  {selectedGuest.status}
                </span>
              </div>

              {/* Guest Information Segment */}
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                  <span className="text-xs font-bold text-[#1e3a8a] tracking-wide uppercase">Guest Information</span>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-2"><CreditCard size={14} /> Seaman ID</span>
                    <span className="font-bold text-slate-800">{selectedGuest.seamanId}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-2"><User size={14} /> Name</span>
                    <span className="font-bold text-slate-800">{selectedGuest.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-2"><Award size={14} /> Rank</span>
                    <span className="font-bold text-slate-800">{selectedGuest.rank}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-2"><Phone size={14} /> Contact Number</span>
                    <span className="font-bold text-slate-800">{selectedGuest.contactNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-2"><Mail size={14} /> Email</span>
                    <span className="font-bold text-slate-800">{selectedGuest.email}</span>
                  </div>
                </div>
              </div>

              {/* Stay Details Segment */}
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                  <span className="text-xs font-bold text-[#1e3a8a] tracking-wide uppercase">Stay Details</span>
                </div>
                
                {/* Responsive Date-Time Inputs Preview Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold block mb-1">Check-in Date</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                      <Calendar size={14} className="text-slate-400" /> {selectedGuest.checkIn}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold block mb-1">Check-in Time</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                      <Clock size={14} className="text-slate-400" /> {selectedGuest.checkInTime}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold block mb-1">Check-out Date</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                      <Calendar size={14} className="text-slate-400" /> {selectedGuest.checkOutDate}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold block mb-1">Check-out Time</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                      <Clock size={14} className="text-slate-400" /> {selectedGuest.checkOutTime}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Duration</span>
                    <span className="font-bold text-slate-800">{selectedGuest.duration}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Room Number</span>
                    <span className="font-bold text-slate-800">{selectedGuest.room}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Bed Assignment</span>
                    <span className="font-bold text-slate-800">{selectedGuest.bedAssignment}</span>
                  </div>
                </div>
              </div>
            </div>

           

          </div>
        </div>
      )}

    </div>
  );
}