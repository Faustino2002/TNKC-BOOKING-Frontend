"use client";

import { usePathname } from "next/navigation";
import { homeRoutes } from "@/routes/homeRoutes";
import NavItem from "@/components/sidebar/NavItem";
import DropdownNavItem from "@/components/sidebar/DropdownNavItem";

export default function SidebarContent() {
  const pathname = usePathname();
  
  // 1. Detect if we are in the BuildingAdmin section based on the URL path
  // FIXED: Added check for any path containing "BuildingAdmin-" to keep the sidebar stable
  const isBuildingAdminSection = pathname.includes("BuildingAdmin-") || 
                                 pathname.startsWith("/home/people") || 
                                 pathname.startsWith("/home/maintenance") || 
                                 pathname.startsWith("/home/reports");

  const isUserSection = pathname.startsWith("/home/user-dashboard");
  const isFrontdeskSection = pathname.startsWith("/home/frontdesk-dashboard");

  // 2. Filter routes based on the section
  const filteredRoutes = homeRoutes.filter((section) => {
    if (isBuildingAdminSection) {
      return section.section === "BuildingAdmin" || section.section === "General";
    }
    if (isFrontdeskSection) {
      return section.section === "Frontdesk Menu" || section.section === "General";
    }
    if (isUserSection) {
      return section.section === "User Menu" || section.section === "General";
    }
    return section.section === "Menu" || section.section === "General";
  });

  return (
    <nav className="flex-1 px-2 group-hover:px-4 space-y-6 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300">
      {filteredRoutes.map((section) => (
        <div key={section.section}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
            <span className="group-hover:hidden block text-center">...</span>
            <span className="hidden group-hover:block">
              {/* 3. Force "Menu" label for the admin/dashboard sections */}
              {["User Menu", "Frontdesk Menu", "BuildingAdmin", "Menu"].includes(section.section) 
                ? "Menu" 
                : section.section}
            </span>
          </p>
          <div className="space-y-2">
            {section.items.map((item) => {
              const isMainDashboard = item.href === "/home/user-dashboard" || 
                                      item.href === "/home/frontdesk-dashboard" || 
                                      item.href === "/home/BuildingAdmin-Dashboard";
              
              const isActive = isMainDashboard
                ? pathname === item.href 
                : pathname.startsWith(item.href!);

              return item.children ? (
                <DropdownNavItem key={item.label} item={item} />
              ) : (
                <NavItem
                  key={item.href}
                  href={item.href!}
                  icon={<item.icon size={22} />}
                  label={item.label}
                  isActive={isActive}
                />
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}