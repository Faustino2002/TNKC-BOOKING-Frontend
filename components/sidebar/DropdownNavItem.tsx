"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import SubNavItem from "./SubNavItem"; // Updated to match the new name

interface DropdownNavItemProps {
  item: {
    label: string;
    icon: any;
    children?: { label: string; href: string }[];
  };
}

export default function DropdownNavItem({ item }: DropdownNavItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group/btn"
      >
        <div className="flex items-center gap-3">
          <Icon size={22} className="shrink-0" />
          <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {item.label}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 opacity-0 group-hover:opacity-100 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && (
        <div className="pl-12 space-y-1 hidden group-hover:block transition-all">
          {item.children?.map((child) => (
            <SubNavItem
              key={child.href}
              label={child.label}
              href={child.href}
              isActive={pathname === child.href} // Task 4: Active route detection
            />
          ))}
        </div>
      )}
    </div>
  );
}