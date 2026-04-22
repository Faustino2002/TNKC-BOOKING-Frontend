"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Bell, LogOut, MoreVertical } from "lucide-react";

export default function SidebarFooter() {
  const [userData, setUserData] = useState({ name: "User", role: "", email: "user@example.com" });

  useEffect(() => {
    const storedName = localStorage.getItem("userFullName") || "Guest User";
    const storedRole = localStorage.getItem("userRole") || "Guest";
    const storedEmail = localStorage.getItem("userEmail") || "john.doe@gmail.com"; 
    setUserData({ name: storedName, role: storedRole, email: storedEmail });
  }, []);

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <div className="mt-auto p-2 group-hover:p-4 border-t border-white/5 shrink-0 transition-all duration-300">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-center group-hover:justify-between w-full p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group/footer">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-[#3498db] flex items-center justify-center text-white font-bold shrink-0 shadow-sm border-2 border-white/10">
                {getInitials(userData.name)}
              </div>
              <div className="ml-3 hidden group-hover:block transition-all duration-300 whitespace-nowrap overflow-hidden">
                <p className="text-sm font-bold text-white leading-tight truncate w-32">
                  {userData.name}
                </p>
                <p className="text-[11px] text-gray-400 capitalize">
                  {userData.role}
                </p>
              </div>
            </div>
            <MoreVertical size={16} className="text-gray-400 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          side="right" 
          align="end" 
          sideOffset={12}
          className="w-64 bg-[#0a0a0a] border-slate-800 text-slate-200 p-2 shadow-2xl rounded-2xl"
        >
          <div className="flex items-center gap-3 p-3 mb-1">
            <div className="h-10 w-10 rounded-full bg-[#3498db] flex items-center justify-center text-white font-bold shrink-0">
              {getInitials(userData.name)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">{userData.name}</span>
              <span className="text-[10px] text-slate-500 truncate">{userData.email}</span>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-slate-800 mx-2" />
          <div className="p-1">
            <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-900 rounded-lg transition-colors">
              <User size={18} className="text-slate-400" />
              <span className="text-sm">Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-900 rounded-lg transition-colors">
              <Bell size={18} className="text-slate-400" />
              <span className="text-sm">Notification</span>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator className="bg-slate-800 mx-2" />
          <div className="p-1">
            <DropdownMenuItem 
              className="flex items-center gap-3 p-3 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
              onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Log out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}