"use client";

import React, { useState } from "react";
import BuildingAdminFloorManagement from "./BuildingAdmin-FloorManagement";
import BuildingAdminRoomManagement from "./BuildingAdmin-RoomManagement";
import BuildingAdminBedManagement from "./BuildingAdmin-BedManagement";

export default function BuildingAdminAccommodationClient() {
  const [activeSubTab, setActiveSubTab] = useState<"floor" | "room" | "bed">("floor");

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* 1st Column: Soft Light Blue Sub-Navigation Panel */}
      <div className="w-64 bg-[#e6f0fa] border-r border-blue-100/40 p-6 flex flex-col shrink-0">
        <h2 className="text-xl font-bold text-[#1e4a6d] tracking-wide">My Work</h2>
        <p className="text-slate-500 text-xs mt-1.5 mb-6 font-medium leading-relaxed">
          Manage floor, room and bedspace
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={() => setActiveSubTab("floor")}
            className={`w-full text-left text-sm font-semibold py-1 px-1 tracking-wide relative group transition-all ${
              activeSubTab === "floor"
                ? "text-[#2a85d8]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Floor Management
            {activeSubTab === "floor" && (
              <span className="absolute bottom-[-4px] left-1 w-12 h-[2px] bg-[#2a85d8] rounded-full" />
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setActiveSubTab("room")}
            className={`w-full text-left text-sm font-semibold py-1 px-1 tracking-wide relative group transition-all ${
              activeSubTab === "room"
                ? "text-[#2a85d8]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Room Management
            {activeSubTab === "room" && (
              <span className="absolute bottom-[-4px] left-1 w-12 h-[2px] bg-[#2a85d8] rounded-full" />
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setActiveSubTab("bed")}
            className={`w-full text-left text-sm font-semibold py-1 px-1 tracking-wide relative group transition-all ${
              activeSubTab === "bed"
                ? "text-[#2a85d8]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bed Management
            {activeSubTab === "bed" && (
              <span className="absolute bottom-[-4px] left-1 w-12 h-[2px] bg-[#2a85d8] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* 2nd Column: Main Data Workspace Deck Area */}
      <div className="flex-1 bg-white p-8 flex flex-col">
        {/* Dynamic Title Bar text string */}
        <h1 className="text-3xl font-bold text-[#17466c] tracking-tight mb-6">
          {activeSubTab === "floor" && "Floor Management"}
          {activeSubTab === "room" && "Room Management"}
          {activeSubTab === "bed" && "Bed Management"}
        </h1>

        <div className="flex-1 flex items-start">
          {activeSubTab === "floor" && <BuildingAdminFloorManagement />}
          
          {activeSubTab === "room" && <BuildingAdminRoomManagement />}
          
          {/* NOW RENDERS THE CORRECT HIGH-FIDELITY COMPONENT OUTSIDE OF PLACEHOLDER TEXT */}
          {activeSubTab === "bed" && <BuildingAdminBedManagement />}
        </div>
      </div>

    </div>
  );
}