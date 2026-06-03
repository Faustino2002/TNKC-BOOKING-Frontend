"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus, Search, X } from "lucide-react";

interface FloorData {
  id: number;
  name: string;
  level: number;
  status: "Active" | "Inactive";
  notes: string;
}

export default function BuildingAdminFloorManagement() {
  const [mockFloors, setMockFloors] = useState<FloorData[]>([
    { id: 1, name: "Floor 2", level: 2, status: "Active", notes: "Hiatus due to renovation" },
    { id: 2, name: "Floor 3", level: 3, status: "Active", notes: "Hiatus due to renovation" },
    { id: 3, name: "Floor 4", level: 4, status: "Active", notes: "New painting" },
    { id: 4, name: "Floor 5", level: 5, status: "Active", notes: "None" },
    { id: 5, name: "Penthouse", level: 6, status: "Active", notes: "None" },
  ]);

  // Operational Control States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<FloorData | null>(null);
  
  // Dynamic Success Notification Messaging Control
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  // Form Field Tracking Inputs
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    status: "Active" as "Active" | "Inactive",
    notes: ""
  });

  // Open Edit Dialog and Pre-populate standard values
  const handleEditClick = (floor: FloorData) => {
    setSelectedFloor(floor);
    setFormData({
      name: floor.name,
      level: floor.level.toString(),
      status: floor.status,
      notes: floor.notes === "None" ? "" : floor.notes
    });
    setIsEditModalOpen(true);
  };

  // Save Mutations Back to Data List Array State
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFloor || !formData.name || !formData.level) return;

    setMockFloors(
      mockFloors.map((f) =>
        f.id === selectedFloor.id
          ? {
              ...f,
              name: formData.name,
              level: parseInt(formData.level, 10),
              status: formData.status,
              notes: formData.notes || "None",
            }
          : f
      )
    );

    setIsEditModalOpen(false);
    
    setToastMessage({
      title: "Update floor successfully",
      subtitle: "You have updated floor details successfully"
    });

    setFormData({ name: "", level: "", status: "Active", notes: "" });
  };

  // Trigger Confirmation Modal Layout
  const handleDeleteClick = (floor: FloorData) => {
    setSelectedFloor(floor);
    setIsDeleteModalOpen(true);
  };

  // Perform Array State Mutation Deletion Row Step
  const handleConfirmDelete = () => {
    if (selectedFloor) {
      setMockFloors(mockFloors.filter((f) => f.id !== selectedFloor.id));
      setToastMessage({
        title: "Delete floor successfully",
        subtitle: "You have deleted floor successfully"
      });
    }
    setIsDeleteModalOpen(false);
  };

  // Handle Input Submission Form Record Insertion Entry
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.level) return;

    const newFloor: FloorData = {
      id: Date.now(),
      name: formData.name,
      level: parseInt(formData.level, 10),
      status: formData.status,
      notes: formData.notes || "None"
    };

    setMockFloors([...mockFloors, newFloor]);
    setIsAddModalOpen(false);
    
    setToastMessage({
      title: "Add floor successfully",
      subtitle: "You have added floor successfully"
    });

    setFormData({ name: "", level: "", status: "Active", notes: "" });
  };

  // Auto-dismiss operational popup notices safely
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
        setSelectedFloor(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-100 p-6 shadow-sm relative">
      
      {/* ========================================================= */}
      {/* SUCCESS TOAST OVERLAY DECK MESSAGE NOTIFICATION PANEL      */}
      {/* ========================================================= */}
      {toastMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[0.5px]">
          <div className="bg-white rounded-lg p-5 max-w-[380px] w-full shadow-xl border border-slate-100 flex items-start gap-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 p-2.5 rounded-lg text-[#137333] flex items-center justify-center shrink-0 border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#137333]">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.14-.082l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 flex flex-col pt-0.5 pr-2">
              <h3 className="text-base font-bold text-[#137333] tracking-tight leading-none">
                {toastMessage.title}
              </h3>
              <p className="text-slate-500 text-xs font-medium mt-1.5 leading-relaxed">
                {toastMessage.subtitle}
              </p>
            </div>
            <button type="button" onClick={() => setToastMessage(null)} className="text-slate-300 hover:text-slate-500 transition-colors pt-0.5">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Control Action Management Header Ribbon Row Layout */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 w-full max-w-md">
          <span className="text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
          </span>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <div className="relative w-full flex items-center">
            <Search className="absolute left-1 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent pl-6 text-xs text-slate-700 outline-none placeholder-slate-400"
            />
          </div>
        </div>

        <button 
          type="button"
          onClick={() => {
            setFormData({ name: "", level: "", status: "Active", notes: "" });
            setIsAddModalOpen(true);
          }}
          className="bg-[#2a85d8] text-white font-medium text-xs px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1.5 transition-colors shadow-sm"
        >
          Add Floor <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Main Structural Layout Data List Deck Workspace Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 text-slate-500 font-semibold text-[11px] tracking-wide border-b border-slate-100">
              <th className="px-4 py-3">Floor Name</th>
              <th className="px-4 py-3">Floor Level</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {mockFloors.map((floor) => (
              <tr key={floor.id} className="hover:bg-slate-50/40 transition-colors">
                <td className="px-4 py-4 font-medium text-slate-600">{floor.name}</td>
                <td className="px-4 py-4 text-slate-500">{floor.level}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 font-semibold text-[10px] px-2.5 py-0.5 rounded-full ${
                    floor.status === "Active" 
                      ? "bg-[#def2e6] text-[#1e7e34]" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${floor.status === "Active" ? "bg-[#28a745]" : "bg-slate-400"}`} /> 
                    {floor.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-400 max-w-xs truncate">{floor.notes}</td>
                <td className="px-4 py-4 text-right pr-6">
                  <div className="flex items-center justify-end gap-3 text-slate-400">
                    <button type="button" onClick={() => handleDeleteClick(floor)} className="hover:text-rose-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                    <button type="button" onClick={() => handleEditClick(floor)} className="hover:text-blue-500 transition-colors">
                      <Edit size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Structural Pagination Counter Footer Element block */}
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium mt-6 pt-2 border-t border-slate-50 px-1">
        <span>Showing 1-{mockFloors.length} out of {mockFloors.length}</span>
        <div className="flex items-center gap-1 text-slate-500">
          <button type="button" className="px-2 py-1 hover:text-slate-800 transition-colors">&lt; Previous</button>
          <button type="button" className="w-6 h-6 bg-blue-100/70 text-[#2a85d8] rounded font-semibold flex items-center justify-center text-xs">1</button>
          <button type="button" className="px-2 py-1 hover:text-slate-800 transition-colors">Next &gt;</button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HIGH FIDELITY ADD FLOOR SLATE FORM DIALOG MODAL LAYOUT    */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl max-w-[620px] w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#2489d8] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-base tracking-wide">
                Add Floor
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 bg-slate-50/50">
              <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  Floor Information
                </h4>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Floor Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Floor 6"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Floor Level</label>
                    <select
                      required
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-slate-300 bg-white transition-all"
                    >
                      <option value="" disabled>Choose floor</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-slate-300 bg-white transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Write your thoughts"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all resize-none placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2 border border-slate-200 bg-white text-slate-600 font-medium text-xs rounded-md hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2489d8] hover:bg-blue-600 text-white font-semibold text-xs rounded-md transition-colors shadow-sm"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* HIGH FIDELITY EDIT FLOOR INFORMATION DIALOG MODAL LAYOUT  */}
      {/* ========================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl max-w-[620px] w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Ribbon Title Header */}
            <div className="bg-[#2489d8] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-base tracking-wide">
                Edit Floor Information
              </h3>
              <button 
                type="button" 
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Core Form Data Fields Wrapper */}
            <form onSubmit={handleEditSubmit} className="p-6 bg-slate-50/50">
              <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  Floor Information
                </h4>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Floor Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Floor 2"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Floor Level</label>
                    <select
                      required
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-slate-300 bg-white transition-all"
                    >
                      <option value="" disabled>Choose floor</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-slate-300 bg-white transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Write your thoughts"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all resize-none placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Action Save/Cancel Buttons Tray */}
              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 border border-slate-200 bg-white text-slate-600 font-medium text-xs rounded-md hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2489d8] hover:bg-blue-600 text-white font-semibold text-xs rounded-md transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETION CONFIRMATION DIALOG MODAL LAYOUT                 */}
      {/* ========================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-lg p-6 max-w-[420px] w-full shadow-xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={16} />
            </button>
            <div className="flex items-start gap-4">
              <div className="bg-slate-100 p-2.5 rounded-lg text-[#b3261e] flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9.001a.75.75 0 0 1 .75-.75Zm0 7a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1 flex flex-col pt-0.5">
                <h3 className="text-xl font-bold text-[#b3261e] tracking-tight leading-none">
                  Delete floor
                </h3>
                <p className="text-slate-600 text-[13px] font-medium mt-2 leading-relaxed">
                  Are you sure you want to delete {selectedFloor?.name}?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 font-medium text-xs rounded-md hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmDelete} className="px-4 py-2 bg-[#c93b3b] hover:bg-red-700 text-white font-bold text-xs rounded-md transition-colors shadow-sm">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}