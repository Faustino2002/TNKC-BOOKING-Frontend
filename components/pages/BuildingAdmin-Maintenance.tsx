"use client";

import React, { useState } from "react";
import { SlidersHorizontal, Search, ArrowLeft, Home, ChevronRight, Info, Eye, X } from "lucide-react";

// --- TYPES & INTERFACES ---
interface MaintenanceTicket {
  id: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  issueType: "Plumbing" | "Electrical" | "Furniture" | "Cleaning" | "Aircon";
  targetDate: string;
  assignedStaff: {
    name: string;
    isUnassigned: boolean;
  };
  status: "Pending" | "In Progress" | "For Review" | "Completed" | "Cancelled";
  reportedDate: string;
  details?: string;
  locationType?: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- CREATE NEW TICKET MODAL ---
function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-slate-800">
      <div className="bg-slate-50 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-[#2B92E4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg tracking-wide">Create New Ticket</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <form className="p-6 overflow-y-auto space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Section 1: Basic Information */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-black border-b border-slate-100 pb-2 uppercase tracking-wider opacity-70">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500">Ticket ID</label>
                <input 
                  type="text" 
                  value="TKT - 0025" 
                  disabled 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">Floor</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 focus:outline-none focus:border-[#2B92E4]">
                  <option>Choose floor</option>
                  <option>Floor 1</option>
                  <option>Floor 2</option>
                  <option>Floor 3</option>
                  <option>Floor 4</option>
                  <option>Floor 5</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">Room Number</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 focus:outline-none focus:border-[#2B92E4]">
                  <option>Choose room number</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Issue Details */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-black border-b border-slate-100 pb-2 uppercase tracking-wider opacity-70">
              Issue Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">Issue Type</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 focus:outline-none focus:border-[#2B92E4]">
                  <option>Choose issue type</option>
                  <option>Plumbing</option>
                  <option>Electrical</option>
                  <option>Furniture</option>
                  <option>Cleaning</option>
                  <option>Aircon</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">Priority</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 focus:outline-none focus:border-[#2B92E4]">
                  <option>Choose priority</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-600">Description</label>
              <textarea 
                rows={3}
                placeholder="Enter details here..."
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs font-medium placeholder-slate-300 resize-none min-h-[80px] focus:outline-none focus:border-[#2B92E4]"
              />
            </div>
          </div>

          {/* Section 3: Assignment */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-black border-b border-slate-100 pb-2 uppercase tracking-wider opacity-70">
              Assignment
            </h3>
            <div className="max-w-xs space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Assign Staff</label>
              <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 focus:outline-none focus:border-[#2B92E4]">
                <option>Choose staff</option>
                <option>John L. Doe</option>
                <option>Unassigned</option>
              </select>
            </div>
          </div>

          {/* Section 4: Dates */}
          <div className="bg-white border border-slate-200/60 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-black border-b border-slate-100 pb-2 uppercase tracking-wider opacity-70">
              Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">Reported Date</label>
                <input 
                  type="date" 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 focus:outline-none focus:border-[#2B92E4]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">Target Date</label>
                <input 
                  type="date" 
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 focus:outline-none focus:border-[#2B92E4]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-[#2B92E4] hover:bg-[#227ec9] rounded-lg transition-colors shadow-sm"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MAIN MAINTENANCE COMPONENT VIEW ---
export default function BuildingAdminMaintenance() {
  // Mock data reduced to exactly one ticket per status state
  const [tickets] = useState<MaintenanceTicket[]>([
    { id: "TKT - 0024", location: "Floor 2 - 201", priority: "Medium", issueType: "Plumbing", targetDate: "04/24/2026", assignedStaff: { name: "Unassigned", isUnassigned: true }, status: "Pending", reportedDate: "04/23/2026", details: "Common symptoms include slow drains, water discoloration, and low pressure, which can indicate leaks or corrosion within the system.", locationType: "Room - Single Cabin" },
    { id: "TKT - 0023", location: "Floor 3 - 301", priority: "High", issueType: "Electrical", targetDate: "04/23/2026", assignedStaff: { name: "John L. Doe", isUnassigned: false }, status: "In Progress", reportedDate: "04/22/2026" },
    { id: "TKT - 0022", location: "Floor 4 - 403", priority: "Medium", issueType: "Plumbing", targetDate: "04/23/2026", assignedStaff: { name: "John L. Doe", isUnassigned: false }, status: "For Review", reportedDate: "04/22/2026" },
    { id: "TKT - 0019", location: "Floor 4 - 401", priority: "Low", issueType: "Cleaning", targetDate: "04/23/2026", assignedStaff: { name: "John L. Doe", isUnassigned: false }, status: "Completed", reportedDate: "04/22/2026", details: "Change linen to maintain high hygiene standards, ensure guest comfort, and remove dirt, bacteria, and allergens that accumulate from daily use.", locationType: "Room - Shared Cabin" },
    { id: "TKT - 0014", location: "Floor 5 - 502", priority: "Medium", issueType: "Aircon", targetDate: "04/23/2026", assignedStaff: { name: "John L. Doe", isUnassigned: false }, status: "Cancelled", reportedDate: "04/22/2026" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [activeTab, setActiveTab] = useState<"Overview" | "Progress Update" | "History">("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTickets = tickets.filter((t) =>
    t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.issueType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- RENDERS SUB-VIEW ROUTE ---
  if (selectedTicket) {
    const isCompleted = selectedTicket.status === "Completed";
    const isInProgress = selectedTicket.status === "In Progress";
    const isPending = selectedTicket.status === "Pending";
    const isForReview = selectedTicket.status === "For Review";

    let progressTabSuffix = "";
    if (isCompleted || isForReview) progressTabSuffix = " 3";
    if (isInProgress) progressTabSuffix = " 1";

    return (
      <div className="flex-1 bg-[#f8fafc] p-8 min-h-screen flex flex-col text-slate-600">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm mb-6">
          <Home size={16} className="text-slate-400" />
          <ChevronRight size={14} className="text-slate-300" />
          <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => setSelectedTicket(null)}>
            Maintenance
          </span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-[#17466c] font-bold">{selectedTicket.id}</span>
        </div>

        {/* Header Block */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedTicket(null)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white shadow-sm"
          >
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <h1 className="text-3xl font-black text-[#17466c] tracking-tight flex items-center gap-3">
            <span>Maintenance</span>
            <span className="text-slate-300 font-light">|</span>
            <span className="text-[#1e4a6d]">{selectedTicket.id}</span>
          </h1>
        </div>

        {/* Display Control Tabs */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl w-fit mb-6 border border-slate-200/30">
          <button
            onClick={() => setActiveTab("Overview")}
            className={`px-6 py-2 rounded-lg font-semibold text-xs transition-all ${
              activeTab === "Overview" ? "bg-[#2a85d8] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("Progress Update")}
            className={`px-6 py-2 rounded-lg font-semibold text-xs transition-all ${
              activeTab === "Progress Update" ? "bg-[#2a85d8] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Progress Update{progressTabSuffix}
          </button>
          <button
            onClick={() => setActiveTab("History")}
            className={`px-6 py-2 rounded-lg font-semibold text-xs transition-all ${
              activeTab === "History" ? "bg-[#2a85d8] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            History
          </button>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium px-4 py-2.5 rounded-lg mb-6 shadow-sm">
            <Info size={14} className="text-slate-400 shrink-0" />
            <span>All action is disabled - this ticket has been completed</span>
          </div>
        )}

        {/* Overview Tab Content */}
        {activeTab === "Overview" && (
          <div className="space-y-6 text-slate-800">
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Quick Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket ID</span>
                  <span className="text-xs font-bold text-slate-800">{selectedTicket.id}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Type</span>
                  <span className="text-xs font-bold text-slate-800">{selectedTicket.issueType}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</span>
                  <div>
                    <span className={`inline-flex items-center text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                      selectedTicket.priority === "High" ? "bg-rose-50 text-rose-600 border-rose-100" :
                      selectedTicket.priority === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                  <div>
                    <span className={`inline-flex items-center text-[10px] px-2.5 py-0.5 rounded-full font-bold text-white ${
                      selectedTicket.status === "Pending" ? "bg-rose-500" :
                      selectedTicket.status === "In Progress" ? "bg-amber-500" :
                      selectedTicket.status === "For Review" ? "bg-[#1d5999]" : "bg-emerald-600"
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reported By</span>
                  <span className="text-xs font-medium text-slate-700">{selectedTicket.reportedDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Date</span>
                  <span className="text-xs font-medium text-slate-700">{selectedTicket.targetDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Staff</span>
                  <span className={`text-xs font-bold ${selectedTicket.assignedStaff.isUnassigned ? "text-rose-500" : "text-slate-800"}`}>
                    {selectedTicket.assignedStaff.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Location</h2>
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type</span>
                  <span className="text-xs font-medium text-slate-800">{selectedTicket.locationType || "Room - Single Cabin"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Details</span>
                  <span className="text-xs font-semibold text-[#1e4a6d]">{selectedTicket.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Issue Details</h2>
              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</span>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-4xl">
                    {selectedTicket.details || "Common symptoms include slow drains, water discoloration, and low pressure, which can indicate leaks or corrosion within the system."}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reported By</span>
                  <span className="text-xs font-semibold text-slate-700">Building Admin</span>
                </div>
              </div>
            </div>

            {!isCompleted && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button type="button" className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                  {selectedTicket.assignedStaff.isUnassigned ? "👤 Assign to Staff" : "👤 Reassign Staff"}
                </button>
                <button type="button" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
                  ✓ Mark as complete
                </button>
                <button type="button" className="inline-flex items-center gap-2 bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-rose-700 transition-all shadow-sm">
                  ✕ Cancel Ticket
                </button>
              </div>
            )}
          </div>
        )}

        {/* Progress Update Tab Content */}
        {activeTab === "Progress Update" && (
          <div className="space-y-6">
            {isPending && (
              <div className="bg-white border border-slate-200/70 rounded-2xl p-16 shadow-sm flex items-center justify-center min-h-[220px] max-w-2xl text-slate-800">
                <span className="text-sm font-bold text-black tracking-tight">No progress updates yet</span>
              </div>
            )}

            {isInProgress && (
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-4xl space-y-4">
                <span className="inline-flex items-center text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase">In Progress</span>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span>📅 April 13, 2026</span> <span>⏰ 11:59 PM</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</span>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
                    Grease buildup in kitchen vents, soap scum on shower tracks, dust behind appliances...
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Updated by</span>
                  <span className="text-xs font-bold text-slate-800">John L. Doe</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Photo Uploaded</span>
                  <span className="text-xs font-semibold text-slate-600 block mt-0.5">Image_Cleaning.jpg</span>
                </div>
              </div>
            )}

            {(isCompleted || isForReview) && (
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-4xl space-y-4">
                <span className="inline-flex items-center text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">Completed</span>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span>📅 April 13, 2026</span> <span>⏰ 12:00 PM</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</span>
                  <p className="text-xs font-medium text-slate-700">Change linen to maintain high hygiene standards...</p>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Updated by</span>
                  <span className="text-xs font-bold text-slate-800">John L. Doe</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Photo Uploaded</span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-slate-600">
                    <span>Image_Cleaning.jpg</span> <Eye size={14} className="text-slate-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab Content */}
        {activeTab === "History" && (
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm max-w-4xl space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Audit Log</h2>
              <span className="text-[11px] font-medium text-slate-400 mt-0.5 block">Complete history of action on this ticket</span>
            </div>
            <div className="border-t border-slate-100/80 pt-4 space-y-5">
              {isPending && (
                <div>
                  <span className="block text-xs font-bold text-slate-800">Ticket Created</span>
                  <span className="block text-[11px] font-medium text-slate-400 mt-0.5">by Building Admin ; April 21, 2026 12:00 PM</span>
                </div>
              )}
              {isInProgress && (
                <>
                  <div className="border-b border-slate-100 pb-4">
                    <span className="block text-xs font-bold text-slate-800">Ticket Created</span>
                    <span className="block text-[11px] font-medium text-slate-400 mt-0.5">by Building Admin ; April 21, 2026 12:00 PM</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400">Status updated to <strong className="font-bold text-slate-800">In Progress</strong></span>
                    <span className="block text-[11px] font-medium text-slate-400 mt-0.5">by John L. Doe ; April 21, 2026 12:00 PM</span>
                  </div>
                </>
              )}
              {(isCompleted || isForReview) && (
                <>
                  <div className="border-b border-slate-100 pb-4">
                    <span className="block text-xs font-bold text-slate-800">Ticket Created</span>
                    <span className="block text-[11px] font-medium text-slate-400 mt-0.5">by Building Admin ; April 21, 2026 12:00 PM</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-400">Task status marked as <strong className="font-bold text-slate-800">Completed</strong></span>
                    <span className="block text-[11px] font-medium text-slate-400 mt-0.5">by Building Admin ; April 21, 2026 12:00 PM</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- DEFAULT MAIN LIST GRID CONTAINER ---
  return (
    <div className="flex-1 bg-white p-8 min-h-screen flex flex-col text-slate-600">
      <h1 className="text-3xl font-bold text-[#17466c] tracking-tight mb-6">Maintenance</h1>

      <div className="flex-1 bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col">
        {/* Operations Control Panel */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-2 w-full max-w-md">
            <span className="text-slate-400"><SlidersHorizontal size={14} /></span>
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <div className="relative w-full flex items-center">
              <Search className="absolute left-1 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-6 text-xs text-slate-700 outline-none placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2a85d8] text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            Create new ticket +
          </button>
        </div>

        {/* Data Table View Framework */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 font-semibold text-[11px] tracking-wide border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">Ticket ID</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Issue Type</th>
                <th className="px-4 py-3 font-semibold">Assigned Staff</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Reported Date</th>
                <th className="px-4 py-3 font-semibold">Target Date</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-4 py-3.5 text-slate-400">{ticket.id}</td>
                  <td className="px-4 py-3.5 text-[#1e4a6d] font-semibold">{ticket.location}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                      ticket.priority === "High" ? "bg-rose-50 text-rose-600 border-rose-100" :
                      ticket.priority === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{ticket.issueType}</td>
                  <td className="px-4 py-3.5">
                    {ticket.assignedStaff.isUnassigned ? (
                      <span className="text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-100/50 inline-flex items-center gap-1">
                        👤 Unassigned <span className="text-xs">⚠️</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-[10px] text-slate-600 font-bold">
                          JD
                        </div>
                        <span className="text-slate-700">{ticket.assignedStaff.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center text-[10px] px-2.5 py-0.5 rounded-full font-bold text-white ${
                      ticket.status === "Pending" ? "bg-rose-600" :
                      ticket.status === "In Progress" ? "bg-[#dca122]" :
                      ticket.status === "For Review" ? "bg-[#1d5999]" : 
                      ticket.status === "Cancelled" ? "bg-slate-400" : "bg-emerald-600"
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{ticket.reportedDate}</td>
                  <td className="px-4 py-3.5 text-slate-500">{ticket.targetDate}</td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setActiveTab("Overview");
                      }}
                      className="bg-[#248ad6] text-white font-bold text-[11px] px-3 py-1 rounded shadow-sm hover:bg-blue-600 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Controller */}
      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}