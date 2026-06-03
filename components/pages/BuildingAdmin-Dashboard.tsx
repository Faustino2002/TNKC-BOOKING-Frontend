/**
 * API REQUIREMENTS:
 * 1. GET /api/guests -> Returns Guest[]
 * 2. GET /api/staff-tasks -> Returns StaffTask[]
 * 3. GET /api/guests/:id -> Returns Guest (for profile view)
 */

"use client";

import React, { useState, useEffect } from "react";
import { Search, Download } from "lucide-react";
import BuildingAdminGuestViewProfile from "./BuildingAdmin-GuestViewProfile";
import BuildingAdminStaffViewProfile from "./BuildingAdmin-StaffViewProfile";

// --- Types (The "Contract" for the Backend) ---
export interface Guest {
  id: string;
  name: string;
  seamanId: string;
  rank: string;
  vessel: string;
  status: 'Confirmed' | 'Reserved' | 'Waiting Arrival';
  source: string;
}

export interface StaffTask {
  name: string;
  task: string;
  category: string;
  room: string;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  status: 'Pending' | 'In progress' | 'Completed';
}

// --- Staff View Component ---
interface StaffListViewProps {
  onViewStaff: (staff: StaffTask) => void;
}

const StaffListView = ({ onViewStaff }: StaffListViewProps) => {
  // TODO: Replace with real API fetch
  const staffTasks: StaffTask[] = [
    { name: "John L. Doe", task: "Plumbing", category: "Maintenance", room: "201", priority: "High", date: "05/03/26", status: "Pending" },
    { name: "Jane L. Doe", task: "Cleaning", category: "Room Service", room: "302", priority: "Low", date: "05/04/26", status: "In progress" },
    { name: "John L. Doe", task: "Changing beddings", category: "Room Service", room: "303", priority: "Medium", date: "05/05/26", status: "Completed" },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
          <Download size={16} /> Download PDF
        </button>
      </div>

      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
          <tr>
            <th className="px-6 py-4"><input type="checkbox" /></th>
            <th className="px-6 py-4">Staff Name</th>
            <th className="px-6 py-4">Assigned Task</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Room</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4">Reported Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {staffTasks.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50">
              <td className="px-6 py-4"><input type="checkbox" /></td>
              <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">JD</div>
                {item.name}
              </td>
              <td className="px-6 py-4 text-slate-600">{item.task}</td>
              <td className="px-6 py-4 text-slate-600">{item.category}</td>
              <td className="px-6 py-4 text-slate-600">{item.room}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${item.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                  ● {item.priority}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600">{item.date}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${item.status === 'Pending' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                  ● {item.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button 
                  onClick={() => onViewStaff(item)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Main Dashboard Component ---
export default function BuildingAdminDashboard() {
  const [view, setView] = useState<'guest' | 'staff'>('guest');
  
  // State tracking for the profile view transitions
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffTask | null>(null);
  
  // Handoff ready: Scaffolding for backend integration
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guests: Guest[] = [
    { id: "00000024", name: "John L. Doe", seamanId: "0012385700", rank: "Chief Officer", vessel: "MV Pacific Star", status: "Confirmed", source: "Self-Service Kiosk" },
    { id: "00000023", name: "Jane A. Smith", seamanId: "0012385701", rank: "Cadet", vessel: "MV Pacific Star", status: "Reserved", source: "Self-Service Kiosk" },
    { id: "00000022", name: "Mark B. Wilson", seamanId: "0012385799", rank: "Chief Officer", vessel: "MV Pacific Star", status: "Waiting Arrival", source: "Self-Service Kiosk" },
  ];

  // Intercept render cycle if an admin clicks to view a guest profile
  if (selectedGuest) {
    return (
      <BuildingAdminGuestViewProfile 
        guest={selectedGuest} 
        onBack={() => setSelectedGuest(null)} 
      />
    );
  }

  // Intercept render cycle if an admin clicks to view a staff profile
  if (selectedStaff) {
    return (
      <BuildingAdminStaffViewProfile 
        staff={selectedStaff} 
        onBack={() => setSelectedStaff(null)} 
      />
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{view === 'guest' ? 'Guestlist' : 'Staff List'}</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('guest')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border ${view === 'guest' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            Guestlist View
          </button>
          <button 
            onClick={() => setView('staff')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border ${view === 'staff' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            Staff View
          </button>
        </div>
      </div>

      {view === 'guest' ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              <Download size={16} /> Download PDF
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4"><input type="checkbox" className="rounded" /></th>
                <th className="px-6 py-4">Guest ID</th>
                <th className="px-6 py-4">Guest Name</th>
                <th className="px-6 py-4">Seaman ID</th>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Vessel</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sources</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {guests.map((guest, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4"><input type="checkbox" className="rounded" /></td>
                  <td className="px-6 py-4 font-medium text-slate-900">{guest.id}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">JD</div>
                    {guest.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{guest.seamanId}</td>
                  <td className="px-6 py-4 text-slate-600">{guest.rank}</td>
                  <td className="px-6 py-4 text-slate-600">{guest.vessel}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      guest.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                      guest.status === 'Waiting Arrival' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      ● {guest.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{guest.source}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedGuest(guest)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <StaffListView onViewStaff={(staff) => setSelectedStaff(staff)} />
      )}
    </div>
  );
}