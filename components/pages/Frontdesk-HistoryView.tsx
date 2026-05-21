"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon, DoorOpen, CheckCircle, Clock, XCircle } from "lucide-react";
import { RoomData, Booking, HOURS } from "./frontdesk-types";

interface FrontdeskHistoryViewProps {
  rooms: RoomData[];
}

export default function FrontdeskHistoryView({ rooms }: FrontdeskHistoryViewProps) {
  // 🗓️ Filter States (Defaults to current year/month)
  const [historyYear, setHistoryYear] = useState(2026);
  const [historyMonth, setHistoryMonth] = useState(new Date().getMonth() + 1); // 1-12 indexed
  const [historySearch, setHistorySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // 🔄 Flatten bookings out of the nested room array safely
  const processedHistory = useMemo(() => {
    return rooms.flatMap((room) =>
      room.bookings.map((booking) => ({
        ...booking,
        roomNumber: room.room,
        roomType: room.type,
        floor: room.floor,
      }))
    );
  }, [rooms]);

  // 🔬 Live query filtration logic
  const filteredHistory = useMemo(() => {
    return processedHistory.filter((item) => {
      if (!item.date) return false;
      const [year, month] = item.date.split("-").map(Number);
      
      const matchesDate = year === historyYear && month === historyMonth;
      const matchesSearch = 
        item.name.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.roomNumber.includes(historySearch) ||
        item.id.toLowerCase().includes(historySearch.toLowerCase());
      const matchesStatus = statusFilter === "all" || item.type === statusFilter;

      return matchesDate && matchesSearch && matchesStatus;
    });
  }, [processedHistory, historyYear, historyMonth, historySearch, statusFilter]);

  const adjustHistoryMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (historyMonth === 1) {
        setHistoryMonth(12);
        setHistoryYear((prev) => prev - 1);
      } else {
        setHistoryMonth((prev) => prev - 1);
      }
    } else {
      if (historyMonth === 12) {
        setHistoryMonth(1);
        setHistoryYear((prev) => prev + 1);
      } else {
        setHistoryMonth((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-150 p-4 bg-slate-50/50 gap-4">
      
      {/* 🔍 Filter & Navigation Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
        
        {/* Month Picker */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 p-1 rounded-md w-full md:w-auto justify-between md:justify-start">
          <button onClick={() => adjustHistoryMonth("prev")} className="p-1 hover:bg-white rounded-sm text-slate-600 transition-all">
            <ChevronLeft size={14} />
          </button>
          <div className="flex items-center gap-1.5 px-3 text-xs font-bold text-slate-700 min-w-[110px] justify-center">
            <CalendarIcon size={12} className="text-blue-600" />
            {months[historyMonth - 1]} {historyYear}
          </div>
          <button onClick={() => adjustHistoryMonth("next")} className="p-1 hover:bg-white rounded-sm text-slate-600 transition-all">
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Input Bar */}
        <div className="relative w-full md:flex-1 md:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search name, room, or ID..."
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Badge Triggers */}
        <div className="flex gap-1 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["all", "approved", "requested", "maintenance"].map((type) => (
            <button
              key={type}
              onClick={() => setStatusFilter(type)}
              className={`px-2.5 py-1.5 text-[11px] font-semibold capitalize rounded-md transition-all whitespace-nowrap ${
                statusFilter === type
                  ? "bg-[#1e3a8a] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type === "requested" ? "Pending" : type}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 History Data Table Archive */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-4 py-3">Guest Details</th>
              <th className="px-4 py-3">Assigned Room</th>
              <th className="px-4 py-3">Stay Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Time block</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400 font-medium bg-white">
                  No archived records found for {months[historyMonth - 1]} {historyYear}.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <DoorOpen size={12} className="text-slate-400" />
                      <div>
                        <span className="font-semibold">Room {item.roomNumber}</span>
                        <span className="text-[10px] text-slate-400 block">{item.roomType}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-500">{item.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.type === "approved" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : item.type === "requested"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {item.type === "approved" && <CheckCircle size={10} />}
                      {item.type === "requested" && <Clock size={10} />}
                      {item.type === "maintenance" && <XCircle size={10} />}
                      {item.type === "requested" ? "Pending" : item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 font-medium">
                    {HOURS[item.start]} - {HOURS[item.end]}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}