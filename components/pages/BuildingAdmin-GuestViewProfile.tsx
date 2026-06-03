"use client";

import React, { useState } from "react";
import { Home, ChevronRight, User, BookOpen, History, Eye } from "lucide-react";
import { Guest } from "./BuildingAdmin-Dashboard";
// Import the updated booking switcher layout component
import BuildingAdminGuestBooking from "./BuildingAdmin-GuestBooking"; 

interface ProfileProps {
  guest: Guest;
  onBack: () => void;
}

export default function BuildingAdminGuestViewProfile({ guest, onBack }: ProfileProps) {
  // Navigation tabs view states
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'current' | 'history'>('profile');

  const nameParts = guest.name.split(" ");
  const firstName = nameParts[0] || "John";
  const middleName = nameParts.length > 2 ? nameParts[1] : "Lars";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "Doe";

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-800">
      
      {/* Breadcrumb Navigation Header */}
      <div className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
        <button onClick={onBack} className="hover:text-blue-600 transition-colors">
          <Home size={18} className="text-slate-600" />
        </button>
        <ChevronRight size={16} className="text-slate-400" />
        <button onClick={onBack} className="hover:text-blue-600 transition-colors">
          Guestlist
        </button>
        <ChevronRight size={16} className="text-slate-400" />
        <span className="text-[#1a4f76] font-bold text-lg">
          {activeSubTab === 'profile' && 'Profile'}
          {activeSubTab === 'current' && 'Current Booking'}
          {activeSubTab === 'history' && 'Booking History'}
        </span>
      </div>

      <div className="flex gap-8 items-start">
        
        {/* Left Card Sidebar Panel */}
        <div className="w-72 bg-[#06212c] text-white rounded-xl p-5 shadow-md flex flex-col items-center">
          <div className="w-28 h-28 bg-slate-300 rounded-full overflow-hidden border-2 border-slate-700 mb-4 relative">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop')` }} />
          </div>

          <h2 className="text-xl font-bold tracking-wide text-center">{guest.name}</h2>
          <p className="text-slate-400 text-xs mt-1 mb-3">{guest.rank}</p>

          <div className="flex gap-2 mb-6">
            <span className="bg-[#10b981] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">Active</span>
            <span className="text-slate-400 text-[10px] flex items-center gap-1">🚢 {guest.vessel}</span>
          </div>

          {/* Nav Item Buttons Group */}
          <div className="w-full space-y-1">
            <button 
              onClick={() => setActiveSubTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide text-left transition-all ${
                activeSubTab === 'profile' ? 'bg-[#2589d8] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User size={16} /> Profile
            </button>
            <button 
              onClick={() => setActiveSubTab('current')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide text-left transition-all ${
                activeSubTab === 'current' ? 'bg-[#2589d8] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen size={16} /> Current Booking
            </button>
            <button 
              onClick={() => setActiveSubTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide text-left transition-all ${
                activeSubTab === 'history' ? 'bg-[#2589d8] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History size={16} /> Booking History
            </button>
          </div>
        </div>

        {/* Right Dynamic Form Layout Window */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          
          {activeSubTab === 'profile' ? (
            /* PROFILE CONTENT MAIN PANEL */
            <div className="space-y-6">
              <div>
                <h3 className="bg-[#1c5d8a] text-white px-4 py-2 text-sm font-semibold tracking-wide rounded">Personal Information</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Crew ID</label>
                    <input type="text" readOnly value="202214789" className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Seaman ID</label>
                    <input type="text" readOnly value={guest.seamanId} className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">First Name</label>
                    <input type="text" readOnly value={firstName} className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Middle Name</label>
                    <input type="text" readOnly value={middleName} className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Last Name</label>
                    <input type="text" readOnly value={lastName} className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Street Address</label>
                    <input type="text" readOnly value={guest.rank} className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Vessel</label>
                    <input type="text" readOnly value={guest.vessel} className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Status</label>
                    <input type="text" readOnly value="Active" className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="bg-[#1c5d8a] text-white px-4 py-2 text-sm font-semibold tracking-wide rounded">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Contact Number</label>
                    <input type="text" readOnly value="09476171567" className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Email</label>
                    <input type="text" readOnly value="john.doe@gmail.com" className="w-full px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded text-xs text-slate-700 outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="bg-[#1c5d8a] text-white px-4 py-2 text-sm font-semibold tracking-wide rounded">Identification</h3>
                <div className="mt-4">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Government ID</label>
                  <div className="flex items-center gap-4">
                    <input type="text" readOnly value="Passport" className="w-56 px-3 py-1.5 bg-[#e2e8f0] border border-slate-200 rounded text-xs text-slate-600 outline-none font-medium" />
                    <button type="button" className="text-[#2589d8] text-xs font-semibold flex items-center gap-1 hover:underline">
                      Preview <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CALL SEPARATED COMPONENT AND PASS TAB STATE + GUEST METRICS VIA PROPS */
            <BuildingAdminGuestBooking viewMode={activeSubTab} guest={guest} />
          )}

        </div>
      </div>
    </div>
  );
}