"use client";

import React, { useState, useMemo } from "react";
import { Bell, Info, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// ==========================================
// 🛠️ BACKEND ARCHITECTURE & DATA SCHEMAS
// ==========================================

export type NotificationType = 
  | "approval" 
  | "cleaning" 
  | "rejection" 
  | "overdue" 
  | "checkin" 
  | "checkout" 
  | "ready" 
  | "maintenance";

export interface BackendNotificationItem {
  id: string;              // Primary Key (MongoDB ObjectId or PostgreSQL UUID)
  type: NotificationType;  // Enum type matching backend schema lookup tables
  title?: string | null;   // Optional bold text prefix (e.g., "Overdue Arrival.")
  description: string;     // The fully compiled message body string from the server
  createdAt: string;       // ISO 8601 string timestamp (e.g., "2026-05-18T08:00:00Z")
  isUnread: boolean;       // Status bit for unread/read states
  avatarUrl?: string | null; // URL string to S3 bucket or CDN for guest images
  metadata?: {             // Flexible meta payload object for frontend routing/actions
    roomId?: string;
    bookingId?: string;
    bedNumber?: string;
  };
}

interface FrontdeskNotificationProps {
  // Array supplied by your API fetch engine, React Query, or SWR hook
  notifications: BackendNotificationItem[];
  // Callback handle to run an explicit PATCH request update against the DB
  onMarkAsRead?: (id: string) => Promise<void> | void;
  // Callback handle to clear out or mark all items in the database array
  onMarkAllAsRead?: () => Promise<void> | void;
}

// ==========================================
// ⚙️ INTERNAL HELPER FUNCTIONS
// ==========================================

/**
 * Parses an ISO date timestamp string into a human-scannable runtime metric.
 * Replace this with standard libraries like date-fns (formatDistanceToNow) if desired.
 */
function getRelativeTimeAgo(isoString: string): string {
  try {
    const now = new Date();
    const past = new Date(isoString);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    const elapsed = now.getTime() - past.getTime();

    if (elapsed < msPerMinute) return "Just now";
    if (elapsed < msPerHour) return `${Math.round(elapsed / msPerMinute)} minutes ago`;
    if (elapsed < msPerDay) return `${Math.round(elapsed / msPerHour)} hours ago`;
    return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch (e) {
    return "Recently";
  }
}

export default function FrontdeskNotification({ 
  notifications = [], 
  onMarkAsRead,
  onMarkAllAsRead 
}: FrontdeskNotificationProps) {
  const [activeTab, setActiveTab] = useState<"All" | "Unread">("Unread");

  // Filter list rows depending on tab selection matrix
  const filteredNotifications = useMemo(() => {
    if (activeTab === "Unread") {
      return notifications.filter((n) => n.isUnread);
    }
    return notifications;
  }, [notifications, activeTab]);

  // Compute live unread counts for badge alerts
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isUnread).length;
  }, [notifications]);

  // Render profile vectors or fallback cleaning SVGs
  const renderNotificationIcon = (item: BackendNotificationItem) => {
    if (item.avatarUrl) {
      return (
        <img
          src={item.avatarUrl}
          alt="User Profile Avatar"
          className="w-11 h-11 rounded-full object-cover flex-none"
        />
      );
    }

    return (
      <div className="w-11 h-11 flex items-center justify-center bg-amber-50 rounded-full text-amber-600 flex-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 21 1.9-1.9a1 1 0 0 0 0-1.4l-1.4-1.4a1 1 0 0 0-1.4 0L.3 18.2a1 1 0 0 0 0 1.4L2.2 21.5a1 1 0 0 0 1.4 0Z"/>
          <path d="M11.6 14.6 4.3 7.3"/>
          <path d="M14.1 12.1 7.3 5.3"/>
          <path d="m16.1 14.1 5.6-5.6a3.3 3.3 0 0 0 0-4.7l-.4-.4a3.3 3.3 0 0 0-4.7 0l-5.6 5.6"/>
          <path d="m18 16 3 3"/>
        </svg>
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none select-none">
          <Bell size={26} className="text-blue-500" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-[460px] bg-white shadow-2xl border border-slate-100 rounded-2xl p-6 z-50 mr-4 mt-2 flex flex-col"
        align="end"
      >
        {/* Header Block with Actions */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-[#1a4f7c]">Notification</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-50">
                <MoreHorizontal size={22} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border p-1.5 shadow-md rounded-lg text-sm">
              <button 
                onClick={() => onMarkAllAsRead?.()}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium rounded"
              >
                Mark all as read
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Interface Filter Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab("All")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "All" ? "bg-slate-100 text-slate-700" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("Unread")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === "Unread" ? "bg-[#2da1e7] text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Unread
          </button>
        </div>

        {/* Timeline Separator Section Block */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-slate-700">Earlier</span>
          <button 
            onClick={() => onMarkAllAsRead?.()} 
            className="text-sm font-semibold text-[#2da1e7] hover:underline"
          >
            See all
          </button>
        </div>

        {/* Dynamic List Items Canvas Container */}
        <div className="max-h-[480px] overflow-y-auto pr-1 space-y-5 scrollbar-thin">
          {filteredNotifications.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <Info className="mx-auto text-slate-300" size={28} />
              <p className="text-sm text-slate-400 font-medium">No updates available here.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => n.isUnread && onMarkAsRead?.(n.id)}
                className={`flex items-start justify-between gap-4 group p-2 rounded-xl transition-colors ${
                  n.isUnread ? "cursor-pointer hover:bg-slate-50/60" : ""
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  {renderNotificationIcon(n)}
                  <div className="space-y-1.5">
                    <p className="text-sm text-slate-600 leading-normal font-medium">
                      {n.title && (
                        <span className="text-red-500 font-bold mr-1 text-sm">{n.title}</span>
                      )}
                      {n.description}
                    </p>
                    <p className="text-xs text-slate-400">
                      {getRelativeTimeAgo(n.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Unread dot indicator status layer */}
                {n.isUnread && (
                  <div className="w-3 h-3 rounded-full bg-[#2da1e7] mt-2 flex-none" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Trigger Element */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 text-sm font-semibold rounded-xl transition-colors text-center">
            See previous notification
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}