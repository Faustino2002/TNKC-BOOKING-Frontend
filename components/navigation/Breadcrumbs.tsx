"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { homeRoutes } from "@/routes/homeRoutes";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  // Grab the name from storage when the component mounts
  useEffect(() => {
    const storedName = localStorage.getItem("userFullName");
    if (storedName) setUserName(storedName);
  }, []);

  const getBreadcrumbs = () => {
    const crumbs: { label: string; href: string }[] = [];
    
    // Always start with Home
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
    <div className="flex items-center gap-2"> {/* Restored original flex feel */}
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
          
          <span>
            {index === breadcrumbs.length - 1 ? (
              // Active page - Restored to your original span style
              <span>{crumb.label}</span>
            ) : (
              // Clickable parents - Standard link style
              <Link href={crumb.href} className="text-blue-500 hover:underline">
                {crumb.label}
              </Link>
            )}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}