import { FrontdeskGuestlist } from "@/components/pages/Frontdesk-Guestlist";
import { Guest } from "@/components/pages/frontdesk-types";

export const metadata = {
  title: "Frontdesk Guestlist | TNKC House",
  description: "View and manage real-time guest check-ins, check-outs, and room assignments.",
};

// 🔌 Fully extended mock data array matching the drawer UI elements
const MOCK_API_REQUESTED_BOOKINGS: Guest[] = [
  {
    id: "G-7729",
    name: "Saito Takahashi",
    room: "305",
    type: "Double",
    checkIn: "2026-05-22",
    status: "Pending",
    seamanId: "000000000881923",
    rank: "Second Officer",
    contactNumber: "09171234567",
    email: "saito.takahashi@gmail.com",
    duration: "4 days",
    checkOutDate: "2026-05-26",
    checkInTime: "02:00 PM",
    checkOutTime: "12:00 PM",
    bedAssignment: "305 - B1"
  },
  {
    id: "G-8814",
    name: "Jane M. Smith",
    room: "202",
    type: "Single",
    checkIn: "2026-05-22",
    status: "Pending",
    seamanId: "000000000223194",
    rank: "Chief Steward",
    contactNumber: "09187654321",
    email: "jane.smith@gmail.com",
    duration: "2 days",
    checkOutDate: "2026-05-24",
    checkInTime: "11:00 AM",
    checkOutTime: "01:00 PM",
    bedAssignment: "202 - B1"
  },
  {
    id: "G-0551",
    name: "Bob A. Taylor",
    room: "303",
    type: "Single",
    checkIn: "2026-05-21",
    status: "Pending",
    seamanId: "000000000445002",
    rank: "Chief Cadet",
    contactNumber: "09471817166",
    email: "bob.taylor@gmail.com",
    duration: "3 days",
    checkOutDate: "2026-05-24",
    checkInTime: "11:00 AM",
    checkOutTime: "04:00 PM",
    bedAssignment: "303 - B1"
  }
];

export default function FrontdeskGuestlistPage() {
  return (
    <main className="flex-1 overflow-hidden">
      <FrontdeskGuestlist directGuestsList={MOCK_API_REQUESTED_BOOKINGS} />
    </main>
  );
}