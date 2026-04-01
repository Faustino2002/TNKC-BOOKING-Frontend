"use client";

import React from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetPortal } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NotificationDrawer({ isOpen, onOpenChange, notifications }: any) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetPortal>
        <SheetContent
          side="right"
          // THE FIX: !fixed and !z-[100] ensures it sits above the dashboard header (z-40)
          // data-[state=open]:!translate-x-0 forces it onto the screen even if animations glitch
          className="
            !fixed !inset-y-0 !right-0 !z-[100] 
            w-full sm:max-w-[460px] bg-white border-none 
            rounded-l-[40px] p-0 shadow-2xl 
            data-[state=open]:!translate-x-0 !duration-0
          "
        >
          <div className="h-full flex flex-col p-10">
            <SheetTitle className="text-[32px] font-bold text-[#1e3a5f] mb-10">
              Notification
            </SheetTitle>
            <SheetDescription className="sr-only">Notification list</SheetDescription>
            <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
              {notifications?.map((n: any) => (
                <div key={n.id} className="flex items-start gap-5">
                  <Avatar className="w-12 h-12 shrink-0 border border-slate-100">
                    <AvatarImage src={n.avatar} />
                    <AvatarFallback className="bg-slate-100">{n.user?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-[14px] text-gray-500">
                      <span className="font-bold text-[#1e3a5f]">{n.user}</span> {n.action}
                    </p>
                    <span className="text-[12px] text-gray-400 mt-1 block">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}