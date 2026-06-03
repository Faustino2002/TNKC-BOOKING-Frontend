"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Calendar as CalendarIcon, 
  Download, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

// --- IMPORT NEW DETAILED COMPONENT ---
import BuildingAdminReportsDetails from "./BuildingAdmin-ReportsDetails";

// --- TYPES & INTERFACES ---
interface Transaction {
  number: number;
  name: string;
  initials: string;
  room: string;
  roomCharge: number;
  meal: string;
  mealCharge: number;
  periodCovered: string; // Used to filter data dynamically
  grandTotal: number;
}

export default function BuildingAdminReports() {
  // --- FIXED: TRACK THE SELECTED OBJECT INSTEAD OF A PLAIN STRING VIEW STATE ---
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [isMealSummaryOpen, setIsMealSummaryOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("");
  
  // --- CALENDAR STATES ---
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Default to May 2026 to align with your mock data
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4 rows with distinct, highly searchable unique names and dates in 2026
  const [transactions] = useState<Transaction[]>([
    { number: 1, name: "Liam O. Conner", initials: "LC", room: "201", roomCharge: 2300.00, meal: "Breakfast, Lunch, Dinner", mealCharge: 1250.00, periodCovered: "May 11 2026", grandTotal: 3550.00 },
    { number: 2, name: "Sarah J. Gomez", initials: "SG", room: "301", roomCharge: 3000.00, meal: "Breakfast, Lunch, Dinner", mealCharge: 1500.00, periodCovered: "May 03 2026", grandTotal: 4500.00 },
    { number: 3, name: "Marcus A. Chen", initials: "MC", room: "403", roomCharge: 4000.00, meal: "Breakfast, Lunch, Dinner", mealCharge: 3200.00, periodCovered: "Mar 28 2026", grandTotal: 7200.00 },
    { number: 4, name: "Elena R. Petrov", initials: "EP", room: "205", roomCharge: 1000.00, meal: "Breakfast, Lunch, Dinner", mealCharge: 2000.00, periodCovered: "Mar 14 2026", grandTotal: 3000.00 },
  ]);

  // --- CONDITIONAL VIEW RETURN WITH PROP INJECTION ---
  if (selectedTransaction !== null) {
    return (
      <BuildingAdminReportsDetails 
        transaction={selectedTransaction} 
        onBack={() => setSelectedTransaction(null)} 
      />
    );
  }

  // --- FILTER LOGIC (SEARCH + DATE RANGE) ---
  const filteredTransactions = transactions.filter((t) => {
    // 1. Text Search Filter
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.room.includes(searchQuery);

    // 2. Date Range Filter
    if (startDate) {
      const transactionDate = new Date(t.periodCovered);
      
      // Normalize times to midnight for perfect day-by-day comparison matches
      const txTime = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate()).getTime();
      const startWithNoTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
      
      if (endDate) {
        const endWithNoTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
        return matchesSearch && txTime >= startWithNoTime && txTime <= endWithNoTime;
      }
      
      // If only a start date is selected so far, show only that specific day's records
      return matchesSearch && txTime === startWithNoTime;
    }

    return matchesSearch;
  });

  // --- CALENDAR GENERATION LOGIC ---
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
        setIsCalendarOpen(false); // Close modal when range choice finishes execution
        setDateRange(
          `${months[startDate.getMonth()]} ${startDate.getDate()} - ${months[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`
        );
      }
    }
  };

  // Helper arrays for calculating calendar cells
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Padding previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: prevMonthTotalDays - i, currentMonth: false });
    }
    
    // Appending current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, currentMonth: true });
    }
    
    // Remaining cell window padding
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

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setDateRange("");
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] p-8 min-h-screen text-slate-700">
      {/* View Title */}
      <h1 className="text-4xl font-extrabold text-[#17466C] tracking-tight mb-6">Reports</h1>

      {/* --- COLLAPSIBLE MEAL SUMMARY CARDS PANEL --- */}
      <div className="mb-6 bg-transparent">
        <button
          type="button"
          onClick={() => setIsMealSummaryOpen(!isMealSummaryOpen)}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <span>Meal Summary</span>
          {isMealSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isMealSummaryOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
            {/* Breakfast Card */}
            <div className="bg-gradient-to-b from-[#2B92E4] to-[#1E77C2] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold opacity-90">Breakfast</span>
                <span className="opacity-40">🍳</span>
              </div>
              <div className="text-4xl font-black mb-3">12</div>
              <div className="flex items-center gap-1.5 text-[11px] bg-white/10 px-2 py-0.5 rounded-md w-fit">
                <span className="font-bold border border-white/30 px-1 rounded text-[9px]">13⌃</span>
                <span className="opacity-80">Increased from last month</span>
              </div>
            </div>

            {/* Lunch Card */}
            <div className="bg-gradient-to-b from-[#2B92E4] to-[#1E77C2] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold opacity-90">Lunch</span>
                <span className="opacity-40">🍗</span>
              </div>
              <div className="text-4xl font-black mb-3">12</div>
              <div className="flex items-center gap-1.5 text-[11px] bg-white/10 px-2 py-0.5 rounded-md w-fit">
                <span className="font-bold border border-white/30 px-1 rounded text-[9px]">13⌃</span>
                <span className="opacity-80">Increased from last month</span>
              </div>
            </div>

            {/* Dinner Card */}
            <div className="bg-gradient-to-b from-[#1B5080] to-[#143E64] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold opacity-90">Dinner</span>
                <span className="opacity-40">🍲</span>
              </div>
              <div className="text-4xl font-black mb-3">80</div>
              <div className="flex items-center gap-1.5 text-[11px] bg-white/10 px-2 py-0.5 rounded-md w-fit">
                <span className="font-bold border border-white/30 px-1 rounded text-[9px]">13⌃</span>
                <span className="opacity-80">Increased from last month</span>
              </div>
            </div>

            {/* Grand Total Card */}
            <div className="bg-gradient-to-b from-[#1B5080] to-[#143E64] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold opacity-90">Grand Total</span>
                <span className="opacity-40">₱</span>
              </div>
              <div className="text-4xl font-black mb-3">80</div>
              <div className="flex items-center gap-1.5 text-[11px] bg-white/10 px-2 py-0.5 rounded-md w-fit">
                <span className="font-bold border border-white/30 px-1 rounded text-[9px]">13⌃</span>
                <span className="opacity-80">Increased from last month</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- GUEST SERVICE TRANSACTION TABLE FRAMEWORK --- */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Guest Service Transaction</h2>
          {startDate && (
            <button 
              onClick={clearDateFilter}
              className="text-xs text-red-500 hover:text-red-600 font-bold transition-colors"
            >
              Clear Date Filter
            </button>
          )}
        </div>
        
        {/* Operations Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Search Box Control */}
          <div className="relative w-full max-w-sm flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs shadow-sm focus-within:border-[#2B92E4] transition-colors">
            <Search className="text-slate-400 mr-2" size={14} />
            <input
              type="text"
              placeholder="Search by name or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none placeholder-slate-400 font-medium text-slate-700"
              name="reportSearch"
            />
          </div>

          {/* Filter Options & Export Block */}
          <div className="flex items-center gap-3 relative" ref={calendarRef}>
            {/* Clickable Date Range Launcher Trigger */}
            <div 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="relative flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs shadow-sm cursor-pointer hover:bg-slate-50 select-none"
            >
              <CalendarIcon className="text-slate-400 mr-2" size={14} />
              <input 
                type="text"
                placeholder="Select date range"
                value={dateRange}
                readOnly
                className="bg-transparent outline-none font-medium text-slate-700 cursor-pointer w-36 placeholder-slate-400 overflow-hidden text-ellipsis whitespace-nowrap"
                name="reportDateRange"
              />
            </div>

            {/* --- FLOATING CALENDAR MODAL COMPONENT --- */}
            {isCalendarOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl p-4 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronLeft size={16} /></button>
                  <span className="text-xs font-bold text-slate-800">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronRight size={16} /></button>
                </div>

                {/* Day labels */}
                <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 mb-2">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>

                {/* Month Days */}
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

            <button
              type="button"
              className="bg-[#2B92E4] hover:bg-[#207fcc] text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download size={14} />
              <span>Export data</span>
            </button>
          </div>
        </div>

        {/* Data Table View Viewport */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-bold text-[11px] tracking-wide border-b border-slate-100 uppercase">
                <th className="px-4 py-3.5 font-bold">Number</th>
                <th className="px-4 py-3.5 font-bold">Name</th>
                <th className="px-4 py-3.5 font-bold">Room</th>
                <th className="px-4 py-3.5 font-bold">Room Charge</th>
                <th className="px-4 py-3.5 font-bold">Meal</th>
                <th className="px-4 py-3.5 font-bold">Meal Charge</th>
                <th className="px-4 py-3.5 font-bold">Period Covered</th>
                <th className="px-4 py-3.5 font-bold">Grand Total</th>
                <th className="px-4 py-3.5 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {filteredTransactions.map((tx) => (
                <tr key={tx.number} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-4 py-4 text-slate-400 font-medium">{tx.number}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] text-slate-600 font-bold shrink-0 uppercase">
                        {tx.initials}
                      </div>
                      <span className="text-slate-800 font-bold">{tx.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{tx.room}</td>
                  <td className="px-4 py-4 text-slate-700">₱ {tx.roomCharge.toFixed(2)}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium max-w-[160px] truncate">{tx.meal}</td>
                  <td className="px-4 py-4 text-slate-700">₱ {tx.mealCharge.toFixed(2)}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{tx.periodCovered}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                      <span>₱ {tx.grandTotal.toFixed(2)}</span>
                      <span className="text-slate-300 text-[10px]">↓</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedTransaction(tx)} // FIXED: Updates object tracking state instead of plain string view state
                      className="bg-[#2B92E4] hover:bg-[#207fcc] text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                    >
                      More details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400 font-medium">
                    No matching transactions found within this date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- DATA PAGINATION REGISTRY --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-5 mt-4 gap-4 text-xs font-semibold text-slate-400">
          <span>Showing 1-{filteredTransactions.length} out of {transactions.length}</span>

          <div className="flex items-center gap-1">
            <button type="button" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors flex items-center gap-0.5">
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            
            <button type="button" className="w-7 h-7 flex items-center justify-center bg-[#D2E7F7] text-[#1E77C2] font-bold rounded-lg transition-all shadow-sm">
              1
            </button>
            <button type="button" className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 text-slate-600 rounded-lg transition-all">
              2
            </button>
            <button type="button" className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 text-slate-600 rounded-lg transition-all">
              3
            </button>
            <span className="px-1 tracking-widest text-slate-300">...</span>

            <button type="button" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors flex items-center gap-0.5">
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}