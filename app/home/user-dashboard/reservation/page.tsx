import { Metadata } from "next";
import ReservationClientPage from "@/components/pages/user-reservation-client";

export const metadata: Metadata = {
  title: "Reservation | TNKC HOUSE",
  description: "View and manage your upcoming and past bookings.",
};

export default function ReservationPage() {
  return <ReservationClientPage />;
}