import { Suspense } from "react";
import BookingDetailsClient from "@/components/pages/booking-details-client";

export default function BookingDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <p className="text-gray-400 animate-pulse">Initializing details...</p>
      </div>
    }>
      <BookingDetailsClient />
    </Suspense>
  );
}