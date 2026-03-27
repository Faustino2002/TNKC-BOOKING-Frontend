"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronRight, User, Ship, BookOpen, History, 
  Calendar, Clock, Bed, ShieldCheck, Mail, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- MOCK DATABASE ---
const MOCK_CREW_DB = [
  {
    id: "2022142879",
    firstName: "John",
    middleName: "Lars",
    lastName: "Doe",
    rank: "Chief Officer",
    seamanId: "000000000125",
    vessel: "MV Pacific Star",
    email: "john.doe@gmail.com",
    contact: "0987654321",
    status: "Confirmed",
    governmentIdType: "passport", // Added for the Select component
  },
  {
    id: "2022142880",
    firstName: "Jane",
    middleName: "Anne",
    lastName: "Smith",
    rank: "Cadet",
    seamanId: "000000000999",
    vessel: "MV Atlantic Sky",
    email: "jane.smith@gmail.com",
    contact: "0912345678",
    status: "Pending",
    governmentIdType: "seaman_book",
  }
];

// ... (MOCK_CURRENT_BOOKING and MOCK_HISTORY remain the same)
const MOCK_CURRENT_BOOKING = {
  id: "TNCK - 2026 - 05 -789",
  date: "04/28/26",
  roomNumber: "Cabin A - 04",
  floor: "TNKC Floor 2",
  roomType: "Single",
  bedNumber: "Bed #1",
  capacity: "1 person",
  checkInDate: "06/01/26",
  checkInTime: "9:00 AM",
  checkOutDate: "06/01/26",
  checkOutTime: "9:00 AM",
  duration: "5 days and 4 nights",
  status: "Confirmed",
  source: "Self-Service Kiosk"
};

const MOCK_HISTORY = [
  {
    id: "TNCK - 2026 - 02 - 067",
    room: "Room A - 01",
    duration: "4 nights",
    checkIn: "2026-01-23",
    checkOut: "2026-01-26",
    status: "Completed"
  }
];

export default function CrewDetailsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guestId = searchParams.get("id");

  const [activeTab, setActiveTab] = useState<"profile" | "current" | "history">("profile");
  const [crewData, setCrewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const record = MOCK_CREW_DB.find(u => u.id === guestId);
      setCrewData(record || MOCK_CREW_DB[0]); 
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [guestId]);

  if (isLoading || !crewData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center animate-pulse text-[#1e3a5f] font-bold text-xl">
          Fetching crew data...
        </div>
      </div>
    );
  }

  const fullName = `${crewData.firstName} ${crewData.middleName} ${crewData.lastName}`;
  const initials = `${crewData.firstName[0]}${crewData.lastName[0]}`;

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* BREADCRUMBS */}
      <div className="flex items-center gap-2 mb-6">
        <h1 
          className="text-[#1e3a5f] font-bold text-4xl cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => router.push("/home/guest-list")}
        >
          Guestlist
        </h1>
        <ChevronRight size={28} className="text-gray-300 mx-2" />
        <span className="text-gray-400 text-3xl font-light">...</span>
        <ChevronRight size={28} className="text-gray-300 mx-2" />
        <span className="text-[#3498db] font-semibold text-3xl transition-all">
          {activeTab === "profile" ? "Profile" : activeTab === "current" ? "Booking" : "History"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT PROFILE CARD */}
        <div className="w-full lg:w-[280px] bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center sticky top-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-50 relative bg-[#1e3a5f] flex items-center justify-center text-white text-2xl font-bold uppercase shadow-inner">
             {initials}
          </div>
          <h2 className="text-xl font-bold text-[#1e3a5f] text-center line-clamp-1">{fullName}</h2>
          <p className="text-gray-400 text-xs font-medium mb-4">{crewData.rank}</p>
          
          <div className="flex items-center gap-3 mb-6">
              <span className={`text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${crewData.status === 'Confirmed' ? 'bg-[#2ecc71]' : 'bg-orange-400'}`}>
                Active
              </span>
              <div className="flex items-center gap-1 text-[10px] text-[#3498db] font-bold">
                <Ship size={12}/> <span className="text-gray-400 font-medium">{crewData.vessel}</span>
              </div>
          </div>
          
          <div className="w-full space-y-1">
            <SidebarBtn active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User size={18}/>} label="Profile" />
            <SidebarBtn active={activeTab === "current"} onClick={() => setActiveTab("current")} icon={<BookOpen size={18}/>} label="Current Booking" />
            <SidebarBtn active={activeTab === "history"} onClick={() => setActiveTab("history")} icon={<History size={18}/>} label="Booking History" />
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 w-full transition-all duration-300">
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 space-y-px">
              
              {/* 1. Personal Information */}
              <section className="p-8">
                <div className="bg-[#3498db] text-white px-6 py-2.5 rounded-lg text-lg font-medium mb-6">Personal Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="Crew ID" value={crewData.id} disabled />
                  <FormGroup label="Seaman ID" value={crewData.seamanId} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <FormGroup label="First Name" value={crewData.firstName} />
                  <FormGroup label="Middle Name" value={crewData.middleName} />
                  <FormGroup label="Last Name" value={crewData.lastName} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <FormGroup label="Rank" value={crewData.rank} />
                  <FormGroup label="Vessel" value={crewData.vessel} />
                  <FormGroup label="Status" value={crewData.status} />
                </div>
              </section>

              {/* 2. Contact Information */}
              <section className="px-8 pb-8">
                <div className="bg-[#3498db] text-white px-6 py-2.5 rounded-lg text-lg font-medium mb-6">Contact Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormGroup label="Contact Number" value={crewData.contact} />
                  <FormGroup label="Email" value={crewData.email} />
                </div>
              </section>

              {/* 3. Identification (Matching your Screenshot) */}
              <section className="px-8 pb-8">
                <div className="bg-[#3498db] text-white px-6 py-2.5 rounded-lg text-lg font-medium mb-6">Identification</div>
                <div className="w-full md:w-1/2">
                  <Label className="text-gray-400 text-xs font-semibold uppercase mb-2 block">Government ID</Label>
                  <Select defaultValue={crewData.governmentIdType}>
                    <SelectTrigger className="h-10 border-gray-200 focus:ring-[#3498db] bg-white">
                      <SelectValue placeholder="Select ID Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="seaman_book">Seaman's Book</SelectItem>
                      <SelectItem value="id_card">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 p-8 bg-white border-t border-gray-50">
                <Button variant="outline" onClick={() => router.back()} className="px-8 border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50">
                  Cancel
                </Button>
                <Button className="px-10 bg-[#3498db] hover:bg-blue-600 text-white rounded-lg shadow-sm">
                  Save
                </Button>
              </div>
            </div>
          )}
          
          {/* ... (rest of the sections remain same) */}
          {activeTab === "current" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
               <div className="bg-[#3498db] text-white px-8 py-5 text-xl font-bold">Current Booking Details</div>
               <div className="p-8">
                  <BookingCard data={MOCK_CURRENT_BOOKING} />
               </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
               <div className="bg-[#3498db] text-white px-8 py-5 text-xl font-bold">Booking History</div>
               <div className="p-8 space-y-6">
                  {MOCK_HISTORY.map((item, index) => (
                    <HistoryCard key={index} data={item} />
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper components 
function FormGroup({ label, value, disabled = false }: { label: string, value: string, disabled?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-gray-400 text-xs font-semibold uppercase">{label}</Label>
      <Input 
        defaultValue={value} 
        disabled={disabled} 
        className={`h-10 border-gray-200 focus-visible:ring-[#3498db] bg-white ${disabled ? 'bg-gray-50/50 text-gray-500 cursor-not-allowed' : ''}`} 
      />
    </div>
  );
}

// ... (Rest of your helper components: HistoryCard, DateDetail, BookingCard, etc.)
function HistoryCard({ data }: any) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white hover:border-blue-100 transition-colors">
      <div className="flex justify-between items-center p-5 border-b border-gray-50">
        <div className="flex items-center gap-4">
          <div className="p-2 border border-blue-100 rounded-lg bg-blue-50/30">
            <Bed className="text-[#3498db]" size={20} />
          </div>
          <div>
            <h3 className="text-[#1e3a5f] font-bold text-base">{data.id}</h3>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-tight">
              {data.room} &nbsp;•&nbsp; {data.duration}
            </p>
          </div>
        </div>
        <span className="bg-[#2ecc71] text-white text-[10px] px-4 py-1.5 rounded-full font-bold uppercase">
          {data.status}
        </span>
      </div>
      <div className="grid grid-cols-3 p-5 gap-4">
        <DateDetail label="Check-in Date" value={data.checkIn} />
        <DateDetail label="Check-out Date" value={data.checkOut} />
        <DateDetail label="Duration" value={data.duration} />
      </div>
    </div>
  );
}

function DateDetail({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-[10px] font-bold uppercase mb-1 tracking-wider">{label}</p>
      <p className="text-[#1e3a5f] font-bold text-sm">{value}</p>
    </div>
  );
}

function BookingCard({ data }: any) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-[320px] h-[200px] rounded-2xl overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
          <span className="text-slate-300 font-medium italic">Room Image Placeholder</span>
        </div>
        <div className="flex-1">
          <h3 className="text-[#3498db] font-bold text-2xl mb-1">{data.id}</h3>
          <p className="text-gray-400 text-sm mb-6">{data.date}</p>
          <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            <DetailItem label="Room Number" value={data.roomNumber} />
            <DetailItem label="Floor" value={data.floor} />
            <DetailItem label="Room Type" value={data.roomType} />
            <DetailItem label="Bed Number" value={data.bedNumber} />
            <DetailItem label="Capacity" value={data.capacity} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateBox label="Check-in Date" date={data.checkInDate} time={data.checkInTime} color="border-[#2ecc71]" />
        <DateBox label="Expected Check-out Date" date={data.checkOutDate} time={data.checkOutTime} color="border-[#e67e22]" />
        <div className="bg-white border border-[#3498db]/20 rounded-2xl p-6 flex flex-col justify-center">
          <p className="text-[#3498db] text-xs font-bold uppercase mb-4 flex items-center gap-2">
             Duration <Calendar size={14} />
          </p>
          <p className="text-2xl font-bold text-[#1e3a5f]">{data.duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-12 pt-4">
        <StatusBadge label="Status" value={data.status} color="bg-[#2ecc71]" />
        <StatusBadge label="Source" value={data.source} color="bg-gray-100 !text-gray-400" />
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-[#1e3a5f] font-bold text-lg">{value}</p>
    </div>
  );
}

function DateBox({ label, date, time, color }: any) {
  return (
    <div className={`bg-white border ${color} rounded-2xl p-6 transition-all hover:shadow-sm`}>
      <p className="text-gray-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
        {label} <Calendar size={14} />
      </p>
      <p className="text-2xl font-bold text-[#1e3a5f] mb-3">{date}</p>
      <p className="text-gray-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-2 opacity-70">
        Time <Clock size={12} />
      </p>
      <p className="text-xl font-bold text-[#1e3a5f]">{time}</p>
    </div>
  );
}

function StatusBadge({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 text-sm font-medium">{label}:</span>
      <span className={`${color} text-white text-[10px] px-4 py-1.5 rounded-full font-bold uppercase shadow-sm`}>
        {value}
      </span>
    </div>
  );
}

function SidebarBtn({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active 
        ? "bg-[#3498db] text-white shadow-md shadow-blue-100" 
        : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
      }`}
    >
      {icon} {label}
    </button>
  );
}