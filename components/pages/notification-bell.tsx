"use client";

import React, { useState } from "react";
import { Bell, MoreHorizontal, Check, ExternalLink } from "lucide-react"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface Notification {
  id: string;
  user: string;
  action: string;
  time: string;
  isRead: boolean;
  avatar?: string;
  detail?: string;
  type?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", user: "Juan Cruz", action: "requested a room", time: "2 hours ago", isRead: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan" },
  { id: "2", user: "Mark Reyes", action: "checked-in to Room 401", detail: "Bed number A-01", time: "2 hours ago", isRead: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark" },
  { id: "3", user: "System", action: "Room 501 is marked under maintenance", detail: '"Cleaning"', time: "2 hours ago", isRead: true, type: "maintenance" },
  { id: "4", user: "Carlos Diaz", action: "checked-out from Room 105", detail: "Bed number 105-A1", time: "5 hours ago", isRead: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" },
];

export function NotificationBell() { 
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("unread");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const displayNotifications = filter === "all" 
    ? notifications 
    : notifications.filter((n) => !n.isRead);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      {/* Notification Popover */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={false}>
        <PopoverTrigger asChild>
          <button className="p-3 text-[#3498db] bg-white shadow-sm border border-gray-100 rounded-full relative hover:bg-slate-50 transition-all focus:outline-none cursor-pointer">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent 
          className="w-[400px] p-0 rounded-[24px] shadow-2xl border-gray-100 mr-10"
          align="end"
          sideOffset={10}
        >
          <div className="p-6 bg-white rounded-[24px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1e3a5f]">Notification</h3>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-slate-100 rounded-full outline-none cursor-pointer">
                    <MoreHorizontal className="text-gray-400" size={20} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl bg-white">
                    
                    <DropdownMenuItem 
                      onSelect={markAllAsRead}
                      className="flex items-center gap-2 p-3 text-sm font-semibold text-[#1e3a5f] cursor-pointer rounded-lg"
                    >
                      <Check size={16} className="text-green-500" />
                      Mark all as read
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onSelect={(e) => {
                        e.preventDefault();
                        setIsPopoverOpen(false); // close popover
                        setIsDrawerOpen(true);   // open drawer
                      }}
                      className="flex items-center gap-2 p-3 text-sm font-semibold text-[#1e3a5f] cursor-pointer rounded-lg"
                    >
                      <ExternalLink size={16} className="text-[#3498db]" />
                      Open Notification
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </div>

            {/* FILTER */}
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setFilter("all")} 
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${filter === "all" ? 'bg-[#3498db] text-white' : 'text-gray-400 hover:bg-slate-50'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("unread")} 
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${filter === "unread" ? 'bg-[#3498db] text-white' : 'text-gray-400 hover:bg-slate-50'}`}
              >
                Unread
              </button>
            </div>

            {/* LIST */}
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {displayNotifications.length > 0 ? (
                displayNotifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-4">
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={n.avatar} />
                      <AvatarFallback>{n.user?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-[13px] leading-tight">
                      <span className="font-bold text-[#1e3a5f]">{n.user}</span> {n.action}
                      {n.detail && <span className="block text-gray-500 text-[11px] mt-1">{n.detail}</span>}
                      <p className="text-gray-400 text-[11px] mt-1">{n.time}</p>
                    </div>

                    {!n.isRead && (
                      <div className="w-2.5 h-2.5 bg-[#3498db] rounded-full mt-1 shrink-0"></div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4 text-sm">
                  No new notifications
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* ✅ DRAWER: moved outside Popover */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="sm:max-w-[460px] w-full p-0 border-none rounded-l-[40px] shadow-2xl bg-white flex flex-col"
        >
          <div className="h-full flex flex-col p-10 bg-white rounded-l-[40px] overflow-hidden">

            <SheetTitle className="text-[32px] font-bold text-[#1e3a5f] mb-6 flex justify-between items-center">
              Notification
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="outline-none hover:rotate-90 transition-transform"
              >
                <MoreHorizontal className="text-gray-400 cursor-pointer" size={24} />
              </button>
            </SheetTitle>

            <SheetDescription className="sr-only">
              Detailed notifications view
            </SheetDescription>

            <div className="flex-1 overflow-y-auto pr-2 space-y-9">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-5">
                  <Avatar className="w-12 h-12 shrink-0 border border-gray-100">
                    <AvatarImage src={n.avatar} />
                    <AvatarFallback>{n.user?.[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="text-[14px] text-gray-500 leading-snug">
                      <span className="font-bold text-[#1e3a5f]">{n.user}</span> {n.action}
                      {n.detail && (
                        <span className="block font-bold text-[#1e3a5f] mt-0.5">
                          {n.detail}
                        </span>
                      )}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-gray-400">{n.time}</span>
                      {!n.isRead && (
                        <div className="w-2 h-2 bg-[#3498db] rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}