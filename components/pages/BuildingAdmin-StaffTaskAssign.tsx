"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface Task {
  id: number;
  title: string;
  room: string;
  priority: string;
  date: string;
  time: string;
  status: 'Pending' | 'In progress' | 'For review' | 'Completed' | 'Cancelled';
}

export default function BuildingAdminStaffTaskAssign() {
  // Local sub-tab selection state for filtering tasks
  const [taskFilter, setTaskFilter] = useState<Task['status']>('Pending');

  // Expanded mock data array representing all possible task states
  const allTasks: Task[] = [
    // Pending Tasks
    { id: 1, title: "Plumbing Repair", room: "Room 502 - Shared Cabin", priority: "High", date: "April 13, 2026", time: "11:59 PM", status: "Pending" },
    { id: 2, title: "AC Maintenance", room: "Room 301 - Deluxe Suite", priority: "Medium", date: "April 14, 2026", time: "02:00 PM", status: "Pending" },
    
    // In Progress Tasks
    { id: 3, title: "Electrical Wiring Fix", room: "Hallway B - Sector 2", priority: "High", date: "April 12, 2026", time: "04:30 PM", status: "In progress" },
    { id: 4, title: "Light Fixture Replacement", room: "Room 104 - Standard", priority: "Low", date: "April 15, 2026", time: "09:00 AM", status: "In progress" },
    
    // For Review Tasks
    { id: 5, title: "Generator Inspection", room: "Power Plant Room 1", priority: "High", date: "April 11, 2026", time: "12:00 PM", status: "For review" },
    
    // Completed Tasks
    { id: 6, title: "Water Leak Patching", room: "Basement Storage", priority: "Medium", date: "April 09, 2026", time: "03:15 PM", status: "Completed" },
    
    // Cancelled Tasks
    { id: 7, title: "Door Lock Upgrade", room: "Room 205 - Executive", priority: "Low", date: "April 08, 2026", time: "10:00 AM", status: "Cancelled" },
  ];

  // Helper helper to dynamically get the count of items in each status group
  const getCount = (status: Task['status']) => allTasks.filter(t => t.status === status).length;

  // Filter tasks based on selected filter state
  const filteredTasks = allTasks.filter(task => task.status === taskFilter);

  // Status color pill mapper for the task layout rows
  const getStatusBadgeClass = (status: Task['status']) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-100";
      case "In progress": return "bg-blue-50 text-blue-600 border-blue-100";
      case "For review": return "bg-purple-50 text-purple-600 border-purple-100";
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Cancelled": return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="bg-[#1c5d8a] text-white px-4 py-2.5 text-sm font-semibold tracking-wide rounded-t-lg">
        Task Assignment
      </h3>

      {/* Horizontal Filter Control Bar sub-tabs Row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 pt-1">
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {(['Pending', 'In progress', 'For review', 'Completed', 'Cancelled'] as Task['status'][]).map((status) => {
            const isActive = taskFilter === status;
            return (
              <button 
                key={status}
                type="button"
                onClick={() => setTaskFilter(status)} 
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                  isActive ? 'bg-[#2589d8] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200/70'
                }`}
              >
                {status} 
                <span className={`text-[10px] px-1.5 py-0.25 rounded-md font-bold transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {getCount(status)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Actions Dropdown Button */}
        <button type="button" className="border border-slate-200 text-slate-500 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 bg-white hover:bg-slate-50 flex-shrink-0">
          <SlidersHorizontal size={14} /> Filter by
        </button>
      </div>

      {/* Stacked Vertical Listing of Task Rows */}
      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all">
              
              {/* Thumbnail Image Left Box */}
              <div className="w-36 h-20 bg-slate-100 rounded-lg overflow-hidden relative flex-shrink-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=260&auto=format&fit=crop')` }}
                />
              </div>

              {/* Meta Text Center Stack info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-slate-800 tracking-wide truncate">{task.title}</h4>
                  <span className="bg-rose-50 text-rose-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-rose-100">
                    {task.priority}
                  </span>
                  <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mb-2">{task.room}</p>
                
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="text-rose-500">Target Date</span>  {task.date}
                  </span>
                  <span className="flex items-center gap-1">
                     {task.time}
                  </span>
                </div>
              </div>

              {/* Interactive Operational Actions Button block right */}
              <div className="flex-shrink-0 pr-2">
                <button type="button" className="bg-[#2589d8] text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-blue-600 shadow-sm transition-colors">
                  View details
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
            No tasks found under "{taskFilter}" state.
          </div>
        )}
      </div>
    </div>
  );
}