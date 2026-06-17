"use client";

import React, { useState } from "react";
import { Home, ChevronRight, User, ClipboardList, History } from "lucide-react";
import { StaffTask } from "./BuildingAdmin-Dashboard";
import BuildingAdminStaffTaskAssign from "./BuildingAdmin-StaffTaskAssign"; 
import BuildingAdminStaffWorkHistory from "./BuildingAdmin-StaffWorkHistory"; // Import statement added

interface StaffProfileProps {
  staff: StaffTask;
  onBack: () => void;
}

export default function BuildingAdminStaffViewProfile({ staff, onBack }: StaffProfileProps) {
  // Navigation sub-tab controller tracking state inside the staff views
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'task' | 'work-history'>('profile');

  // Safely parse name partitions dynamically
  const nameParts = staff.name.split(" ");
  const firstName = nameParts[0] || "John";
  const middleName = nameParts.length > 2 ? nameParts[1] : "Lars";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "Doe";

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-800 font-sans">
      
      {/* Top Breadcrumb Header Line */}
      <div className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
        <button onClick={onBack} className="hover:text-blue-600 transition-colors flex items-center">
          <Home size={18} className="text-slate-600" />
        </button>
        <ChevronRight size={16} className="text-slate-400" />
        <button onClick={onBack} className="hover:text-blue-600 transition-colors text-slate-500">
          Staff List
        </button>
        <ChevronRight size={16} className="text-slate-400" />
        <span className="text-[#1a4f76] font-bold text-lg">
          {activeSubTab === 'profile' ? 'Profile' : activeSubTab === 'task' ? 'Task Assignment' : 'Work History'}
        </span>
      </div>

      {/* Main Structural Twin Columns Split Grid */}
      <div className="flex gap-8 items-start">
        
        {/* Left Side Highlight Card Block */}
        <div className="w-72 bg-[#06212c] text-white rounded-xl p-5 shadow-md flex flex-col items-center">
          
          {/* Circular Staff Profile Avatar Layout frame */}
          <div className="w-24 h-24 bg-slate-300 rounded-full overflow-hidden border-2 border-slate-700 mb-4 relative">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop')` }} 
            />
          </div>

          <h2 className="text-lg font-bold tracking-wide text-center">{staff.name}</h2>
          <p className="text-slate-400 text-xs mt-0.5 mb-3">Chief Officer</p>

          <div className="flex gap-2 mb-6">
            <span className="bg-[#10b981] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center justify-center">
              Active
            </span>
            <span className="text-slate-400 text-[10px] flex items-center gap-1">
              🚢 MV Pacific Star
            </span>
          </div>

          {/* Left Vertical Options Navigation Bar List */}
          <div className="w-full space-y-1">
            <button 
              type="button"
              onClick={() => setActiveSubTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide text-left transition-all ${
                activeSubTab === 'profile' 
                  ? 'bg-[#2589d8] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User size={16} /> Profile
            </button>
            <button 
              type="button"
              onClick={() => setActiveSubTab('task')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide text-left transition-all ${
                activeSubTab === 'task' 
                  ? 'bg-[#2589d8] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ClipboardList size={16} /> Task Assignment
            </button>
            <button 
              type="button"
              onClick={() => setActiveSubTab('work-history')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide text-left transition-all ${
                activeSubTab === 'work-history' 
                  ? 'bg-[#2589d8] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History size={16} /> Work History
            </button>
          </div>
        </div>

        {/* Right Info Input Form Deck Wrapper */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 min-h-[520px]">
          
          {activeSubTab === 'profile' && (
            <div className="space-y-6">
              
              {/* --- PERSONAL DATA MATRIX SECTION BLOCK --- */}
              <div>
                <h3 className="bg-[#1c5d8a] text-white px-4 py-2 text-xs font-bold tracking-wide rounded">
                  Personal Information
                </h3>
                
                {/* Position Group Grid Row */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Staff Position</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="Electrician" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Work Category</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={staff.category} 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                </div>

                {/* Name Breakdown Grid Row */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">First Name</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={firstName} 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Middle Name</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={middleName} 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Last Name</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={lastName} 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                </div>

                {/* Street Location Entry Field */}
                <div className="mt-4">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Street Address</label>
                  <input 
                    type="text" 
                    readOnly 
                    value="Malunggay St." 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                  />
                </div>

                {/* Regional Geo Location Location Row */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">City</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="Mandaluyong" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">State/Province</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="NCR" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">ZIP/Postal Code</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="1550" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              {/* --- CONTACT COMMUNICATION METRICS ROW --- */}
              <div>
                <h3 className="bg-[#1c5d8a] text-white px-4 py-2 text-xs font-bold tracking-wide rounded">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Contact Number</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="09476171567" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Email</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="john.doe@gmail.com" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-medium outline-none shadow-sm" 
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Render the clean separate task component */}
          {activeSubTab === 'task' && <BuildingAdminStaffTaskAssign />}

          {/* Render the clean separate work history log component */}
          {activeSubTab === 'work-history' && <BuildingAdminStaffWorkHistory />}

        </div>
      </div>
    </div>
  );
}