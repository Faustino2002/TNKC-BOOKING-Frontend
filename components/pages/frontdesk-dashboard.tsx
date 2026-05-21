"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, X, AlertCircle, CalendarRange, History } from "lucide-react";

// Clean modular component view imports
import FrontdeskDayView from "./Frontdesk-DayView";
import FrontdeskWeeklyView from "./Frontdesk-WeeklyView";
import FrontdeskMonthlyView from "./Frontdesk-MonthlyView";
import FrontdeskHistoryView from "./Frontdesk-HistoryView"; // Import separated history view component
import FrontdeskNotification from "./frontdesk-notification"; 

// Shared configuration types
import { RoomData, WeekDay, Booking, HOURS } from "./frontdesk-types";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  guestName: string;
  actionType: "check-in" | "check-out";
}

function ConfirmationModal({ isOpen, onClose, onConfirm, guestName, actionType }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-100 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <X size={16} />
        </button>
        
        <div className="flex gap-4 items-start mt-2">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-slate-800 capitalize">
              Confirm {actionType}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to confirm {guestName}’s {actionType} time?
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

interface ApprovedStayModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  roomNumber: string;
  roomType: string;
}

function ApprovedStayModal({ isOpen, onClose, booking, roomNumber, roomType }: ApprovedStayModalProps) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-100 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <X size={16} />
        </button>
        
        <div className="flex gap-4 items-start mt-2">
          <div className="p-2.5 bg-blue-50 text-[#1e3a8a] rounded-lg">
            <CalendarRange size={20} />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-bold text-slate-800">
              Approved Stay Action
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Managing current selection details for <strong>{booking.name}</strong>.
            </p>
            <div className="mt-2 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] text-slate-600 space-y-1">
              <p><strong>Assigned:</strong> Room {roomNumber} ({roomType})</p>
              <p><strong>Timeline:</strong> {HOURS[booking.start]} – {HOURS[booking.end]}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onClose();
            }}
            className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1a337a] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Edit Stay
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FrontdeskDashboardClient() {
  const [view, setView] = useState<"Day" | "Week" | "Month" | "History">("Day");
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeModal, setActiveModal] = useState<{
    type: "check-in" | "check-out";
    booking: Booking;
    roomNumber: string;
  } | null>(null);

  const [approvedModal, setApprovedModal] = useState<{
    booking: Booking;
    roomNumber: string;
    roomType: string;
  } | null>(null);

  const today = useMemo(() => new Date(), []);
  const currentDayStr = today.toISOString().split('T')[0];
  const currentMonthYear = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const weekDays = useMemo<WeekDay[]>(() => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return {
        fullDate: day.toISOString().split('T')[0],
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: day.getDate(),
      };
    });
  }, [today]);

  const groupedData = useMemo(() => {
    return rooms.reduce((acc, room) => {
      if (!acc[room.floor]) acc[room.floor] = [];
      acc[room.floor].push(room);
      return acc;
    }, {} as Record<string, RoomData[]>);
  }, [rooms]);

  const transformedNotifications = useMemo(() => {
    return rooms.flatMap((room) => 
      room.bookings
        .filter((booking) => booking.date === currentDayStr)
        .flatMap((booking) => {
          const list: any[] = [];
          
          if (booking.type === "maintenance") {
            list.push({
              id: booking.id,
              type: "maintenance",
              description: `Room ${room.room} is marked under maintenance "Cleaning"`,
              createdAt: new Date().toISOString(),
              isUnread: true,
              avatarUrl: null,
              metadata: { roomId: room.room, bookingId: booking.id }
            });
            return list; 
          }

          if (booking.type === "requested") {
            list.push({
              id: `${booking.id}-req`,
              type: "requested",
              description: `Pending request from ${booking.name} for Room ${room.room}`,
              createdAt: new Date().toISOString(),
              isUnread: true,
              avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
              metadata: { roomId: room.room, bookingId: booking.id }
            });
          }
          
          if (booking.isCheckIn) {
            list.push({
              id: `${booking.id}-in`,
              type: "checkin",
              description: `Guest ${booking.name} is arriving today`,
              createdAt: new Date().toISOString(),
              isUnread: true,
              avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
              metadata: { roomId: room.room, bookingId: booking.id }
            });
          }
          
          if (booking.isCheckOut) {
            list.push({
              id: `${booking.id}-out`,
              type: "checkout",
              description: `Guest ${booking.name} is checking out today`,
              createdAt: new Date().toISOString(),
              isUnread: true,
              avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
              metadata: { roomId: room.room, bookingId: booking.id }
            });
          }
          
          return list;
        })
    );
  }, [rooms, currentDayStr]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowDayStr = tomorrow.toISOString().split('T')[0];
      
      setRooms([
        { 
          room: "202", 
          floor: "TNKC Floor 2", 
          type: "Single", 
          bookings: [
            { 
              id: "000000000001", 
              name: "John L. Doe", 
              date: currentDayStr, 
              start: 5, 
              end: 11, 
              type: "approved", 
              isCheckIn: true,
              isCheckOut: false,
              guestProfile: {
                seamanId: "00000000445002",
                rank: "Chief Cadet",
                contactNumber: "0947181716689",
                email: "john.doe@gmail.com"
              }
            },
            {
              id: "000000000004",
              name: "Jane M. Smith",
              date: tomorrowDayStr,
              start: 12,
              end: 18,
              type: "requested",
              isCheckIn: false,
              isCheckOut: false,
              guestProfile: {
                seamanId: "00000000981123",
                rank: "Third Officer",
                contactNumber: "0915223344551",
                email: "jane.smith@yahoo.com"
              }
            },
            {
              id: "000000000088",
              name: "Past Guest Alpha",
              date: "2026-04-15",
              start: 8,
              end: 16,
              type: "approved",
              isCheckIn: false,
              isCheckOut: false
            }
          ] 
        },
        { 
          room: "303", 
          floor: "TNKC Floor 3", 
          type: "Single", 
          bookings: [
            { 
              id: "000000000003", 
              name: "John L. Doe", 
              date: currentDayStr, 
              start: 8, 
              end: 14, 
              type: "maintenance" 
            },
            {
              id: "000000000005",
              name: "Bob A. Taylor",
              date: currentDayStr,
              start: 15,
              end: 21,
              type: "requested",
              isCheckIn: false,
              isCheckOut: false,
              guestProfile: {
                seamanId: "00000000774321",
                rank: "Deck Cadet",
                contactNumber: "0917888992233",
                email: "bob.taylor@hotmail.com"
              }
            },
            {
              id: "000000000099",
              name: "Past Guest Beta",
              date: "2026-04-20",
              start: 10,
              end: 20,
              type: "requested",
              isCheckIn: false,
              isCheckOut: false
            }
          ] 
        },
        {
          room: "402",
          floor: "TNKC Floor 4",
          type: "Suite",
          bookings: [
            {
              id: "000000000002",
              name: "Marcus V. Aurelius",
              date: currentDayStr,
              start: 0,
              end: 4,
              type: "approved",
              isCheckIn: false,
              isCheckOut: true,
              guestProfile: {
                seamanId: "00000000112233",
                rank: "Captain",
                contactNumber: "0918999887766",
                email: "marcus.aurelius@empire.com"
              }
            }
          ]
        }
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, [currentDayStr, today]);

  const handleConfirmAction = () => {
    if (!activeModal) return;
    console.log(`Confirmed ${activeModal.type} for ${activeModal.booking.name} in Room ${activeModal.roomNumber}`);
    setActiveModal(null);
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[32px] font-bold text-[#1e3a8a]">Dashboard</h1>
        
        <FrontdeskNotification 
          notifications={transformedNotifications} 
          onMarkAsRead={(id) => console.log(`Notification ID ${id} marked as read.`)}
          onMarkAllAsRead={() => console.log("All notifications marked as read.")}
        />
      </div>

      {/* Control Bar */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {view !== "History" ? (
            <>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-slate-50 rounded-md"><ChevronLeft size={16} /></button>
                <span className="text-sm font-medium">Today</span>
                <button className="p-1 hover:bg-slate-50 rounded-md"><ChevronRight size={16} /></button>
              </div>
              <span className="font-bold text-lg whitespace-nowrap">{currentMonthYear}</span>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <History size={18} className="text-[#1e3a8a]" />
              <span className="font-bold text-lg text-slate-700">Historical Logs</span>
            </div>
          )}
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg self-end sm:self-auto">
          {(["Day", "Week", "Month", "History"] as const).map((v) => (
            <button 
              key={v} 
              onClick={() => setView(v)} 
              className={`px-4 py-1 text-xs font-semibold rounded-md transition-all ${
                view === v ? "bg-white shadow-sm text-[#1e3a8a]" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {view === "Day" && <FrontdeskDayView groupedData={groupedData} currentDayStr={currentDayStr} />}
          
          {view === "Week" && (
            <FrontdeskWeeklyView 
              groupedData={groupedData} 
              weekDays={weekDays} 
              onCheckInClick={(booking, roomNum) => setActiveModal({ type: "check-in", booking, roomNumber: roomNum })}
              onCheckOutClick={(booking, roomNum) => setActiveModal({ type: "check-out", booking, roomNumber: roomNum })}
              onApprovedBookingClick={(booking, roomNum) => setApprovedModal({ booking, roomNumber: roomNum, roomType: "N/A" })}
            />
          )}
          
          {view === "Month" && (
            <FrontdeskMonthlyView 
              rooms={rooms} 
              today={today} 
              onCheckInClick={(booking, roomNum, roomType) => setActiveModal({ type: "check-in", booking, roomNumber: roomNum })}
              onCheckOutClick={(booking, roomNum, roomType) => setActiveModal({ type: "check-out", booking, roomNumber: roomNum })}
              onApprovedBookingClick={(booking, roomNum, roomType) => setApprovedModal({ booking, roomNumber: roomNum, roomType })}
            />
          )}

          {/* 📜 Render clean extracted history layout view file */}
          {view === "History" && <FrontdeskHistoryView rooms={rooms} />}
        </div>
      )}

      {/* Modals */}
      <ConfirmationModal 
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        onConfirm={handleConfirmAction}
        guestName={activeModal?.booking.name || ""}
        actionType={activeModal?.type || "check-in"}
      />

      <ApprovedStayModal 
        isOpen={approvedModal !== null}
        onClose={() => setApprovedModal(null)}
        booking={approvedModal?.booking || null}
        roomNumber={approvedModal?.roomNumber || "N/A"}
        roomType={approvedModal?.roomType || "Unknown"}
      />
    </div>
  );
}