"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { homeRoutes } from "@/routes/homeRoutes";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userFullName");
    if (storedName) setUserName(storedName);
  }, []);

  const getBreadcrumbs = () => {
    const crumbs: { label: string; href: string }[] = [];
    crumbs.push({ label: "Home", href: "/home" });

    homeRoutes.forEach((section) => {
      section.items.forEach((item) => {
        if (item.href && pathname.includes(item.href) && item.href !== "/home") {
          let displayLabel = item.label;
          if (item.href === "/home/user-dashboard" && userName) {
            displayLabel = `Welcome, ${userName}`;
          }
          crumbs.push({ label: displayLabel, href: item.href });
        }
        
        if (item.children) {
          const childMatch = item.children.find((child) => child.href === pathname);
          if (childMatch && childMatch.href) {
            crumbs.push({ label: childMatch.label, href: childMatch.href });
          }
        }
      });
    });

    return Array.from(new Map(crumbs.map(c => [c.href, c])).values());
  };

  const breadcrumbs = getBreadcrumbs();

  if (pathname === "/home" || breadcrumbs.length === 0) return null;

  return (
    // Changed to text-[15px] - slightly smaller than default but bigger than text-sm
    <div className="flex items-center gap-2 text-[15px] font-medium tracking-tight"> 
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          {index > 0 && <ChevronRight size={16} className="text-gray-300 mx-0.5" />}
          
          <span className="flex items-center">
            {index === breadcrumbs.length - 1 ? (
              // Active page - Using a soft slate color
              <span className="text-slate-500 font-semibold">{crumb.label}</span>
            ) : (
              // Clickable parents
              <Link 
                href={crumb.href} 
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}                                       