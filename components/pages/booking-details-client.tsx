"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BookingDetailsClient() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  
  const [currentGuest, setCurrentGuest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuestDetails = async () => {
      if (!bookingId) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (!response.ok) throw new Error("Guest not found");
        const data = await response.json();
        setCurrentGuest(data);
      } catch (error) {
        // Fallback Mock Data
        const allGuestsMock = [
          { id: "1200975771", name: "Maria S. Dela Cruz", rank: "Cadet", vessel: "MV Pacific Star", seamanId: "0058900921", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop", fileName: "Passport_Maria_DelaCruz.jpeg" },
          { id: "1200975770", name: "Jane L. Doe", rank: "Chief Officer", vessel: "MV Pacific Star", seamanId: "0099887766", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop", fileName: "Passport_Jane_Doe.jpeg" },
          { id: "1200975773", name: "System User", rank: "Administrator", vessel: "Shore Office", seamanId: "SYS-999000", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop", fileName: "System_Auth_ID.jpeg" }
        ];
        const found = allGuestsMock.find(g => g.id === bookingId);
        setCurrentGuest(found || allGuestsMock[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuestDetails();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] text-gray-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="font-medium">Loading guest details...</p>
      </div>
    );
  }

  if (!currentGuest) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8 px-4 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 ml-2">
          <div className="flex items-center gap-2 text-3xl font-bold text-[#1e4e79]">
            <h1>Booking List</h1>
            <span className="text-gray-300 font-light text-2xl">{" > "}</span>
            <span className="text-gray-400 font-light text-2xl">...</span>
            <span className="text-gray-300 font-light text-2xl">{" > "}</span>
            <h1 className="text-[#1e4e79]">{currentGuest.name}</h1>
          </div>
        </header>

        <div className="bg-white rounded-md shadow-sm p-10 space-y-12">
          <section className="flex flex-col md:flex-row gap-12">
            <div className="w-48 pt-2">
              <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
            </div>
            
            <div className="flex-1 border border-slate-200 rounded-xl p-6 space-y-6">
              <div>
                <label className="text-[13px] font-semibold text-gray-500 mb-2 block">Photo</label>
                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-slate-50">
                  <img src={currentGuest.image} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-semibold text-gray-500">Seaman ID</label>
                <Input readOnly value={currentGuest.seamanId} className="h-10 border-slate-200 rounded-md text-gray-600 bg-white focus-visible:ring-0" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-gray-500">Rank</label>
                  <Input readOnly value={currentGuest.rank} className="h-10 border-slate-200 rounded-md text-gray-600 bg-white focus-visible:ring-0" />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-semibold text-gray-500">Vessel</label>
                  <Input readOnly value={currentGuest.vessel} className="h-10 border-slate-200 rounded-md text-gray-600 bg-white focus-visible:ring-0" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-semibold text-gray-500">Purpose of Stay</label>
                <div className="flex justify-between items-center h-10 px-3 border border-slate-200 bg-slate-50/30 rounded-md text-gray-400 cursor-pointer text-sm hover:bg-slate-50 transition-colors">
                  <span>Select Purpose</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col md:flex-row gap-12 pt-8 border-t border-gray-50">
            <div className="w-48 pt-2">
              <h2 className="text-xl font-semibold text-gray-800">Document</h2>
            </div>

            <div className="flex-1 border border-slate-200 rounded-xl p-6">
              <label className="text-[13px] font-semibold text-gray-500 mb-3 block">Upload Government ID</label>
              <div className="border border-slate-100 rounded-lg p-1.5 inline-block bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sample_Passport_Image.png/640px-Sample_Passport_Image.png" 
                  alt="ID Document" 
                  className="h-32 rounded-md opacity-90"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-2 font-medium tracking-wide">{currentGuest.fileName}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}