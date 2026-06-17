"use client";

import React, { useState } from "react";
import { RoomData, Booking, HOURS } from "./frontdesk-types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar, Clock, DoorOpen, Wrench, User, IdCard, Star, Phone, Mail, LogIn, LogOut } from "lucide-react";
// Updated to interact with your standalone layout element safely
import { FrontdeskMonthlyDetails } from "./Frontdesk-MonthlyDetails";

interface FrontdeskMonthlyViewProps {
  rooms: RoomData[];
  today: Date;
  onCheckInClick?: (booking: Booking, roomNumber: string, roomType: string) => void;
  onCheckOutClick?: (booking: Booking, roomNumber: string, roomType: string) => void;
  onApprovedBookingClick?: (booking: Booking, roomNumber: string, roomType: string) => void;
}

export default function FrontdeskMonthlyView({ 
  rooms, 
  today,
  onCheckInClick,
  onCheckOutClick,
  onApprovedBookingClick
}: FrontdeskMonthlyViewProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<{ room: string; type: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isDayViewOpen, setIsDayViewOpen] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState<{ dayNum: number; formattedDateStr: string; bookings: Booking[] } | null>(null);

  const getRoomDetailsForBooking = (bookingId: string) => {
    const parentRoom = rooms.find((room) =>
      room.bookings.some((b) => b.id === bookingId)
    );
    return {
      roomNumber: parentRoom ? parentRoom.room : "N/A",
      roomType: parentRoom ? parentRoom.type : "Unknown"
    };
  };

  const handleBookingClick = (booking: Booking) => {
    const { roomNumber, roomType } = getRoomDetailsForBooking(booking.id);

    if (booking.type === "approved" && !booking.isCheckIn && !booking.isCheckOut && onApprovedBookingClick) {
      onApprovedBookingClick(booking, roomNumber, roomType);
      return;
    }

    setSelectedBooking(booking);
    setSelectedRoom({
      room: roomNumber,
      type: roomType,
    });
    setIsDrawerOpen(true);
  };

  const handleSeeMoreClick = (dayNum: number, bookings: Booking[]) => {
    const displayDate = new Date(today.getFullYear(), today.getMonth(), dayNum);
    const formattedDateStr = displayDate.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric"
    });
    
    setSelectedDayData({ dayNum, formattedDateStr, bookings });
    setIsDayViewOpen(true);
  };

  const allBookings = rooms.flatMap(room => room.bookings);
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const getCustomBookingStyles = (type: string) => {
    switch (type) {
      case "maintenance":
        return "bg-[#f59e0b] text-white border-none font-semibold";
      case "requested":
        return "bg-[#fce7f3] text-[#9d174d] border-none font-normal";
      case "approved":
      default:
        return "bg-[#1e3a8a] text-white border-none font-semibold";
    }
  };

  const StatusAlertBanner = ({ booking }: { booking: Booking }) => {
    if (booking.isCheckIn) {
      return (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 space-y-2 flex flex-col items-start w-full">
          <div className="flex items-center gap-2">
            <LogIn size={16} className="text-emerald-600" />
            <p className="text-xs font-bold uppercase tracking-wider">Check-In Today</p>
          </div>
          <p className="text-xs text-emerald-600 leading-normal">
            Guest {booking.name} is scheduled to check-in today.
          </p>
          <button 
            onClick={() => {
              setIsDrawerOpen(false);
              setIsDayViewOpen(false);
              if (onCheckInClick && selectedRoom) {
                onCheckInClick(booking, selectedRoom.room, selectedRoom.type);
              }
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
          <p className="text-xs text-rose-600 leading-normal">
            Guest {booking.name} is expected to check-out today.
          </p>
          <button 
            onClick={() => {
              setIsDrawerOpen(false);
              setIsDayViewOpen(false);
              if (onCheckOutClick && selectedRoom) {
                onCheckOutClick(booking, selectedRoom.room, selectedRoom.type);
              }
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
    <div className="flex flex-col w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      
      {/* 🔀 CONDITIONAL SCREEN RENDERING PANEL */}
      {isDayViewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50">
          <FrontdeskMonthlyDetails 
            isVisible={isDayViewOpen}
            onBack={() => setIsDayViewOpen(false)}
            selectedDayData={selectedDayData}
            getRoomDetailsForBooking={getRoomDetailsForBooking}
            onCheckInClick={(booking, roomNum, roomType) => {
              setIsDayViewOpen(false);
              if (onCheckInClick) onCheckInClick(booking, roomNum, roomType);
            }}
            onCheckOutClick={(booking, roomNum, roomType) => {
              setIsDayViewOpen(false);
              if (onCheckOutClick) onCheckOutClick(booking, roomNum, roomType);
            }}
          />
        </div>
      )}

      {/* 🗓️ MONTH GRID CONTAINER */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day of the week Header row */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-white">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, idx) => (
              <div key={idx} className="p-3 text-center text-xs font-medium text-slate-400 border-r border-slate-100 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Block Grid */}
          <div className="grid grid-cols-7 auto-rows-[140px] bg-slate-100 gap-[1px]">
            {Array.from({ length: 35 }, (_, i) => {
              const dayNumber = i - firstDayOfMonth + 1; 
              const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
              
              const dayBookings = allBookings.filter(b => {
                const bDate = new Date(b.date);
                return isValidDay && bDate.getDate() === dayNumber && bDate.getMonth() === today.getMonth();
              });
              
              const isToday = isValidDay && dayNumber === today.getDate();
              
              const hasOverflow = dayBookings.length > 3;
              const visibleBookings = hasOverflow ? dayBookings.slice(0, 2) : dayBookings;

              return (
                <div key={i} className={`p-2 flex flex-col justify-between ${!isValidDay ? "bg-slate-50/70" : "bg-white"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    {isValidDay ? (
                      isToday ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1e3a8a] text-[11px] font-bold text-white">
                          {dayNumber}
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          {dayNumber}
                        </span>
                      )
                    ) : (
                      <span />
                    )}
                  </div>

                  <div className="flex flex-col gap-1 overflow-hidden flex-1 max-h-[95px] pr-0.5">
                    {visibleBookings.map(b => (
                      <button 
                        key={b.id} 
                        onClick={() => handleBookingClick(b)}
                        className={`h-6 min-h-[24px] px-1.5 rounded relative flex items-center justify-between text-[11px] shadow-xs transition-all hover:brightness-95 active:scale-[0.99] text-left overflow-hidden ${getCustomBookingStyles(b.type)}`}
                      >
                        {b.isCheckIn && (
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#10b981] rounded-full z-20" />
                        )}

                        <div className={`flex items-center gap-1 truncate w-full ${b.isCheckIn ? "pl-3" : "pl-0.5"}`}>
                          {b.type === "maintenance" ? (
                            <>
                              <Wrench size={11} className="text-white flex-none" />
                              <span className="truncate">Maintenance</span>
                            </>
                          ) : (
                            <span className="truncate">{b.name}</span>
                          )}
                        </div>

                        {b.isCheckOut && (
                          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#ef4444] rounded-full z-20" />
                        )}
                      </button>
                    ))}

                    {hasOverflow && (
                      <button
                        onClick={() => handleSeeMoreClick(dayNumber, dayBookings)}
                        className="h-6 min-h-[24px] px-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-center font-bold text-[10px] transition-all active:scale-[0.98]"
                      >
                        + {dayBookings.length - 2} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🧭 STATUS LEGEND BOTTOM FOOTER */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-600 font-medium select-none">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Legend:</span>
        
        <div className="flex items-center gap-2">
          <span className="w-5 h-4 bg-[#1e3a8a] rounded-sm" />
          <span>Approved Bookings</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-4 bg-[#fce7f3] border border-pink-200 rounded-sm" />
          <span>Requested Bookings</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-4 bg-[#f59e0b] rounded-sm" />
          <span>Maintenance</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full" />
          <span>Check-in indicator</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#ef4444] rounded-full" />
          <span>Check-out indicator</span>
        </div>
      </div>

      {/* --- SIDE DETAILS DRAWER LAYER --- */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-md bg-white p-6 shadow-xl border-l border-slate-200 flex flex-col justify-between h-full">
          {selectedBooking && selectedRoom && (
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-6">
                <SheetHeader className="text-left border-b border-slate-100 pb-4">
                  <SheetTitle className="text-lg font-bold text-[#1e3a8a]">Booking Details</SheetTitle>
                </SheetHeader>

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
                          <IdCard size={16} className="text-slate-400 flex-none" />
                          <p className="font-medium text-slate-500">Seaman ID: <span className="font-bold text-slate-900 ml-1">{selectedBooking.guestProfile?.seamanId || "N/A"}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={16} className="text-slate-400 flex-none" />
                          <p className="font-medium text-slate-500">Name: <span className="font-bold text-slate-900 ml-1">{selectedBooking.name}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Star size={16} className="text-slate-400 flex-none" />
                          <p className="font-medium text-slate-500">Rank: <span className="font-bold text-slate-900 ml-1">{selectedBooking.guestProfile?.rank || "N/A"}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-slate-400 flex-none" />
                          <p className="font-medium text-slate-500">Contact Number: <span className="font-bold text-slate-900 ml-1">{selectedBooking.guestProfile?.contactNumber || "N/A"}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-slate-400 flex-none" />
                          <p className="font-medium text-slate-500">Email: <span className="font-bold text-slate-900 ml-1">{selectedBooking.guestProfile?.email || "N/A"}</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Stay Details</p>
                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-slate-400 flex-none" />
                          <p className="font-medium text-slate-500">Dates: <span className="font-bold text-slate-900 ml-1">{new Date(selectedBooking.date).toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: '2-digit' })} – {new Date(selectedBooking.date).toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: '2-digit' })}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-slate-400 flex-none" />
                          <p className="font-medium text-slate-500">Time Window: <span className="font-bold text-slate-900 ml-1">{HOURS[selectedBooking.start]} – {HOURS[selectedBooking.end]}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <DoorOpen size={16} className="text-slate-400 flex-none" />
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
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors text-center"
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