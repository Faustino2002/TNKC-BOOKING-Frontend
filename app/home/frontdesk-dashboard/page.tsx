import FrontdeskDashboardClient from "@/components/pages/frontdesk-dashboard";

export const metadata = {
  title: "Frontdesk Dashboard | TNKC House",
  description: "Manage real-time room occupancy and guest bookings.",
};

export default function FrontdeskDashboardPage() {
  return (
    <main className="flex-1 overflow-hidden">
      <FrontdeskDashboardClient />
    </main>
  );
}