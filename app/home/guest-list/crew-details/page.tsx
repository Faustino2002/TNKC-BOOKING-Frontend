import { Suspense } from "react";
import CrewDetailsClient from "@/components/pages/crew-details-client";

export default function CrewDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-[#1e3a5f] font-medium">Mounting Crew Details...</div>
      </div>
    }>
      <CrewDetailsClient />
    </Suspense>
  );
}