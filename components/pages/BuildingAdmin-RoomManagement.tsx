"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus, Search, X, SlidersHorizontal } from "lucide-react";

interface RoomData {
  id: number;
  roomNumber: string;
  roomType: string;
  totalBeds: number;
  floorNumber: string;
  status: "Active" | "Maintenance" | "Inactive";
  notes: string;
}

export default function BuildingAdminRoomManagement() {
  // Mock Data matching the layout view
  const [mockRooms, setMockRooms] = useState<RoomData[]>([
    { id: 1, roomNumber: "201", roomType: "Single Cabin", totalBeds: 1, floorNumber: "2", status: "Active", notes: "None" },
    { id: 2, roomNumber: "202", roomType: "Single Cabin", totalBeds: 1, floorNumber: "2", status: "Active", notes: "None" },
    { id: 3, roomNumber: "203", roomType: "Single Cabin", totalBeds: 1, floorNumber: "2", status: "Active", notes: "None" },
    { id: 4, roomNumber: "204", roomType: "Single Cabin", totalBeds: 1, floorNumber: "2", status: "Active", notes: "None" },
    { id: 5, roomNumber: "205", roomType: "Single Cabin", totalBeds: 1, floorNumber: "2", status: "Active", notes: "None" },
    { id: 6, roomNumber: "206", roomType: "Single Cabin", totalBeds: 1, floorNumber: "2", status: "Active", notes: "None" },
  ]);

  // Operational Control States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamic Toast Control
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  // Form Field Tracking Inputs
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Single Cabin",
    totalBeds: "1",
    floorNumber: "",
    status: "Active" as "Active" | "Maintenance" | "Inactive",
    notes: ""
  });

  // Open Edit Dialog and Pre-populate values
  const handleEditClick = (room: RoomData) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      totalBeds: room.totalBeds.toString(),
      floorNumber: room.floorNumber,
      status: room.status,
      notes: room.notes === "None" ? "" : room.notes
    });
    setIsEditModalOpen(true);
  };

  // Save Mutations
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !formData.roomNumber || !formData.floorNumber) return;

    setMockRooms(
      mockRooms.map((r) =>
        r.id === selectedRoom.id
          ? {
              ...r,
              roomNumber: formData.roomNumber,
              roomType: formData.roomType,
              totalBeds: parseInt(formData.totalBeds, 10) || 1,
              floorNumber: formData.floorNumber,
              status: formData.status,
              notes: formData.notes || "None",
            }
          : r
      )
    );

    setIsEditModalOpen(false);
    setToastMessage({
      title: "Update room successfully",
      subtitle: "You have updated room details successfully"
    });
    resetForm();
  };

  // Trigger Confirmation Modal
  const handleDeleteClick = (room: RoomData) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  // Perform Deletion Row Mutation
  const handleConfirmDelete = () => {
    if (selectedRoom) {
      setMockRooms(mockRooms.filter((r) => r.id !== selectedRoom.id));
      setToastMessage({
        title: "Delete room successfully",
        subtitle: "You have deleted room successfully"
      });
    }
    setIsDeleteModalOpen(false);
  };

  // Handle Form Record Insertion Entry
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomNumber || !formData.floorNumber) return;

    const newRoom: RoomData = {
      id: Date.now(),
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      totalBeds: parseInt(formData.totalBeds, 10) || 1,
      floorNumber: formData.floorNumber,
      status: formData.status,
      notes: formData.notes || "None"
    };

    setMockRooms([...mockRooms, newRoom]);
    setIsAddModalOpen(false);
    setToastMessage({
      title: "Add room successfully",
      subtitle: "You have added room successfully"
    });
    resetForm();
  };

  const resetForm = () => {
    setFormData({ roomNumber: "", roomType: "Single Cabin", totalBeds: "1", floorNumber: "", status: "Active", notes: "" });
  };

  // Auto-dismiss operational popup notices safely
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
        setSelectedRoom(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Filter inline data by search criteria
  const filteredRooms = mockRooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.floorNumber.includes(searchQuery)
  );

  return (
    <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-100 p-6 shadow-sm relative">
      
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

      {/* Action Control Management Ribbon Header Row Layout */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 w-full max-w-md">
          <span className="text-slate-400">
            <SlidersHorizontal size={14} />
          </span>
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
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="bg-[#2a85d8] text-white font-medium text-xs px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1.5 transition-colors shadow-sm"
        >
          Add Room <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Table Data Layout Workspace Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 text-slate-500 font-semibold text-[11px] tracking-wide border-b border-slate-100">
              <th className="px-4 py-3">Room Number</th>
              <th className="px-4 py-3">Room Type</th>
              <th className="px-4 py-3">Total Beds</th>
              <th className="px-4 py-3">Floor Number</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No matching rooms encountered.
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-4 py-4 font-bold text-slate-700">{room.roomNumber}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{room.roomType}</td>
                  <td className="px-4 py-4 text-slate-500">{room.totalBeds}</td>
                  <td className="px-4 py-4 text-slate-500">{room.floorNumber}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 font-semibold text-[10px] px-2.5 py-0.5 rounded-full ${
                      room.status === "Active" ? "bg-[#def2e6] text-[#1e7e34]" :
                      room.status === "Maintenance" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        room.status === "Active" ? "bg-[#28a745]" :
                        room.status === "Maintenance" ? "bg-amber-500" : "bg-slate-400"
                      }`} /> 
                      {room.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-400 max-w-xs truncate">{room.notes}</td>
                  <td className="px-4 py-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      <button type="button" onClick={() => handleDeleteClick(room)} className="hover:text-rose-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                      <button type="button" onClick={() => handleEditClick(room)} className="hover:text-blue-500 transition-colors">
                        <Edit size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Structural Pagination Counter Footer block */}
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium mt-6 pt-2 border-t border-slate-50 px-1">
        <span>Showing 1-{filteredRooms.length} out of {filteredRooms.length}</span>
        <div className="flex items-center gap-1 text-slate-500">
          <button type="button" className="px-2 py-1 opacity-50 cursor-not-allowed" disabled>&lt; Previous</button>
          <button type="button" className="w-6 h-6 bg-blue-100/70 text-[#2a85d8] rounded font-semibold flex items-center justify-center text-xs">1</button>
          <button type="button" className="px-2 py-1 opacity-50 cursor-not-allowed" disabled>Next &gt;</button>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl max-w-[620px] w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#2489d8] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-base tracking-wide">Add Room</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 bg-slate-50/50">
              <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Room Information</h4>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Room Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 201"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Room Type</label>
                    <select
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-slate-300 bg-white transition-all"
                    >
                      <option value="Single Cabin">Single Cabin</option>
                      <option value="Double Shared">Double Shared</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Floor Level Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2"
                      value={formData.floorNumber}
                      onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Total Beds Capacity</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={formData.totalBeds}
                      onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-slate-300 bg-white transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-xl max-w-[620px] w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#2489d8] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-base tracking-wide">Edit Room Information</h3>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 bg-slate-50/50">
              <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Room Information</h4>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Room Number</label>
                    <input
                      type="text"
                      required
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Room Type</label>
                    <select
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-slate-300 bg-white transition-all"
                    >
                      <option value="Single Cabin">Single Cabin</option>
                      <option value="Double Shared">Double Shared</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Floor Level Number</label>
                    <input
                      type="text"
                      required
                      value={formData.floorNumber}
                      onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Total Beds Capacity</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={formData.totalBeds}
                      onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-slate-300 bg-white transition-all"
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-300 transition-all resize-none"
                  />
                </div>
              </div>

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

      {isDeleteModalOpen && selectedRoom && (
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
                <h3 className="text-xl font-bold text-[#b3261e] tracking-tight leading-none">Delete room</h3>
                <p className="text-slate-600 text-[13px] font-medium mt-2 leading-relaxed">
                  Are you sure you want to delete room {selectedRoom.roomNumber}?
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