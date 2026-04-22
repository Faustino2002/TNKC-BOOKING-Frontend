"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Check, 
  ChevronLeft, 
  CalendarDays, 
  PlusCircle, 
  Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// 1. STEP DEFINITIONS: Copying titles and descriptions verbatim
const steps = [
  { 
    id: 1, 
    title: "Booking Details", 
    desc: "Provide the check-in date and check-out date for your reservation" 
  },
  { 
    id: 2, 
    title: "Personal Information", 
    desc: "Provide your personal details to complete the reservation" 
  },
  { 
    id: 3, 
    title: "Document", 
    desc: "Provide a valid ID to complete your reservation" 
  },
  { 
    id: 4, 
    title: "Review Details", 
    desc: "Review your details to complete your booking reservation" 
  },
];

export default function AddBookingUser() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    // MAIN WRAPPER: Full screen layout
    <div className="flex w-full min-h-screen rounded-3xl overflow-hidden shadow-md">
      
      {/* --- LEFT SIDEBAR (Stepper) --- */}
      {/* Background color: bg-[#E3F2FD] matches the light blue shade */}
      <div className="w-full lg:w-[360px] bg-[#E3F2FD] p-12 flex flex-col gap-12 relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-5 relative z-10">
            {/* Vertical Line Connector */}
            {index !== steps.length - 1 && (
              <div className="absolute left-[17px] top-10 w-[2px] h-[58px] bg-blue-200" />
            )}

            {/* Step Circle Indicator */}
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 bg-white transition-all duration-300",
                currentStep === step.id && "border-blue-600 bg-blue-600 text-white",
                currentStep > step.id && "border-blue-600 bg-blue-600 text-white"
              )}
            >
              {currentStep > step.id ? (
                // Use a bold checkmark for completed steps
                <Check size={18} strokeWidth={3} />
              ) : (
                <span className={cn("text-xs font-bold", currentStep === step.id ? "text-white" : "text-slate-400")}>
                  {step.id}
                </span>
              )}
            </div>

            {/* Step Text Labels */}
            <div className="flex flex-col">
              <p className={cn(
                "text-sm font-bold transition-colors",
                currentStep >= step.id ? "text-slate-900" : "text-slate-400"
              )}>
                {step.title}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight mt-1 max-w-[200px]">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* --- RIGHT SIDE (Form Content) --- */}
      <div className="flex-1 bg-white p-16 flex flex-col">
        {/* Back Button */}
        <Link href="/home/user-dashboard">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg border-slate-200 mb-8"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </Button>
        </Link>

        {/* Dynamic Title and Description */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{steps[currentStep - 1].title}</h2>
          <p className="text-base text-slate-500 mt-2">{steps[currentStep - 1].desc}</p>
        </div>

        <hr className="mb-12 border-slate-100" />

        {/* --- FORM AREA --- */}
        <div className="flex-1">
          {/* STEP 1: Booking Details */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Check-in Date */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Check-in Date</label>
                <div className="relative">
                  <Input type="date" className="h-12 border-slate-200" />
                </div>
              </div>
              
              {/* Check-out Date */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Check-out Date</label>
                <div className="relative">
                  <Input type="date" className="h-12 border-slate-200" />
                </div>
              </div>
              
              {/* Room Type */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Room Type</label>
                <Select>
                  <SelectTrigger className="h-12 border-slate-200 text-slate-500">
                    <SelectValue placeholder="Choose your room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Cabin</SelectItem>
                    <SelectItem value="deluxe">Deluxe Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {/* Add dynamic forms for steps 2, 3, and 4 here */}
        </div>

        {/* --- FOOTER BUTTONS --- */}
        <div className="mt-auto pt-10 flex justify-end gap-5 border-t border-slate-50">
          <Link href="/home/user-dashboard">
            <Button variant="outline" className="px-12 h-12 border-blue-200 text-blue-600 font-bold hover:bg-blue-50">
              Cancel
            </Button>
          </Link>
          <Button 
            className="px-14 h-12 bg-[#3498db] hover:bg-[#2980b9] font-bold"
            onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
          >
            {currentStep === 4 ? "Complete Booking" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}