"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronRight, 
  User, 
  Ship, 
  BookOpen, 
  History, 
  ChevronDown,
  Calendar,
  Clock,
  Bed
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- MOCK DATA ---
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

function CrewDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<"profile" | "current" | "history">("profile");
  const [isLoading, setIsLoading] = useState(true);

  const crewData = {
    id: searchParams.get("id") || "2022142879",
    name: searchParams.get("name") || "John L. Doe",
    rank: searchParams.get("rank") || "Chief Officer",
    seamanId: searchParams.get("seamanId") || "000000000125",
    vessel: searchParams.get("vessel") || "MV Pacific Star",
    email: searchParams.get("email") || "john.doe@gmail.com",
    status: searchParams.get("status") || "Active",
  };

  const nameParts = crewData.name.split(" ");
  const firstName = nameParts[0] || "John";
  const lastName = nameParts[nameParts.length - 1] || "Doe";
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "Lars";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <div className="p-10 text-center animate-pulse text-[#1e3a5f] font-bold">Loading...</div>;

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* BREADCRUMBS */}
      <div className="flex items-center gap-2 mb-6">
        <h1 
          className="text-[#1e3a5f] font-bold text-4xl cursor-pointer" 
          onClick={() => router.push("/home/dashboard/guestlist")}
        >
          Guestlist
        </h1>
        <ChevronRight size={28} className="text-gray-300 mx-2" />
        <span className="text-gray-400 text-3xl font-light">...</span>
        <ChevronRight size={28} className="text-gray-300 mx-2" />
        <span className="text-[#3498db] font-semibold text-3xl">
          {activeTab === "profile" && "Profile"}
          {activeTab === "current" && "Current Booking"}
          {activeTab === "history" && "Booking History"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT PROFILE CARD */}
        <div className="w-full lg:w-[280px] bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-50 relative">
             <Image 
               src="/crew-placeholder.jpg" 
               alt="Profile" 
               fill 
               className="object-cover"
             />
          </div>
          <h2 className="text-xl font-bold text-[#1e3a5f] text-center">{crewData.name}</h2>
          <p className="text-gray-400 text-xs font-medium mb-4">{crewData.rank}</p>
          
          <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#2ecc71] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                {crewData.status}
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
        <div className="flex-1 w-full">
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <section className="p-8">
                <div className="bg-[#3498db] text-white px-6 py-2.5 rounded-lg text-lg font-medium mb-6">Personal Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">Crew ID</Label>
                    <Input disabled value={crewData.id} className="h-10 bg-gray-50/50 border-gray-200 text-gray-500" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">Seaman ID</Label>
                    <Input defaultValue={crewData.seamanId} className="h-10 border-gray-200" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">First Name</Label>
                    <Input defaultValue={firstName} className="h-10 border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">Middle Name</Label>
                    <Input defaultValue={middleName} className="h-10 border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">Last Name</Label>
                    <Input defaultValue={lastName} className="h-10 border-gray-200" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">Rank</Label>
                    <Input defaultValue={crewData.rank} className="h-10 border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">Vessel</Label>
                    <Input defaultValue={crewData.vessel} className="h-10 border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">Status</Label>
                    <Input defaultValue={crewData.status} className="h-10 border-gray-200" />
                  </div>
                </div>
              </section>

              <section className="px-8 pb-8">
                <div className="bg-[#3498db] text-white px-6 py-2.5 rounded-lg text-lg font-medium mb-6">Contact Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">Contact Number</Label>
                    <Input defaultValue="0987654321" className="h-10 border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-400 text-xs font-semibold uppercase">Email</Label>
                    <Input defaultValue={crewData.email} className="h-10 border-gray-200" />
                  </div>
                </div>
              </section>

              <section className="px-8 pb-8">
                <div className="bg-[#3498db] text-white px-6 py-2.5 rounded-lg text-lg font-medium mb-6">Identification</div>
                <div className="space-y-1.5 w-full md:w-1/3">
                  <Label className="text-gray-400 text-xs font-semibold uppercase">Government ID</Label>
                  <div className="relative">
                    <select className="w-full h-10 rounded-md border border-gray-200 px-3 bg-white text-gray-400 text-sm appearance-none outline-none">
                      <option>Select ID Type</option>
                      <option>Passport</option>
                      <option>Driver's License</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-3 p-8 bg-gray-50/30 border-t border-gray-50">
                <Button variant="outline" onClick={() => router.back()} className="px-8 border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50">
                  Cancel
                </Button>
                <Button className="px-10 bg-[#3498db] hover:bg-blue-600 text-white rounded-lg shadow-sm">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
          
          {/* CURRENT BOOKING VIEW */}
          {activeTab === "current" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="bg-[#3498db] text-white px-8 py-5 text-xl font-bold">Current Booking Details</div>
               <div className="p-8">
                  <BookingCard data={MOCK_CURRENT_BOOKING} />
               </div>
            </div>
          )}

          {/* BOOKING HISTORY VIEW */}
          {activeTab === "history" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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

// History Card matching Image 4
function HistoryCard({ data }: any) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="flex justify-between items-center p-5 border-b border-gray-50">
        <div className="flex items-center gap-4">
          <div className="p-2 border border-blue-100 rounded-lg">
            <Bed className="text-[#3498db]" size={20} />
          </div>
          <div>
            <h3 className="text-[#1e3a5f] font-bold text-base">{data.id}</h3>
            <p className="text-gray-400 text-[11px] font-medium uppercase">
              {data.room} &nbsp;•&nbsp; {data.duration}
            </p>
          </div>
        </div>
        <span className="bg-[#2ecc71] text-white text-[10px] px-4 py-1.5 rounded-full font-bold uppercase">
          {data.status}
        </span>
      </div>
      <div className="grid grid-cols-3 p-5">
        <div>
          <p className="text-gray-400 text-[10px] font-bold uppercase mb-2 tracking-wider">Check-in Date</p>
          <p className="text-[#1e3a5f] font-bold text-sm">{data.checkIn}</p>
        </div>
        <div>
          <p className="text-gray-400 text-[10px] font-bold uppercase mb-2 tracking-wider">Check-out Date</p>
          <p className="text-[#1e3a5f] font-bold text-sm">{data.checkOut}</p>
        </div>
        <div>
          <p className="text-gray-400 text-[10px] font-bold uppercase mb-2 tracking-wider">Duration</p>
          <p className="text-[#1e3a5f] font-bold text-sm">{data.duration}</p>
        </div>
      </div>
    </div>
  );
}

// Current Booking Card matching Image 3
function BookingCard({ data }: any) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-[320px] h-[200px] rounded-2xl overflow-hidden shadow-sm">
          <Image src="/room-placeholder.jpg" alt="Room" fill className="object-cover" />
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
        <div className="bg-white border border-[#3498db]/20 rounded-2xl p-6">
          <p className="text-[#3498db] text-xs font-bold uppercase mb-4 flex items-center gap-2">
             Duration <Calendar size={14} className="text-[#3498db]" />
          </p>
          <p className="text-2xl font-bold text-[#1e3a5f]">{data.duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-12 pt-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium">Status:</span>
          <span className="bg-[#2ecc71] text-white text-[10px] px-4 py-1.5 rounded-full font-bold uppercase">
            {data.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium">Source:</span>
          <span className="bg-gray-100 text-gray-400 text-[10px] px-4 py-1.5 rounded-full font-bold uppercase">
            {data.source}
          </span>
        </div>
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
    <div className={`bg-white border ${color} rounded-2xl p-6`}>
      <p className="text-gray-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
        {label} <Calendar size={14} />
      </p>
      <p className="text-2xl font-bold text-[#1e3a5f] mb-3">{date}</p>
      <p className="text-gray-400 text-xs font-bold uppercase mb-1 flex items-center gap-2">
        Time <Clock size={14} />
      </p>
      <p className="text-xl font-bold text-[#1e3a5f]">{time}</p>
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

export default function CrewDetailsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <CrewDetailsContent />
    </Suspense>
  );
}                                                                                   