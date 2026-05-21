"use client";

import React, { useState } from "react";
// Import shared configuration and model types
import { RoomData, HOURS, Booking } from "./frontdesk-types";
// UI Component Imports from your shadcn setup
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  DoorOpen, 
  Wrench, 
  User, 
  IdCard, 
  Star, 
  Phone, 
  Mail, 
  LogIn, 
  LogOut,
  AlertCircle,
  X 
} from "lucide-react";

interface FrontdeskDayViewProps {
  groupedData: Record<string, RoomData[]>;
  currentDayStr: string;
}

export default function FrontdeskDayView({ groupedData, currentDayStr }: FrontdeskDayViewProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<{ room: string; type: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);

  const handleBookingClick = (booking: Booking, roomNumber: string, roomType: string) => {
    setSelectedBooking(booking);
    setSelectedRoom({ room: roomNumber, type: roomType });
    setIsDrawerOpen(true);
  };

  const handleCheckInTrigger = () => {
    // 1. Hide the side drawer layer
    setIsDrawerOpen(false);
    // 2. Open the check-in confirmation pop-up
    setIsCheckInDialogOpen(true);
  };

  // Helper utility to apply colors strictly adhering to the design specifications legend
  const getCustomBookingStyles = (type: string) => {
    switch (type) {
      case "maintenance":
        return "bg-[#f59e0b] text-white border-none font-medium";
      case "requested":
        return "bg-[#fce7f3] text-[#9d174d] border-none font-normal";
      case "approved":
      default:
        return "bg-[#1e3a8a] text-white border-none font-medium";
    }
  };

  // Drawer banner utility component for check-in/out alerts
  const StatusAlertBanner = ({ booking }: { booking: Booking }) => {
    if (booking.isCheckIn) {
      return (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 space-y-2 flex flex-col items-start">
          <div className="flex items-center gap-2">
            <LogIn size={16} className="text-emerald-600" />
            <p className="text-xs font-bold uppercase tracking-wider">Check-In Today</p>
          </div>
          <p className="text-xs text-emerald-600 leading-normal">
            Guest {booking.name} is scheduled to check-in today.
          </p>
          <button 
            onClick={handleCheckInTrigger}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 text-[10px] rounded transition-colors mt-1 shadow-sm"
          >
            Check-In Guest
          </button>
        </div>
      );
    }

    if (booking.isCheckOut) {
      return (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 space-y-2 flex flex-col items-start">
          <div className="flex items-center gap-2">
            <LogOut size={16} className="text-rose-600" />
            <p className="text-xs font-bold uppercase tracking-wider">Check-Out Today</p>
          </div>
          <p className="text-xs text-rose-600 leading-normal">
            Guest {booking.name} is expected to check-out today.
          </p>
          <button className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 text-[10px] rounded transition-colors mt-1 shadow-sm">
            Check-Out Guest
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* 📊 MAIN TIMELINE GRAPH BLOCK */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse table-fixed min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th scope="col" className="w-20 p-3 text-xs font-semibold text-slate-500 text-left border-r border-slate-100">
                Room #
              </th>
              <th scope="col" className="w-20 p-3 text-xs font-semibold text-slate-500 text-left border-r border-slate-100">
                Type
              </th>
              <th scope="col" className="p-0 font-normal">
                <div className="grid grid-cols-24">
                  {HOURS.map((h, i) => (
                    <div 
                      key={i} 
                      className="text-[10px] py-2 border-r border-slate-100 text-center font-medium text-slate-400 last:border-r-0"
                    >
                      {h}
                    </div>
                  ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData).map(([floor, floorRooms]) => (
              <React.Fragment key={floor}>
                {/* Floor Section Header Divider */}
                <tr className="bg-[#475569] text-white">
                  <td colSpan={3} className="px-3 py-1.5 font-bold text-xs uppercase tracking-wider">
                    {floor}
                  </td>
                </tr>
                {/* Floor Specific Rooms Map */}
                {floorRooms.map((room) => (
                  <tr key={room.room} className="border-b border-slate-100 hover:bg-slate-50/50 h-12">
                    <td className="p-2 border-r border-slate-100 text-center font-semibold text-xs text-slate-700">{room.room}</td>
                    <td className="p-2 border-r border-slate-100 text-center text-slate-400 text-xs">{room.type}</td>
                    <td className="p-0 relative bg-white">
                      {/* Background Timeline Hour Grid Cells */}
                      <div className="grid h-full grid-cols-24 absolute inset-0 pointer-events-none">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="border-r border-slate-100 h-full last:border-r-0" />
                        ))}
                      </div>

                      {/* Foreground Interactive Booking Blocks Layer */}
                      <div className="grid h-full grid-cols-24 relative w-full items-center">
                        {room.bookings.map((b) => {
                          if (b.date !== currentDayStr) return null;
                          return (
                            <button
                              key={b.id}
                              onClick={() => handleBookingClick(b, room.room, room.type)}
                              style={{ gridColumn: `${b.start + 1} / span ${b.end - b.start}` }}
                              className={`mx-1 h-7 rounded relative flex items-center justify-between px-2 text-[11px] shadow-xs z-10 transition-all hover:brightness-95 active:scale-[0.99] text-left overflow-hidden ${getCustomBookingStyles(b.type)}`}
                            >
                              {/* 🟢 Check-in edge indicator pill strip */}
                              {b.isCheckIn && (
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#10b981]" />
                              )}

                              {/* Text description with icon layouts */}
                              <div className="flex items-center gap-1.5 truncate w-full pl-0.5">
                                {b.type === "maintenance" ? (
                                  <>
                                    <Wrench size={12} className="text-white flex-none" />
                                    <span className="truncate font-semibold">Maintenance</span>
                                  </>
                                ) : (
                                  <span className="truncate">{b.name}</span>
                                )}
                              </div>

                              {/* 🔴 Check-out edge indicator pill strip */}
                              {b.isCheckOut && (
                                <span className="absolute right-0 top-0 bottom-0 w-1 bg-[#ef4444]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧭 FOOTER LEGEND ROW COMPONENT */}
      <div className="flex flex-wrap items-center gap-6 px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-600 font-medium select-none">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Legend:</span>
        
        <div className="flex items-center gap-2">
          <span className="w-5 h-4 bg-[#1e3a8a] rounded-sm shadow-2xs" />
          <span>Approved Bookings</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-4 bg-[#fce7f3] border border-pink-200 rounded-sm shadow-2xs" />
          <span>Requested Bookings</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-5 h-4 bg-[#f59e0b] rounded-sm shadow-2xs" />
          <span>Maintenance</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#10b981] rounded-xs" />
          <span>Check-in indicator</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#ef4444] rounded-xs" />
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
                          <p className="font-semibold text-slate-500">Room assigned: <span className="font-bold text-slate-900 ml-1">Room {selectedRoom.room} ({selectedRoom.type})</span></p>
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

      {/* --- CONFIRM CHECK-IN POP-UP DIALOG LAYER --- */}
      <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
        <DialogContent className="max-w-[420px] rounded-xl bg-white p-5 shadow-xl border border-slate-100 focus:outline-hidden gap-0">
          <button 
            onClick={() => setIsCheckInDialogOpen(false)}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 flex-none mt-0.5">
              <AlertCircle size={22} className="stroke-[2.5]" />
            </div>

            <div className="space-y-1.5 flex-1 pr-4">
              <DialogHeader className="text-left">
                <DialogTitle className="text-base font-extrabold text-[#10b981] tracking-wide">
                  Confirm check-in
                </DialogTitle>
              </DialogHeader>
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                Are you sure you want to confirm {selectedBooking?.name || "the guest"}'s check-in time?
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 mt-2">
            <button
              onClick={() => setIsCheckInDialogOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-all shadow-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsCheckInDialogOpen(false);
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-[#388e3c] hover:bg-[#2e7d32] rounded-md transition-all shadow-xs"
            >
              Continue
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}