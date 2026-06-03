"use client";

import React from "react";
import { Camera, Coins } from "lucide-react";

interface WorkHistoryItem {
  id: number;
  title: string;
  room: string;
  priority: string;
  date: string;
  time: string;
  hasPhoto: boolean;
  isPaid: boolean;
}

export default function BuildingAdminStaffWorkHistory() {
  // Mock data array tracking completed past tasks for this specific staff member
  const historyData: WorkHistoryItem[] = [
    { id: 1, title: "Plumbing", room: "Room 502 - Shared Cabin", priority: "High", date: "April 13, 2026", time: "11:59 PM", hasPhoto: true, isPaid: true },
    { id: 2, title: "Plumbing", room: "Room 502 - Shared Cabin", priority: "High", date: "April 13, 2026", time: "11:59 PM", hasPhoto: true, isPaid: true },
    { id: 3, title: "Plumbing", room: "Room 502 - Shared Cabin", priority: "High", date: "April 13, 2026", time: "11:59 PM", hasPhoto: true, isPaid: true },
    { id: 4, title: "Plumbing", room: "Room 502 - Shared Cabin", priority: "High", date: "April 13, 2026", time: "11:59 PM", hasPhoto: true, isPaid: true },
    { id: 5, title: "Plumbing", room: "Room 502 - Shared Cabin", priority: "High", date: "April 13, 2026", time: "11:59 PM", hasPhoto: true, isPaid: true },
  ];

  return (
    <div className="space-y-4">
      {/* Container Title Header styled exactly like image_9e5883.png */}
      <h3 className="bg-[#1c5d8a] text-white px-4 py-2.5 text-sm font-semibold tracking-wide rounded-t-lg">
        Booking History
      </h3>

      {/* Scrollable List Container */}
      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
        {historyData.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all"
          >
            {/* Left Image Thumbnail */}
            <div className="w-36 h-20 bg-slate-100 rounded-lg overflow-hidden relative flex-shrink-0">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=260&auto=format&fit=crop')` }}
              />
            </div>

            {/* Middle Content Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold text-slate-800 tracking-wide">{item.title}</h4>
                
                {/* Priority Label */}
                <span className="bg-rose-50 text-rose-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-rose-100">
                  {item.priority}
                </span>

                {/* Photo Evidence Indicator Status */}
                {item.hasPhoto && (
                  <span className="p-1 bg-blue-50 text-blue-500 rounded border border-blue-100/50" title="Photo evidence attached">
                    <Camera size={11} strokeWidth={2.5} />
                  </span>
                )}

                {/* Billable/Paid Indicator Status */}
                {item.isPaid && (
                  <span className="p-1 bg-amber-50 text-amber-500 rounded border border-amber-100/50" title="Payment complete">
                    <Coins size={11} strokeWidth={2.5} />
                  </span>
                )}
              </div>

              {/* Location Room Description */}
              <p className="text-xs text-slate-600 font-medium mb-2">{item.room}</p>
              
              {/* Completed Date / Time stamps */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  📅 {item.date}
                </span>
                <span className="flex items-center gap-1">
                  ⏰ {item.time}
                </span>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex-shrink-0 pr-2">
              <button 
                type="button" 
                className="bg-[#2589d8] text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-blue-600 shadow-sm transition-colors"
              >
                View Details
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}