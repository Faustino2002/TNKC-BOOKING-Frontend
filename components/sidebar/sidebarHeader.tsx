"use client";

import React from "react";
import Image from "next/image";

export default function SidebarHeader() {
  return (
    <div className="flex items-center px-5 py-8 h-24 shrink-0">
      <div className="relative h-10 w-10 shrink-0">
        <Image 
          src="/logoonly.png" 
          alt="Logo" 
          fill 
          className="object-contain" 
          priority 
        />
      </div>
      <span className="ml-4 text-[#3282B8] font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        TNKC HOUSE
      </span>
    </div>
  );
}