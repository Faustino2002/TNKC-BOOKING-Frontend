"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronRight, User, Ship, BookOpen, History, 
  Calendar, Clock, Bed, ShieldCheck, Mail, Phone,
  ArrowLeft
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
    governmentIdType: "passport",
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
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center animate-pulse text-[#1e3a5f] font-bold text-xl uppercase tracking-widest">
          Fetching crew data...
        </div>
      </div>
    );
  }

  const fullName = `${crewData.firstName} ${crewData.middleName} ${crewData.lastName}`;
  const initials = `${crewData.firstName[0]}${crewData.lastName[0]}`;

  return (
    <div className="w-full animate-in fade-in duration-500">
      
      {/* HEADER & BREADCRUMBS */}
      <header className="mb-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/home/guest-list")}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-blue-50 transition-colors text-[#5a7184]"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
            <span className="text-gray-400 cursor-pointer hover:text-[#3498db]" onClick={() => router.push("/home/guest-list")}>Guestlist</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-[#3498db]">{activeTab} Details</span>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-[#1e3a5f] tracking-tight">Crew Member Details</h1>
      </header>

      <div className="flex flex-col xl:flex-row gap-8 items-start w-full">
        
        {/* LEFT PROFILE CARD */}
        <div className="w-full xl:w-[320px] bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex flex-col items-center sticky top-8">
          <div className="w-28 h-28 rounded-full mb-6 border-4 border-white shadow-xl bg-[#1e3a5f] flex items-center justify-center text-white text-3xl font-bold uppercase overflow-hidden">
             {initials}
          </div>
          <h2 className="text-2xl font-extrabold text-[#1e3a5f] text-center mb-1">{fullName}</h2>
          <p className="text-[#3498db] text-[11px] font-extrabold uppercase tracking-[0.2em] mb-6">{crewData.rank}</p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className={`text-white text-[10px] px-4 py-1 rounded-full font-bold uppercase shadow-sm ${crewData.status === 'Confirmed' ? 'bg-[#2ecc71]' : 'bg-orange-400'}`}>
                {crewData.status}
              </span>
              <div className="flex items-center gap-2 px-4 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] text-gray-500 font-bold uppercase">
                <Ship size={12} className="text-[#3498db]"/> {crewData.vessel}
              </div>
          </div>
          
          <div className="w-full space-y-2">
            <SidebarBtn active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User size={18}/>} label="Profile Information" />
            <SidebarBtn active={activeTab === "current"} onClick={() => setActiveTab("current")} icon={<BookOpen size={18}/>} label="Active Booking" />
            <SidebarBtn active={activeTab === "history"} onClick={() => setActiveTab("history")} icon={<History size={18}/>} label="Past History" />
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 w-full min-w-0 transition-all duration-300">
          {activeTab === "profile" && (
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              
              <div className="p-10 space-y-12">
                {/* 1. Personal Information */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-[#3498db] rounded-full" />
                    <h3 className="text-xl font-extrabold text-[#1e3a5f]">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormGroup label="Crew System ID" value={crewData.id} disabled />
                    <FormGroup label="Official Seaman ID" value={crewData.seamanId} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <FormGroup label="First Name" value={crewData.firstName} />
                    <FormGroup label="Middle Name" value={crewData.middleName} />
                    <FormGroup label="Last Name" value={crewData.lastName} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <FormGroup label="Current Rank" value={crewData.rank} />
                    <FormGroup label="Assigned Vessel" value={crewData.vessel} />
                    <FormGroup label="Account Status" value={crewData.status} />
                  </div>
                </section>

                {/* 2. Contact Information */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-[#3498db] rounded-full" />
                    <h3 className="text-xl font-extrabold text-[#1e3a5f]">Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormGroup label="Primary Contact Number" value={crewData.contact} />
                    <FormGroup label="Official Email Address" value={crewData.email} />
                  </div>
                </section>

                {/* 3. Identification */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-[#3498db] rounded-full" />
                    <h3 className="text-xl font-extrabold text-[#1e3a5f]">Identification Documents</h3>
                  </div>
                  <div className="w-full md:w-1/2">
                    <Label className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest mb-3 block">Primary Government ID Type</Label>
                    <Select defaultValue={crewData.governmentIdType}>
                      <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:ring-[#3498db] bg-slate-50/50 font-bold text-[#1e3a5f]">
                        <SelectValue placeholder="Select ID Type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="seaman_book">Seaman's Book</SelectItem>
                        <SelectItem value="id_card">National ID Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </section>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-4 p-10 bg-[#F8FAFC]/50 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()} 
                  className="px-8 h-12 border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-white hover:shadow-sm"
                >
                  Discard Changes
                </Button>
                <Button className="px-12 h-12 bg-[#3498db] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-100 transition-all active:scale-95">
                  Update Profile
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === "current" && (
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
               <div className="bg-[#1e3a5f] text-white px-10 py-8">
                  <h3 className="text-2xl font-extrabold tracking-tight">Active Booking Details</h3>
                  <p className="text-blue-200 text-sm font-medium mt-1">Room assignment and stay duration.</p>
               </div>
               <div className="p-10">
                  <BookingCard data={MOCK_CURRENT_BOOKING} />
               </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
               <div className="bg-[#1e3a5f] text-white px-10 py-8">
                  <h3 className="text-2xl font-extrabold tracking-tight">Booking History</h3>
                  <p className="text-blue-200 text-sm font-medium mt-1">Previous stays and room records.</p>
               </div>
               <div className="p-10 space-y-6">
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

// --- UPDATED HELPER COMPONENTS ---

function FormGroup({ label, value, disabled = false }: { label: string, value: string, disabled?: boolean }) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest">{label}</Label>
      <Input 
        defaultValue={value} 
        disabled={disabled} 
        className={`h-12 border-gray-200 rounded-xl focus-visible:ring-[#3498db] font-bold text-[#1e3a5f] bg-slate-50/50 ${disabled ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed' : 'focus:bg-white transition-all'}`} 
      />
    </div>
  );
}

function HistoryCard({ data }: any) {
  return (
    <div className="group border border-gray-100 rounded-3xl overflow-hidden shadow-sm bg-white hover:border-blue-200 transition-all hover:shadow-md">
      <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-[#F8FAFC]/50">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-blue-100 text-[#3498db] shadow-sm group-hover:scale-110 transition-transform">
            <Bed size={22} />
          </div>
          <div>
            <h3 className="text-[#1e3a5f] font-extrabold text-lg">{data.id}</h3>
            <p className="text-gray-400 text-[10px] font-extrabold uppercase tracking-[0.1em]">
              {data.room} &nbsp;•&nbsp; {data.duration}
            </p>
          </div>
        </div>
        <span className="bg-[#2ecc71] text-white text-[10px] px-5 py-1.5 rounded-full font-extrabold uppercase shadow-sm">
          {data.status}
        </span>
      </div>
      <div className="grid grid-cols-3 p-8 gap-8">
        <DateDetail label="Check-in Date" value={data.checkIn} />
        <DateDetail label="Check-out Date" value={data.checkOut} />
        <DateDetail label="Total Duration" value={data.duration} />
      </div>
    </div>
  );
}

function DateDetail({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-[10px] font-extrabold uppercase mb-2 tracking-widest">{label}</p>
      <p className="text-[#1e3a5f] font-extrabold text-base">{value}</p>
    </div>
  );
}

function BookingCard({ data }: any) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row gap-10">
        <div className="relative w-full xl:w-[400px] h-[260px] rounded-[24px] overflow-hidden shadow-inner bg-slate-100 border border-slate-200 flex items-center justify-center group">
          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs opacity-50 group-hover:opacity-100 transition-opacity">Room Image Placeholder</span>
        </div>
        <div className="flex-1">
          <h3 className="text-[#3498db] font-extrabold text-3xl tracking-tight mb-1">{data.id}</h3>
          <p className="text-gray-400 font-bold text-sm mb-8 uppercase tracking-widest">Booked on {data.date}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
            <DetailItem label="Room Number" value={data.roomNumber} />
            <DetailItem label="Assigned Floor" value={data.floor} />
            <DetailItem label="Room Category" value={data.roomType} />
            <DetailItem label="Bed Position" value={data.bedNumber} />
            <DetailItem label="Guest Capacity" value={data.capacity} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DateBox label="Check-in Schedule" date={data.checkInDate} time={data.checkInTime} color="border-[#2ecc71]" icon={<Calendar size={18} className="text-[#2ecc71]"/>} />
        <DateBox label="Expected Departure" date={data.checkOutDate} time={data.checkOutTime} color="border-[#e67e22]" icon={<Calendar size={18} className="text-[#e67e22]"/>} />
        <div className="bg-[#3498db] rounded-[24px] p-8 flex flex-col justify-center text-white shadow-lg shadow-blue-100">
          <p className="text-blue-100 text-[11px] font-extrabold uppercase tracking-widest mb-4 flex items-center gap-2">
             Stay Duration <Clock size={16} />
          </p>
          <p className="text-3xl font-extrabold">{data.duration}</p>
        </div>
      </div>

      <div className="flex items-center gap-12 pt-6 border-t border-gray-50">
        <StatusBadge label="Booking Status" value={data.status} color="bg-[#2ecc71]" />
        <StatusBadge label="Registration Source" value={data.source} color="bg-slate-100 !text-slate-400" />
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-gray-400 text-[10px] font-extrabold mb-2 uppercase tracking-[0.1em]">{label}</p>
      <p className="text-[#1e3a5f] font-extrabold text-xl">{value}</p>
    </div>
  );
}

function DateBox({ label, date, time, color, icon }: any) {
  return (
    <div className={`bg-white border-2 ${color} rounded-[24px] p-8 transition-all hover:shadow-md`}>
      <p className="text-gray-400 text-[11px] font-extrabold uppercase mb-5 flex items-center gap-2 tracking-widest">
        {label} {icon}
      </p>
      <p className="text-2xl font-extrabold text-[#1e3a5f] mb-4">{date}</p>
      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-extrabold uppercase tracking-widest mb-1 opacity-70">
        Arrival Time <Clock size={12} />
      </div>
      <p className="text-xl font-extrabold text-[#1e3a5f]">{time}</p>
    </div>
  );
}

function StatusBadge({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-400 text-xs font-extrabold uppercase tracking-widest">{label}</span>
      <span className={`${color} text-white text-[10px] px-5 py-2 rounded-full font-extrabold uppercase shadow-sm`}>
        {value}
      </span>
    </div>
  );
}

function SidebarBtn({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-extrabold uppercase tracking-widest transition-all ${
        active 
        ? "bg-[#3498db] text-white shadow-lg shadow-blue-100 scale-[1.02]" 
        : "text-gray-400 hover:bg-slate-50 hover:text-[#1e3a5f]"
      }`}
    >
      {icon} {label}
    </button>
  );
}