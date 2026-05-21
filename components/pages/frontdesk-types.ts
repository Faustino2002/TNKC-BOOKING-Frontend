export type BookingType = "approved" | "requested" | "maintenance";

// ➕ ADDED: Detailed profile data contract that will eventually come from the backend
export interface GuestProfile {
  seamanId: string;
  rank: string;
  contactNumber: string;
  email: string;
}

export interface Booking {
  id: string;
  name: string;
  date: string; // ISO format: YYYY-MM-DD
  start: number; 
  end: number;   
  type: BookingType;
  isCheckIn?: boolean;
  isCheckOut?: boolean;
  // 🟢 SYNCED: Keeping your clean nested structure intact
  guestProfile?: GuestProfile; 
  // 🔌 ADDED: Optional stay duration metrics used inside the side drawer drawer layout
  duration?: string;
  checkOutDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  bedAssignment?: string;
}

export interface RoomData {
  room: string;
  type: string;
  floor: string;
  bookings: Booking[];
}

export interface WeekDay {
  fullDate: string;
  dayName: string;
  dateNum: number;
}

// 🟩 ADDED: Target contract structure used inside Frontdesk-Guestlist.tsx
export interface Guest {
  id: string;
  name: string;
  room: string;
  type: string;
  checkIn: string;
  status: string;
  seamanId?: string;
  rank?: string;
  contactNumber?: string;
  email?: string;
  duration?: string;
  checkOutDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  bedAssignment?: string;
}

export const getBookingStyles = (type: BookingType) => {
  switch (type) {
    case "approved": return "bg-[#1e3a8a] text-white border-none";
    case "requested": return "bg-[#fee2e2] text-slate-700 border border-red-200";
    case "maintenance": return "bg-[#f39c12] text-white border-none";
    default: return "bg-slate-200 text-slate-700";
  }
};

export const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  return `${hour}${i < 12 ? "AM" : "PM"}`;
});