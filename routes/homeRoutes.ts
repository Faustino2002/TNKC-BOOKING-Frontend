import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  BookOpen, 
  Settings, 
  LifeBuoy 
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
        icon: BookOpen,
        children: [
          { label: "1st Floor", href: "/home/floor-catalog/floor1" },
          { label: "2nd Floor", href: "/home/floor-catalog/floor2" },
        ]
      },
    ]
  },
  {
    section: "General",
    items: [
      { label: "Settings", href: "/home/dashboard/settings", icon: Settings },
      { label: "Support", href: "/home/dashboard/support", icon: LifeBuoy },
    ]
  }
];