"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { homeRoutes } from "@/routes/homeRoutes";

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Function to find the label and parent for the current path
  const getBreadcrumbs = () => {
    const crumbs: { label: string; href: string }[] = [];
    
    homeRoutes.forEach((section) => {
      section.items.forEach((item) => {
        // Check if the main item matches
        if (item.href === pathname) {
          crumbs.push({ label: item.label, href: item.href });
        }
        
        // Check if any children (sub-items) match
        if (item.children) {
          const childMatch = item.children.find((child) => child.href === pathname);
          if (childMatch) {
            crumbs.push({ label: item.label, href: item.href || "#" });
            crumbs.push({ label: childMatch.label, href: childMatch.href });
          }
        }
      });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't render if we are just at /home
  if (pathname === "/home" || breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link href="/home/dashboard" className="hover:text-[#3282B8] transition-colors">
        <Home size={16} />
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          <ChevronRight size={14} className="text-gray-300" />
          <Link
            href={crumb.href}
            className={`hover:text-[#3282B8] transition-colors ${
              index === breadcrumbs.length - 1 ? "font-semibold text-black pointer-events-none" : ""
            }`}
          >
            {crumb.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}