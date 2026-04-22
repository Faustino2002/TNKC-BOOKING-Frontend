"use client";

import { usePathname } from "next/navigation";
import { homeRoutes } from "@/routes/homeRoutes";
import NavItem from "@/components/sidebar/NavItem";
import DropdownNavItem from "@/components/sidebar/DropdownNavItem";

export default function SidebarContent() {
  const pathname = usePathname();

  // 1. Logic to determine if the user is in the User Dashboard area
  const isUserSection = pathname.startsWith("/home/user-dashboard");

  // 2. Filter the routes before mapping them
  const filteredRoutes = homeRoutes.filter((section) => {
    if (isUserSection) {
      // Show only User-specific items and shared General items
      return section.section === "User Menu" || section.section === "General";
    }
    // Show only Admin-specific items and shared General items
    return section.section === "Menu" || section.section === "General";
  });

  return (
    <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
      {/* 3. Use filteredRoutes instead of homeRoutes */}
      {filteredRoutes.map((section) => (
        <div key={section.section}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
            <span className="group-hover:hidden block text-center">...</span>
            <span className="hidden group-hover:block">
              {/* Optional: Make "User Menu" just say "Menu" visually */}
              {section.section === "User Menu" ? "Menu" : section.section}
            </span>
          </p>
          <div className="space-y-2">
            {section.items.map((item) => (
              item.children ? (
                <DropdownNavItem key={item.label} item={item} />
              ) : (
                <NavItem
                  key={item.href}
                  href={item.href!}
                  icon={<item.icon size={22} />}
                  label={item.label}
                  isActive={pathname === item.href || pathname.startsWith(item.href!)}
                />
              )
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}