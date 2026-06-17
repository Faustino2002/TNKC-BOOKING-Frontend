"use client";

import React from "react";
import { Calendar, Clock, Moon } from "lucide-react";
import { Guest } from "./BuildingAdmin-Dashboard";

interface GuestBookingProps {
  viewMode: 'profile' | 'current' | 'history';
  guest: Guest;
}

export default function BuildingAdminGuestBooking({ viewMode, guest }: GuestBookingProps) {
  
  if (viewMode === 'current') {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Section Header */}
        <h3 className="bg-[#1c5d8a] text-white px-4 py-2 text-xs font-bold tracking-wide rounded">
          Current Booking Details
        </h3>
        
        {/* Main Booking Panel */}
        <div className="border border-slate-200/80 rounded-xl p-5 shadow-sm bg-white grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Room Image Preview */}
          <div className="md:col-span-1">
            <div 
              className="w-full h-40 bg-cover bg-center rounded-xl border border-slate-100"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400&auto=format&fit=crop')` }}
            />
          </div>

          {/* Room Details Metadata */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-extrabold text-[#2589d8] tracking-tight">
                TNCK - 2026 - 05 - 789
              </h4>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">04/28/26</p>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Room Number</span>
                <span className="font-bold text-slate-700 text-sm">Cabin A - 04</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Floor</span>
                <span className="font-bold text-slate-700 text-sm">TNKC Floor 2</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Room Type</span>
                <span className="font-bold text-slate-700 text-sm">Single</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Bed Number</span>
                <span className="font-bold text-slate-700 text-sm">Bed #1</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Capacity</span>
              <span className="font-bold text-slate-700 text-sm">1 person</span>
            </div>
          </div>
        </div>

        {/* Schedule Time Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Check-In Card */}
          <div className="border border-emerald-200 bg-emerald-50/20 rounded-xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mb-1">
              Check-in Date <Calendar size={12} />
            </span>
            <div className="text-xl font-extrabold text-slate-800">06/01/26</div>
            <hr className="my-2 border-emerald-100" />
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mb-1">
              Check-in Time <Clock size={12} />
            </span>
            <div className="text-sm font-bold text-slate-700">9:00 AM</div>
          </div>

          {/* Check-Out Card */}
          <div className="border border-orange-200 bg-orange-50/20 rounded-xl p-4 shadow-sm">
            <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1 mb-1">
              Expected Check-out Date <Calendar size={12} />
            </span>
            <div className="text-xl font-extrabold text-slate-800">06/01/26</div>
            <hr className="my-2 border-orange-100" />
            <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1 mb-1">
              Expected Check-out Time <Clock size={12} />
            </span>
            <div className="text-sm font-bold text-slate-700">9:00 AM</div>
          </div>

          {/* Duration Calculation Card */}
          <div className="border border-blue-200 bg-blue-50/20 rounded-xl p-4 shadow-sm flex flex-col justify-center">
            <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1 mb-1">
              Duration <Moon size={12} />
            </span>
            <div className="text-lg font-extrabold text-slate-800 leading-tight">
              5 days and 4 nights
            </div>
          </div>
        </div>

        {/* Bottom Status Metadata Bar */}
        <div className="flex items-center gap-8 pt-2 text-xs border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Status:</span>
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-3 py-0.5 rounded-full text-[10px]">
              Confirmed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Source:</span>
            <span className="bg-slate-100 text-slate-600 font-bold px-3 py-0.5 rounded-full text-[10px]">
              {guest.source || "Self-Service Kiosk"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'history') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <h3 className="bg-[#1c5d8a] text-white px-4 py-2 text-xs font-bold tracking-wide rounded">
          Past Booking History
        </h3>
        <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Room / Bed</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              <tr className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-bold text-slate-800">TNCK-2026-01-112</td>
                <td className="px-4 py-3">Cabin B-02 / Bed #1</td>
                <td className="px-4 py-3">3 Days, 2 Nights</td>
                <td className="px-4 py-3"><span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-bold">Checked Out</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}