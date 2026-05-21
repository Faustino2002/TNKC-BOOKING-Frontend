"use client";

import React, { useState } from "react";
import { Booking, HOURS } from "./frontdesk-types";
import { ChevronRight, ArrowUpDown, ArrowLeft, Wrench, IdCard, User, Star, Phone, Mail, Calendar, Clock, DoorOpen, LogIn, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface FrontdeskMonthlyDetailsProps {
  isVisible: boolean;
  onBack: () => void;
  selectedDayData: {
    dayNum: number;
    formattedDateStr: string;
    bookings: Booking[];
  } | null;
  getRoomDetailsForBooking: (bookingId: string) => { roomNumber: string; roomType: string };
  onCheckInClick?: (booking: Booking, roomNumber: string, roomType: string) => void;
  onCheckOutClick?: (booking: Booking, roomNumber: string, roomType: string) => void;
}

export function FrontdeskMonthlyDetails({
  isVisible,
  onBack,
  selectedDayData,
  getRoomDetailsForBooking,
  onCheckInClick,
  onCheckOutClick,
}: FrontdeskMonthlyDetailsProps) {
  
  // Local active drawer layer viewport states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<{ room: string; type: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Early return if component shouldn't be rendered down the component tree
  if (!isVisible || !selectedDayData) return null;

  // Filter bookings precisely into distinct functional structures
  const approvedDayBookings = selectedDayData.bookings.filter((b) => b.type === "approved") || [];
  const requestedDayBookings = selectedDayData.bookings.filter((b) => b.type === "requested") || [];
  const maintenanceBookings = selectedDayData.bookings.filter((b) => b.type === "maintenance") || [];

  // Local structural view button proxy callback
  const handleLocalBookingClick = (booking: Booking) => {
    const { roomNumber, roomType } = getRoomDetailsForBooking(booking.id);
    setSelectedBooking(booking);
    setSelectedRoom({ room: roomNumber, type: roomType });
    setIsDrawerOpen(true);
  };

  const getInitials = (name: string) => {
    if (!name) return "JD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Status Action Indicator Banner Component
  const StatusAlertBanner = ({ booking }: { booking: Booking }) => {
    if (booking.isCheckIn) {
      return (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 space-y-2 flex flex-col items-start w-full">
          <div className="flex items-center gap-2">
            <LogIn size={16} className="text-emerald-600" />
            <p className="text-xs font-bold uppercase tracking-wider">Check-In Today</p>
          </div>
          <p className="text-xs text-emerald-600 leading-normal">Guest {booking.name} is scheduled to check-in today.</p>
          <button 
            onClick={() => {
              setIsDrawerOpen(false);
              if (onCheckInClick && selectedRoom) onCheckInClick(booking, selectedRoom.room, selectedRoom.type);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 text-[10px] rounded transition-colors mt-1 shadow-sm"
          >
            Check-In Guest
          </button>
        </div>
      );
    }
    if (booking.isCheckOut) {
      return (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 space-y-2 flex flex-col items-start w-full">
          <div className="flex items-center gap-2">
            <LogOut size={16} className="text-rose-600" />
            <p className="text-xs font-bold uppercase tracking-wider">Check-Out Today</p>
          </div>
          <p className="text-xs text-rose-600 leading-normal">Guest {booking.name} is expected to check-out today.</p>
          <button 
            onClick={() => {
              setIsDrawerOpen(false);
              if (onCheckOutClick && selectedRoom) onCheckOutClick(booking, selectedRoom.room, selectedRoom.type);
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 text-[10px] rounded transition-colors mt-1 shadow-sm"
          >
            Check-Out Guest
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-slate-50/50 p-8 min-h-screen flex flex-col gap-6 animate-in fade-in duration-200">
      
      {/* Header Breadcrumbs with Inline Navigation Trigger Button */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-slate-400 text-xl font-medium">
          <button 
            onClick={onBack}
            className="hover:text-slate-600 transition-colors flex items-center gap-1.5 text-slate-400 font-medium"
          >
            <ArrowLeft size={18} className="mt-0.5" /> Dashboard
          </button>
          <ChevronRight size={16} className="mt-0.5" />
          <span className="text-slate-600 font-semibold">More Bookings</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mt-2">
          {selectedDayData.formattedDateStr} Bookings
        </h2>
      </div>

      {/* --- APPROVED BOOKINGS TABLE --- */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-base font-bold text-slate-800">Approved Bookings</h3>
          <button className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 font-medium">
            Sort by <ArrowUpDown size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/60">
                <th className="p-4 font-semibold text-slate-500">Room</th>
                <th className="p-4 font-semibold text-slate-500">Status</th>
                <th className="p-4 font-semibold text-slate-500">Guest Name</th>
                <th className="p-4 font-semibold text-slate-500">Check-in Date</th>
                <th className="p-4 font-semibold text-slate-500">Check-in Time</th>
                <th className="p-4 font-semibold text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {approvedDayBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">No approved bookings today.</td>
                </tr>
              ) : (
                approvedDayBookings.map((b) => {
                  const { roomNumber } = getRoomDetailsForBooking(b.id);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          {b.isCheckIn && <span className="text-rose-500 text-xs">🚩</span>}
                          {roomNumber}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#1e3a8a] text-white shadow-xs">
                          <span className="w-1 h-1 rounded-full bg-white" /> Approved
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-400 text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                            {getInitials(b.name)}
                          </div>
                          <span className="font-semibold text-slate-800">{b.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                        {new Date(b.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}
                      </td>
                      <td className="p-4 font-medium text-slate-600">{HOURS[b.start]}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleLocalBookingClick(b)}
                          className="px-3 py-1.5 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-md shadow-xs transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- REQUEST BOOKINGS TABLE --- */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-base font-bold text-slate-800">Request Bookings</h3>
          <button className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 font-medium">
            Sort by <ArrowUpDown size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/60">
                <th className="p-4 font-semibold text-slate-500">Room</th>
                <th className="p-4 font-semibold text-slate-500">Status</th>
                <th className="p-4 font-semibold text-slate-500">Guest Name</th>
                <th className="p-4 font-semibold text-slate-500">Check-in Date</th>
                <th className="p-4 font-semibold text-slate-500">Check-in Time</th>
                <th className="p-4 font-semibold text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {requestedDayBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">No pending requested bookings today.</td>
                </tr>
              ) : (
                requestedDayBookings.map((b) => {
                  const { roomNumber } = getRoomDetailsForBooking(b.id);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-800">{roomNumber}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#fce7f3] text-[#9d174d] border border-pink-200 shadow-xs">
                          <span className="w-1 h-1 rounded-full bg-[#9d174d] animate-pulse" /> Requested
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-400 text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                            {getInitials(b.name)}
                          </div>
                          <span className="font-semibold text-slate-800">{b.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                        {new Date(b.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}
                      </td>
                      <td className="p-4 font-medium text-slate-600">{HOURS[b.start]}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleLocalBookingClick(b)}
                          className="px-3 py-1.5 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-md shadow-xs transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MAINTENANCE TABLE --- */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-base font-bold text-slate-800">Maintenance Schedule</h3>
          <button className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 font-medium">
            Sort by <ArrowUpDown size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/60">
                <th className="p-4 font-semibold text-slate-500">Room</th>
                <th className="p-4 font-semibold text-slate-500">Status</th>
                <th className="p-4 font-semibold text-slate-500">Assignment</th>
                <th className="p-4 font-semibold text-slate-500">Date</th>
                <th className="p-4 font-semibold text-slate-500">Time Window</th>
                <th className="p-4 font-semibold text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {maintenanceBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">No maintenance scheduled today.</td>
                </tr>
              ) : (
                maintenanceBookings.map((b) => {
                  const { roomNumber } = getRoomDetailsForBooking(b.id);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-800">{roomNumber}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#f59e0b] text-white shadow-xs">
                          <span className="w-1 h-1 rounded-full bg-white animate-pulse" /> Maintenance
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        Room Maintenance Fix
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                        {new Date(b.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}
                      </td>
                      <td className="p-4 font-medium text-slate-600">{HOURS[b.start]}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleLocalBookingClick(b)}
                          className="px-3 py-1.5 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-md shadow-xs transition-colors"
                        >
                          View Ticket
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Close Action Container */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-all active:scale-[0.99] shadow-xs"
        >
          Back to Dashboard
        </button>
      </div>

      {/* --- INTEGRATED DRAWER SHEET DETAILS LAYER --- */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-md bg-white p-6 shadow-xl border-l border-slate-200 flex flex-col justify-between h-full">
          {selectedBooking && selectedRoom && (
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-6">
                <SheetHeader className="text-left border-b border-slate-100 pb-4">
                  <SheetTitle className="text-lg font-bold text-[#1e3a8a]">Booking Details</SheetTitle>
                </SheetHeader>

                {/* Conditional Banner Notification Actions for Check-in / Check-out targets */}
                <StatusAlertBanner booking={selectedBooking} />

                {selectedBooking.type === "maintenance" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Wrench size={14} />
                      <p className="text-[11px] uppercase font-bold tracking-wider">Maintenance Ticket</p>
                    </div>
                    <div className="bg-orange-50/60 border border-orange-100 p-4 rounded-xl flex gap-3 items-start">
                      <Wrench className="text-orange-500 mt-1 flex-none" size={18} />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Room Fix Requested</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Job Ticket assignment assigned by the operations team. Check with engineering before letting guests occupy room {selectedRoom.room}.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Guest Information</p>
                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex items-center gap-3">
                          <IdCard size={16} className="text-slate-400" />
                          <p className="font-medium text-slate-500">Seaman ID: <span className="font-bold text-slate-900 ml-1">{selectedBooking.guestProfile?.seamanId || "N/A"}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={16} className="text-slate-400" />
                          <p className="font-medium text-slate-500">Name: <span className="font-bold text-slate-900 ml-1">{selectedBooking.name}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Star size={16} className="text-slate-400" />
                          <p className="font-medium text-slate-500">Rank: <span className="font-bold text-slate-900 ml-1">{selectedBooking.guestProfile?.rank || "N/A"}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-slate-400" />
                          <p className="font-medium text-slate-500">Contact Number: <span className="font-bold text-slate-900 ml-1">{selectedBooking.guestProfile?.contactNumber || "N/A"}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-slate-400" />
                          <p className="font-medium text-slate-500">Email: <span className="font-bold text-slate-900 ml-1">{selectedBooking.guestProfile?.email || "N/A"}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Stay Details</p>
                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-slate-400" />
                          <p className="font-medium text-slate-500">Dates: <span className="font-bold text-slate-900 ml-1">{new Date(selectedBooking.date).toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: '2-digit' })}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-slate-400" />
                          <p className="font-medium text-slate-500">Time Window: <span className="font-bold text-slate-900 ml-1">{HOURS[selectedBooking.start]} – {HOURS[selectedBooking.end]}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DoorOpen size={16} className="text-slate-400" />
                          <p className="font-medium text-slate-500">Room assigned: <span className="font-bold text-slate-900 ml-1">Room {selectedRoom.room} ({selectedRoom.type})</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setIsDrawerOpen(false)} 
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}