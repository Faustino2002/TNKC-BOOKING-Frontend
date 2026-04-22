"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, LayoutGrid, Loader2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

// --- MOCK DATA ---
const MOCK_DATA: Record<string, Room[]> = {
  "floor-1": [
    { id: "501", name: "Room 501", type: "Shared Cabin", status: "Available" },
    { id: "502", name: "Room 502", type: "Shared Cabin", status: "Available" },
    { id: "103", name: "Room 103", type: "Shared Cabin", status: "Fully Occupied" },
    { id: "104", name: "Room 104", type: "Single Room", status: "Blocked" },
  ],
  "floor-2": [
    { id: "201", name: "Room 201", type: "Female Dorm", status: "Available" },
  ]
};

const MOCK_BED_DATA = [
  { id: "A1", status: "Occupied", guest: "Joe L. Doe", sid: "000045230879", in: "06/20/2026", out: "06/25/2026" },
  { id: "A2", status: "Reserved", guest: "John L. Doe", sid: "000045230642", in: "06/20/2026", out: "06/25/2026" },
  { id: "A3", status: "Available", guest: "None", sid: "00000", in: "00/00/00", out: "00/00/00" },
];

interface Room {
  id: string;
  name: string;
  type: string;
  status: "Available" | "Partially Occupied" | "Fully Occupied" | "Blocked" | "Maintenance";
  imageUrl?: string;
}

export default function FloorCatalogClient({ floorId, floorTitle }: { floorId: string; floorTitle: string }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setRooms(MOCK_DATA[floorId] || []);
      setIsLoading(false);
    };
    fetchRooms();
  }, [floorId]);

  if (selectedRoom) {
    return (
      <div className="p-10 bg-white min-h-screen font-sans">
        <div className="flex items-center gap-2 text-[#1e3a5f] mb-6 text-xl">
          <button 
            onClick={() => setSelectedRoom(null)} 
            className="font-bold text-4xl hover:text-[#3282B8] transition-colors"
          >
            Floor Catalog
          </button>
          <ChevronRight className="text-gray-300" size={30} />
          <span className="text-gray-300 font-medium italic">...</span>
          <ChevronRight className="text-gray-300" size={30} />
          <span className="font-semibold text-[#1e3a5f]">View Details</span>
        </div>

        <div className="relative h-64 rounded-[40px] overflow-hidden mb-8 shadow-lg">
          <Image src="/room-placeholder.jpg" alt="Room View" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-10 left-10">
            <h1 className="text-white text-5xl font-bold mb-1">{selectedRoom.name}</h1>
            <p className="text-gray-200 text-xl font-medium">{selectedRoom.type}</p>
          </div>
          <div className="absolute bottom-10 right-10">
            <span className="bg-[#2ecc71] text-white px-8 py-2 rounded-xl font-bold text-lg uppercase tracking-wider">
              {selectedRoom.status}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button className="bg-[#3498db] text-white px-6 py-2 rounded-full font-bold shadow-md">Bed Status</button>
          <button className="bg-gray-100 text-gray-400 px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition">Maintenance Status</button>
          <button className="bg-gray-100 text-gray-400 px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition">Booking History</button>
        </div>

        <div className="border border-gray-100 rounded-[30px] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="p-6 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-6">Bed Number</th>
                <th className="p-6">Status</th>
                <th className="p-6">Guest Name</th>
                <th className="p-6">Seaman ID</th>
                <th className="p-6">Check-in</th>
                <th className="p-6">Check-out</th>
                <th className="p-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_BED_DATA.map((bed) => (
                <tr key={bed.id} className="hover:bg-gray-50/50 transition group">
                  <td className="p-6"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="p-6 font-bold text-gray-700">{selectedRoom.name.split(' ')[1]} - {bed.id}</td>
                  <td className="p-6">
                    <span className={`px-4 py-1 rounded-full text-white text-[10px] font-extrabold uppercase flex items-center gap-2 w-fit ${
                      bed.status === 'Occupied' ? 'bg-[#e74c3c]' : bed.status === 'Reserved' ? 'bg-[#f1c40f]' : 'bg-[#2ecc71]'
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> {bed.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-500 border-2 border-white shadow-sm">JD</div>
                      <span className="font-semibold text-gray-700">{bed.guest}</span>
                    </div>
                  </td>
                  <td className="p-6 text-gray-500 font-medium font-mono text-sm">{bed.sid}</td>
                  <td className="p-6 text-gray-500 font-medium">{bed.in}</td>
                  <td className="p-6 text-gray-500 font-medium">{bed.out}</td>
                  <td className="p-6 text-center">
                    <button className="bg-[#3498db] text-white px-6 py-1.5 rounded-xl font-bold text-xs hover:bg-[#1e3a5f] transition-all shadow-md">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 bg-white min-h-screen font-sans">
      {/* Search and Filter Row */}
      <div className="flex items-center justify-end mb-10 gap-4">
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            placeholder="Search rooms..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-gray-50 border-none h-12 rounded-xl text-base"
          />
        </div>
        <button className="p-3 bg-gray-100 rounded-xl text-gray-400">
          <LayoutGrid size={24} />
        </button>
      </div>

      <div className="flex gap-4 mb-10">
        <StatItem label="Total Rooms" value={rooms.length} />
        <StatItem label="Available" value={rooms.filter(r => r.status === "Available").length} />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-300 gap-4">
          <Loader2 className="animate-spin text-[#3282B8]" size={48} />
          <p>Loading {floorTitle}...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredRooms.map((room) => (
            <div key={room.id} onClick={() => setSelectedRoom(room)}>
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white px-5 py-2 rounded-lg border border-gray-100 shadow-sm flex gap-3 items-center">
      <span className="text-[#3498db] text-sm font-semibold">{label}</span>
      <span className="text-gray-400 text-sm font-bold">{value}</span>
    </div>
  );
}

function RoomCard({ room }: { room: Room }) {
  const statusColors = {
    Available: "bg-[#2ecc71]",
    "Partially Occupied": "bg-[#f1c40f]",
    "Fully Occupied": "bg-[#e74c3c]",
    Blocked: "bg-gray-400",
    Maintenance: "bg-[#e67e22]",
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-xl border border-gray-50 bg-slate-100">
        <Image src="/room-placeholder.jpg" alt={room.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
        <div className="absolute bottom-10 left-10">
          <span className={`${statusColors[room.status]} text-white text-[11px] px-4 py-1.5 rounded-full font-bold uppercase mb-4 inline-block shadow-lg`}>
            {room.status}
          </span>
          <h3 className="text-white text-4xl font-bold mb-2">{room.name}</h3>
          <p className="text-gray-300 text-lg font-medium opacity-90">{room.type}</p>
        </div>
      </div>
    </div>
  );
}