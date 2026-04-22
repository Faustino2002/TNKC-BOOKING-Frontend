import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  BookOpen, 
  Settings, 
  LifeBuoy,
  ClipboardList 
} from "lucide-react";

export const homeRoutes = [
  {
    section: "Menu",
    items: [
      { label: "Dashboard", href: "/home/dashboard", icon: LayoutDashboard },
      { label: "Guestlist", href: "/home/guest-list", icon: Users },
      { label: "Booking List", href: "/home/booking-list", icon: CalendarCheck },
      { 
        label: "Floor Catalog", 
        href: "/home/floor-catalog", // Added base href for parent matching
        icon: BookOpen,
        children: [
          { label: "1st Floor", href: "/home/floor-catalog/floor1" },
          { label: "2nd Floor", href: "/home/floor-catalog/floor2" },
        ]
      },
    ]
  },
  {
    section: "User Menu",
    items: [
      { 
        label: "Home", 
        href: "/home/user-dashboard", 
        icon: LayoutDashboard,
        // Moved Reservation here so breadcrumbs show it as a sub-page
        children: [
          { label: "Reservation", href: "/home/user-dashboard/reservation" }
        ]
      },
    ]
  },
  {
    section: "General",
    items: [
      // If these are global, keeping them flat is fine
      { label: "Settings", href: "/home/settings", icon: Settings },
      { label: "Support", href: "/home/support", icon: LifeBuoy },
    ]
  }
];