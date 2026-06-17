"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  CalendarDays, 
  CloudUpload, 
  FileText, 
  Trash2, 
  CheckCircle2,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddBookingUserProps {
  onBack?: () => void;
  onCancel?: () => void;
}

export default function AddBookingUser({ onBack, onCancel }: AddBookingUserProps) {
  const router = useRouter(); 
  const fileInputRef = useRef<HTMLInputElement>(null); 
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Unified Form State
  const [formData, setFormData] = useState({
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    roomType: "",
    seamanId: "",
    firstName: "",
    lastName: "",
    middleName: "",
    contactNumber: "",
    email: "",
    rank: "",
    purpose: ""
  });

  const steps = [
    { number: 1, label: "Booking Details", description: "Provide the check-in date and check-out date for your reservation." },
    { number: 2, label: "Personal Information", description: "Provide your personal details to complete the reservation." },
    { number: 3, label: "Document", description: "Provide a valid ID to complete your reservation." },
    { number: 4, label: "Review Details", description: "Review all the details provided to complete the reservation." },
  ];

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    // Logic for Numbers-Only fields
    if (field === "seamanId" || field === "contactNumber") {
      const numericValue = typeof value === 'string' ? value.replace(/\D/g, "") : value;
      setFormData(prev => ({ ...prev, [field]: numericValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to check if email is valid for the Next button
  const isEmailValid = (email: string) => {
    return email.includes("@") && email.includes(".");
  };

  const handleExit = () => {
    if (onBack) {
      onBack();
    } else if (onCancel) {
      onCancel();
    } else {
      router.push("/home/user-dashboard"); 
    }
  };

  const resetForm = () => {
    setFormData({
      checkIn: undefined,
      checkOut: undefined,
      roomType: "",
      seamanId: "",
      firstName: "",
      lastName: "",
      middleName: "",
      contactNumber: "",
      email: "",
      rank: "",
      purpose: ""
    });
    setCurrentStep(1);
    setIsUploaded(false);
    setShowSuccessModal(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${Math.round(file.size / 1024)} KB`);
      setIsUploaded(true);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setIsUploaded(false);
    setFileName("");
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Success Modal Sub-component
  const SuccessModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full mx-4 relative shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        <button 
          onClick={handleExit}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-[#4ADE80] rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-white" size={24} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mb-2">Booking Successful</h2>
        <p className="text-slate-500 mb-10">The booking has been successfully created.</p>

        <div className="flex w-full gap-3">
          <button 
            onClick={resetForm}
            className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Create new booking
          </button>
          <button 
            onClick={handleExit}
            className="flex-1 py-3 bg-[#1e4eb8] text-white rounded-xl font-bold hover:bg-[#163a8a] transition-all shadow-md"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex bg-white animate-in slide-in-from-right duration-500 font-sans">
      
      {showSuccessModal && <SuccessModal />}

      {/* LEFT SIDEBAR */}
      <aside className="w-[420px] bg-[#D9EAFE] h-full p-16 flex flex-col gap-12">
        {steps.map((step) => {
          const isCurrent = step.number === currentStep;
          const isDone = step.number < currentStep;

          return (
            <div key={step.number} className="flex gap-6 items-start">
              <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                isCurrent || isDone ? "bg-[#2980b9] border-[#2980b9]" : "bg-white border-white shadow-sm"
              }`}>
                {isDone || isCurrent ? (
                  <CheckCircle2 size={20} className="text-white" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className={`font-bold text-xl ${isCurrent || isDone ? "text-[#1e3a5f]" : "text-slate-400"}`}>
                  {step.label}
                </h3>
                <p className={`text-[14px] leading-snug font-medium ${isCurrent || isDone ? "text-slate-500" : "text-slate-300"}`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 flex flex-col relative h-full">
        <div className="pt-14 px-16">
          <button 
            type="button"
            onClick={handleExit}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-400 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="flex-1 px-16 pt-12 overflow-y-auto pb-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-[#1e3a5f] mb-2">
                {currentStep === 4 ? "Review" : steps[currentStep - 1].label}
            </h1>
            <p className="text-slate-500 font-medium">{steps[currentStep - 1].description}</p>
            <div className="h-[1px] bg-slate-100 w-full mt-6" />
          </div>

          {/* STEP 1: BOOKING DETAILS */}
          {currentStep === 1 && (
            <div className="grid grid-cols-3 gap-8 max-w-6xl animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Check-in Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn("w-full h-12 pl-12 pr-4 flex items-center border border-slate-200 rounded-lg relative hover:bg-slate-50", !formData.checkIn && "text-slate-400")}>
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      {formData.checkIn ? format(formData.checkIn, "PPP") : <span>Select a date</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={formData.checkIn} onSelect={(date) => handleInputChange("checkIn", date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Check-out Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn("w-full h-12 pl-12 pr-4 flex items-center border border-slate-200 rounded-lg relative hover:bg-slate-50", !formData.checkOut && "text-slate-400")}>
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      {formData.checkOut ? format(formData.checkOut, "PPP") : <span>Select a date</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={formData.checkOut} onSelect={(date) => handleInputChange("checkOut", date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Room Type</label>
                <Select onValueChange={(val) => handleInputChange("roomType", val)} value={formData.roomType}>
                  <SelectTrigger className="h-12 border-slate-200 text-slate-400 rounded-lg">
                    <SelectValue placeholder="Choose your room type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="shared">Shared Cabin</SelectItem>
                    <SelectItem value="single">Single Room</SelectItem>
                    <SelectItem value="dorm">Female Dorm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL INFORMATION */}
          {currentStep === 2 && (
            <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Seaman ID Number</label>
                <Input value={formData.seamanId} onChange={(e) => handleInputChange("seamanId", e.target.value)} placeholder="Enter ID Number (Numbers only)" className="h-12 border-slate-200" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">First Name</label>
                  <Input value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} placeholder="Enter First Name" className="h-12 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Last Name</label>
                  <Input value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} placeholder="Enter Last Name" className="h-12 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold text-slate-700">Middle Name</label>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Optional</span>
                  </div>
                  <Input value={formData.middleName} onChange={(e) => handleInputChange("middleName", e.target.value)} placeholder="Enter Middle Name" className="h-12 border-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Contact Number</label>
                  <Input value={formData.contactNumber} onChange={(e) => handleInputChange("contactNumber", e.target.value)} placeholder="Enter Contact Number (Numbers only)" className="h-12 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <Input 
                    value={formData.email} 
                    onChange={(e) => handleInputChange("email", e.target.value)} 
                    placeholder="example@email.com" 
                    type="email" 
                    className={cn("h-12 border-slate-200", formData.email && !isEmailValid(formData.email) && "border-red-500 focus-visible:ring-red-500")} 
                  />
                  {formData.email && !isEmailValid(formData.email) && (
                    <p className="text-[10px] text-red-500 font-medium">Please enter a valid email with @ and .</p>
                  )}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700">Rank</label>
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Optional</span>
                    </div>
                  <Input value={formData.rank} onChange={(e) => handleInputChange("rank", e.target.value)} placeholder="Enter Rank" className="h-12 border-slate-200" />
                </div>
              </div>
              <div className="w-1/3 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Purpose of Stay</label>
                <Select onValueChange={(val) => handleInputChange("purpose", val)} value={formData.purpose}>
                  <SelectTrigger className="h-12 border-slate-200 text-slate-400">
                    <SelectValue placeholder="Select your purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="deployment">Deployment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENT UPLOAD */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center bg-slate-50/30 cursor-pointer hover:bg-slate-50" onClick={handleUploadClick}>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <CloudUpload className="text-[#3498db]" size={32} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-slate-600 font-medium"><span className="text-[#3498db] font-bold">Click to upload</span> or drag and drop files here</p>
                  <p className="text-xs text-slate-400">PDF, SVG, PNG, JPG or GIF</p>
                </div>
              </div>
              {isUploaded && (
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                        {filePreview ? <img src={filePreview} alt="upload preview" className="w-full h-full object-cover" /> : <FileText className="text-slate-400" size={20} />}
                      </div>
                      <span className="font-bold text-slate-800 truncate max-w-[300px]">{fileName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-900 cursor-pointer hover:underline" onClick={handleRemoveFile}>Delete All</span>
                      <Trash2 size={18} className="text-slate-400 cursor-pointer hover:text-red-500" onClick={handleRemoveFile} />
                    </div>
                  </div>
                  <div className="w-full h-3 bg-[#4ADE80] rounded-full" />
                  <div className="flex justify-between mt-2">
                    <p className="text-[11px] font-bold text-slate-800">Upload Successful!</p>
                    <p className="text-[11px] font-bold text-slate-800">{fileSize} <span className="ml-2 text-slate-300">100%</span></p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: REVIEW DETAILS */}
          {currentStep === 4 && (
            <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="space-y-4">
                <div className="bg-[#3498db] text-white px-6 py-2 rounded-md font-semibold text-lg">
                  Booking Details
                </div>
                <div className="grid grid-cols-3 gap-6 px-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-600">Check-in Date</p>
                    <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500">
                      <CalendarDays size={16} className="mr-2" />
                      {formData.checkIn ? format(formData.checkIn, "MM/dd/yyyy") : "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-600">Check-out Date</p>
                    <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500">
                      <CalendarDays size={16} className="mr-2" />
                      {formData.checkOut ? format(formData.checkOut, "MM/dd/yyyy") : "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-600">Room Type</p>
                    <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500 capitalize">
                      {formData.roomType || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#3498db] text-white px-6 py-2 rounded-md font-semibold text-lg">
                  Personal Information
                </div>
                <div className="space-y-6 px-2">
                   <div className="w-1/3 space-y-1">
                    <p className="text-sm font-semibold text-slate-600">Seaman ID Number</p>
                    <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500">
                      {formData.seamanId || "N/A"}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-600">First Name</p>
                      <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500">{formData.firstName || "N/A"}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-600">Last Name</p>
                      <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500">{formData.lastName || "N/A"}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-600">Middle Name <span className="text-[10px] text-slate-400 ml-1">Optional</span></p>
                      <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500">{formData.middleName || "N/A"}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-600">Contact Number</p>
                      <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500">{formData.contactNumber || "N/A"}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-600">Email</p>
                      <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500">{formData.email || "N/A"}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-600">Rank <span className="text-[10px] text-slate-400 ml-1">Optional</span></p>
                      <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500">{formData.rank || "N/A"}</div>
                    </div>
                  </div>

                  <div className="w-1/3 space-y-1">
                    <p className="text-sm font-semibold text-slate-600">Purpose of Stay</p>
                    <div className="h-12 border border-slate-200 rounded-lg flex items-center px-4 bg-slate-50/50 text-slate-500 capitalize">
                      {formData.purpose || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#3498db] text-white px-6 py-2 rounded-md font-semibold text-lg">
                  Documentation
                </div>
                <div className="px-2">
                    {isUploaded ? (
                        <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50/50 w-fit min-w-[300px]">
                            <FileText size={20} className="text-blue-500" />
                            <span className="font-medium text-slate-700">{fileName}</span>
                        </div>
                    ) : (
                        <p className="text-slate-400 italic">No document uploaded</p>
                    )}
                </div>
              </div>

            </div>
          )}
        </div>

        <footer className="p-16 flex justify-end gap-4 bg-white border-t border-slate-50">
          <button 
            type="button"
            onClick={currentStep === 1 ? handleExit : () => setCurrentStep(prev => prev - 1)}
            className="px-10 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>
          <button 
            type="button"
            // Simple validation check before allowing "Next" on Personal Info step
            disabled={currentStep === 2 && !isEmailValid(formData.email)}
            onClick={() => {
              if(currentStep === 4) {
                setShowSuccessModal(true);
              } else {
                setCurrentStep(prev => Math.min(prev + 1, 4));
              }
            }}
            className={cn(
              "px-14 py-3 bg-[#3498db] text-white rounded-xl text-sm font-bold hover:bg-[#2980b9] shadow-md transition-all active:scale-95",
              currentStep === 2 && !isEmailValid(formData.email) && "opacity-50 cursor-not-allowed bg-slate-400"
            )}
          >
            {currentStep === 4 ? "Submit" : "Next"}
          </button>
        </footer>
      </main>
    </div>
  );
}