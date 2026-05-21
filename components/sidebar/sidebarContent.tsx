"use client";

import { usePathname } from "next/navigation";
import { homeRoutes } from "@/routes/homeRoutes";
import NavItem from "@/components/sidebar/NavItem";
import DropdownNavItem from "@/components/sidebar/DropdownNavItem";

export default function SidebarContent() {
  const pathname = usePathname();
  
  const isUserSection = pathname.startsWith("/home/user-dashboard");
  const isFrontdeskSection = pathname.startsWith("/home/frontdesk-dashboard");

  const filteredRoutes = homeRoutes.filter((section) => {
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
              {["User Menu", "Frontdesk Menu"].includes(section.section) 
                ? "Menu" 
                : section.section}
            </span>
          </p>
          <div className="space-y-2">
            {section.items.map((item) => {
              // --- UPDATED LOGIC START ---
              // Strict check for main dashboards so they don't stay active 
              // when viewing sub-pages like guestlist
              const isMainDashboard = item.href === "/home/user-dashboard" || item.href === "/home/frontdesk-dashboard";
              
              const isActive = isMainDashboard
                ? pathname === item.href 
                : pathname.startsWith(item.href!);
              // --- UPDATED LOGIC END ---

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