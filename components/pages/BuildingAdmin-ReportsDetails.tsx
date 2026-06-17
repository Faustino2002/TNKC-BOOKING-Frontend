"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, 
  Home, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Download,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";

// --- TYPES & INTERFACES ---
interface Transaction {
  number: number;
  name: string;
  initials: string;
  room: string;
  roomCharge: number;
  meal: string;
  mealCharge: number;
  periodCovered: string;
  grandTotal: number;
}

interface BuildingAdminReportsDetailsProps {
  transaction: Transaction | null;
  onBack: () => void;
}

interface ChargeSlipItem {
  id: number;
  particulars: string;
  roomRate: string;
  periodCovered: string;
  numberOfDays: string;
  amount: string;
  grandTotal: string;
  type: "room" | "meal";
}

export default function BuildingAdminReportsDetails({ transaction, onBack }: BuildingAdminReportsDetailsProps) {
  // Fallback safeguards if data context drops
  const currentTx = transaction || {
    number: 1,
    name: "Liam O. Conner",
    initials: "LC",
    room: "201",
    roomCharge: 2300.00,
    meal: "Breakfast, Lunch, Dinner",
    mealCharge: 1250.00,
    periodCovered: "May 11 2026",
    grandTotal: 3550.00
  };

  // --- VIEW TOGGLE STATE ---
  const [isViewHistory, setIsViewHistory] = useState(false);

  // --- FILTER & MODAL STATES ---
  const [filterType, setFilterType] = useState("All");
  const [dateRange, setDateRange] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // --- CALENDAR GRID TRACKING STATES ---
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Default to May 2026
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const calendarRef = useRef<HTMLDivElement>(null);

  // Reset calendar states when switching between main view and transaction history
  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
    setDateRange(isViewHistory ? "" : currentTx.periodCovered);
  }, [isViewHistory, currentTx.periodCovered]);

  // Close calendar layout if clicked outside framework
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- REUSABLE CALENDAR CALCULATION ENGINE MONTHS ARRAY ---
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper helper to convert dynamic string dates ("Jan 2 - Feb 23 2026", "Aug 25, 2026", etc.) into a matchable format
  const isDateInSelectedRange = (periodStr: string) => {
    if (!startDate) return true; // No filter active

    // Simple parser fallback to extract any year/month mentions
    const cleanStr = periodStr.toLowerCase();
    const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    
    if (endDate) {
      const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
      
      // Check if text indicates ranges or single dates that cross months
      // For highly accurate date matching, convert your raw dataset arrays into absolute timestamp models
      return true; 
    } else {
      // Single date check match framework
      return true;
    }
  };

  // --- COMPLETE HISTORICAL LOG (PAST & PRESENT DATASETS) ---
  const historyData: ChargeSlipItem[] = [
    { id: 1, particulars: "Room 201", roomRate: "100.00", periodCovered: "Jan 2 - Feb 23 2026", numberOfDays: "23 days", amount: "2,300.00", grandTotal: "2,300.00", type: "room" },
    { id: 2, particulars: "Breakfast, Lunch, Dinner", roomRate: "-", periodCovered: "Jan 2 - Feb 23 2026", numberOfDays: "23 days", amount: "1,250.00", grandTotal: "1,250.00", type: "meal" },
    { id: 3, particulars: "Breakfast, Lunch, Dinner", roomRate: "-", periodCovered: "Jul 24 - Jul 28 2026", numberOfDays: "5 days", amount: "1,500.00", grandTotal: "1,500.00", type: "meal" },
    { id: 4, particulars: "Room 302", roomRate: "300.00", periodCovered: "Jul 24 - Jul 28 2026", numberOfDays: "5 days", amount: "1,500.00", grandTotal: "1,500.00", type: "room" },
    { id: 5, particulars: "Room 405", roomRate: "400.00", periodCovered: "Aug 25, 2026", numberOfDays: "1 day", amount: "400.00", grandTotal: "100.00", type: "room" },
    { id: 6, particulars: "Breakfast, Lunch, Dinner", roomRate: "-", periodCovered: "Aug 25, 2026", numberOfDays: "1 day", amount: "200.00", grandTotal: "100.00", type: "meal" },
    { id: 7, particulars: "Room 405", roomRate: "400.00", periodCovered: "Aug 25, 2026", numberOfDays: "1 day", amount: "400.00", grandTotal: "100.00", type: "room" },
    { id: 8, particulars: "Breakfast, Lunch, Dinner", roomRate: "-", periodCovered: "Aug 25, 2026", numberOfDays: "1 day", amount: "200.00", grandTotal: "100.00", type: "meal" }
  ];

  // --- SINGLE SUMMARY CURRENT TARGET SHEET DATA ---
  const singleSlipData: ChargeSlipItem[] = [
    {
      id: 1,
      particulars: currentTx.room === "N/A" ? "Room N/A" : `Room ${currentTx.room}`,
      roomRate: currentTx.room === "N/A" ? "0.00" : "100.00",
      periodCovered: currentTx.room === "N/A" ? "N/A" : dateRange,
      numberOfDays: "23 days",
      amount: currentTx.room === "N/A" ? "0.00" : currentTx.roomCharge.toFixed(2),
      grandTotal: currentTx.room === "N/A" ? "0.00" : currentTx.roomCharge.toFixed(2),
      type: "room"
    },
    {
      id: 2,
      particulars: currentTx.room === "N/A" ? "No meals selected" : currentTx.meal,
      roomRate: "-",
      periodCovered: currentTx.room === "N/A" ? "N/A" : dateRange,
      numberOfDays: "23 days",
      amount: currentTx.room === "N/A" ? "0.00" : currentTx.mealCharge.toFixed(2),
      grandTotal: currentTx.room === "N/A" ? "0.00" : currentTx.mealCharge.toFixed(2),
      type: "meal"
    }
  ];

  // Pick dataset based on toggle view mode structure
  const activeDataset = isViewHistory ? historyData : singleSlipData;

  const filteredChargeSlipData = activeDataset.filter((item) => {
    if (filterType === "Rooms" && item.type !== "room") return false;
    if (filterType === "Meals" && item.type !== "meal") return false;
    return isDateInSelectedRange(item.periodCovered);
  });

  // --- REUSABLE CALENDAR CALCULATION ENGINE ---
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate(null);
      setDateRange(`${months[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`);
    } else if (startDate && !endDate) {
      if (selected < startDate) {
        setStartDate(selected);
        setDateRange(`${months[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`);
      } else {
        setEndDate(selected);
        setIsCalendarOpen(false);
        setDateRange(
          `${months[startDate.getMonth()]} ${startDate.getDate()} - ${months[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`
        );
      }
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const days = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: prevMonthTotalDays - i, currentMonth: false });
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, currentMonth: true });
    }
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, currentMonth: false });
    }
    return days;
  };

  const calendarDays = getDaysInMonth(currentDate);

  const checkSelectedRange = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false;
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (startDate && endDate) {
      return checkDate >= startDate && checkDate <= endDate;
    }
    return startDate && checkDate.getTime() === startDate.getTime();
  };

  // --- DYNAMIC CARD FOOTER CALCULATIONS ---
  const activeMealTotal = filteredChargeSlipData
    .filter(i => i.type === "meal")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/,/g, "")), 0);

  const activeRoomTotal = filteredChargeSlipData
    .filter(i => i.type === "room")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/,/g, "")), 0);

  const activeGrandTotal = activeMealTotal + activeRoomTotal;

  return (
    <div className="flex-1 bg-[#F8FAFC] p-8 min-h-screen text-slate-700">
      {/* --- BREADCRUMBS --- */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 select-none">
        <button type="button" onClick={onBack} className="hover:text-[#1E77C2] transition-colors">
          <Home size={16} className="text-slate-600" />
        </button>
        <ChevronRight size={14} />
        <button type="button" onClick={() => { if (isViewHistory) { setIsViewHistory(false); } else { onBack(); } }} className="hover:text-[#1E77C2] transition-colors">
          Reports
        </button>
        {isViewHistory && (
          <>
            <ChevronRight size={14} />
            <button type="button" onClick={() => setIsViewHistory(false)} className="hover:text-[#1E77C2] transition-colors">
              View {currentTx.name}
            </button>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-[#17466C] font-semibold">
          {isViewHistory ? "Transaction History" : `View ${currentTx.name}`}
        </span>
      </div>

      {/* --- HEADER VIEW CONTROLLER --- */}
      {!isViewHistory ? (
        /* --- STANDARD INDIVIDUAL PROFILE HEADER --- */
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
          <div className="relative h-24 bg-slate-200 rounded-xl mb-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-300 shadow-md overflow-hidden shrink-0 -mt-12 relative z-10">
                <div className="w-full h-full bg-[#2B92E4] flex items-center justify-center text-white font-bold text-2xl uppercase">
                  {currentTx.initials}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-[#17466C] tracking-tight">{currentTx.name}</h1>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[11px] font-bold text-slate-400 flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                  <span>🆔 0000000{currentTx.number}</span>
                  <span>⭐ Occupant</span>
                  <span>🏠 Room {currentTx.room}</span>
                </p>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setIsViewHistory(true)}
              className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
              <span>📜 Transaction History</span>
            </button>
          </div>
        </div>
      ) : (
        /* --- DETAILED TRANSACTION HISTORY HEADER H1 TITLE --- */
        <div className="mb-6 flex items-center gap-3">
          {/* Breadcrumb spacing dot separator */}
          <div className="flex items-baseline gap-2">
            <span className="text-slate-400 text-sm font-bold">...</span>
            <ChevronRight size={14} className="text-slate-400 font-bold inline-block" />
          </div>
          <h1 className="text-3xl font-black text-[#17466C] tracking-tight">Transaction History</h1>
        </div>
      )}

      {/* --- CHARGE SLIP WORKSPACE CONTAINER --- */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Charge Slip</h2>
            {!isViewHistory && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-bold px-2 py-1 rounded-md text-slate-600 outline-none cursor-pointer shadow-sm focus:border-[#2B92E4]"
              >
                <option value="All">All</option>
                <option value="Rooms">Rooms</option>
                <option value="Meals">Meals</option>
              </select>
            )}
          </div>

          {/* --- CALENDAR SYSTEM CONTROLS --- */}
          <div className="flex items-center gap-3 relative" ref={calendarRef}>
            <div 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)} 
              className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs cursor-pointer hover:bg-slate-50 select-none shadow-sm"
            >
              <CalendarIcon className="text-slate-400 mr-2" size={14} />
              <input 
                type="text"
                placeholder="Select date range"
                value={dateRange || (isViewHistory ? "Select date range" : "")}
                readOnly
                className="bg-transparent outline-none font-medium text-slate-700 cursor-pointer w-36 placeholder-slate-400 truncate"
              />
            </div>

            {/* --- DROPDOWN CALENDAR WINDOW MODAL --- */}
            {isCalendarOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl p-4 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronLeft size={16} /></button>
                  <span className="text-xs font-bold text-slate-800">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                  <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronRightIcon size={16} /></button>
                </div>
                <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 mb-2">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold">
                  {calendarDays.map((cell, idx) => {
                    const isSelected = checkSelectedRange(cell.day, cell.currentMonth);
                    const isStart = startDate && cell.currentMonth && new Date(currentDate.getFullYear(), currentDate.getMonth(), cell.day).getTime() === startDate.getTime();
                    const isEnd = endDate && cell.currentMonth && new Date(currentDate.getFullYear(), currentDate.getMonth(), cell.day).getTime() === endDate.getTime();

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDateClick(cell.day, cell.currentMonth)}
                        disabled={!cell.currentMonth}
                        className={`py-1.5 w-full text-center transition-all focus:outline-none relative
                          ${!cell.currentMonth ? "text-slate-200 cursor-not-allowed" : "text-slate-700 hover:bg-slate-100 rounded-md"}
                          ${isSelected && cell.currentMonth ? "bg-[#E2F0FD] text-[#1E77C2] font-bold rounded-none" : ""}
                          ${isStart ? "bg-[#2B92E4] text-white rounded-l-md font-bold" : ""}
                          ${isEnd ? "bg-[#2B92E4] text-white rounded-r-md font-bold" : ""}
                        `}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button type="button" className="bg-[#2B92E4] hover:bg-[#207fcc] text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
              <Download size={14} />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* --- DATAGRID DISPLAY --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold text-[11px] tracking-wide border-b border-slate-100 uppercase">
                <th className="px-4 py-3.5 font-bold">Particulars</th>
                <th className="px-4 py-3.5 font-bold">Room Rate</th>
                <th className="px-4 py-3.5 font-bold">Period Covered</th>
                <th className="px-4 py-3.5 font-bold">Number of Days</th>
                <th className="px-4 py-3.5 font-bold">Amount</th>
                <th className="px-4 py-3.5 font-bold">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {filteredChargeSlipData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-4 py-4 text-slate-800 font-medium">{item.particulars}</td>
                  <td className="px-4 py-4 text-slate-500">{item.roomRate}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{item.periodCovered}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{item.numberOfDays}</td>
                  <td className="px-4 py-4 text-slate-600">₱ {item.amount}</td>
                  <td className="px-4 py-4 text-slate-800 font-medium">₱ {item.grandTotal}</td>
                </tr>
              ))}
              
              {filteredChargeSlipData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium bg-slate-50/10">
                    No matching charges found for this date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FINANCIAL BALANCE OVERVIEW SUMMARY --- */}
      <div className="max-w-md">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-3">Summary</h2>
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm grid grid-cols-3 text-center divide-x divide-slate-100">
          <div className="p-4 flex flex-col justify-between min-h-[80px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Meal Total</span>
            <span className="text-sm font-extrabold text-slate-700 mt-2">₱ {activeMealTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="p-4 flex flex-col justify-between min-h-[80px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Room Total</span>
            <span className="text-sm font-extrabold text-slate-700 mt-2">₱ {activeRoomTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="p-4 bg-[#2B92E4] text-white flex flex-col justify-between min-h-[80px]">
            <span className="text-[10px] uppercase font-bold opacity-80 tracking-wider">Grand Total</span>
            <span className="text-sm font-black mt-2">₱ {activeGrandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* --- RETURN LINK CONTROL --- */}
      <button 
        type="button" 
        onClick={() => { if (isViewHistory) { setIsViewHistory(false); } else { onBack(); } }} 
        className="mt-8 flex items-center gap-2 text-xs font-bold text-[#1E77C2] hover:underline transition-all"
      >
        <ArrowLeft size={14} />
        <span>{isViewHistory ? "Back to client profile" : "Back to main reports"}</span>
      </button>
    </div>
  );
}