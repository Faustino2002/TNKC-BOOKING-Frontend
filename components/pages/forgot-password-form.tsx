"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function ForgotPasswordForm({ 
  email, setEmail, emailError, emailInvalid, setEmailError, setEmailInvalid, handleResetLink, setView 
}: any) {
  return (
    <div className="w-full">
      <h1 className="text-[44px] font-bold tracking-tight text-black text-center mb-3">Forgot Password</h1>
      <p className="text-[14px] text-black text-center mb-10">Enter your registered email and we will send you a reset link</p>
      
      <div className="space-y-6">
        <div className="space-y-2 text-left">
          <Label className="text-[#5B89B6] font-medium text-[16px]">Email</Label>
          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(false); setEmailInvalid(false); }}
              className={`h-[56px] border px-4 rounded-xl text-lg ${(emailError || emailInvalid) ? "bg-[#FEECEC] border-[#E27C7C]" : "bg-[#E7F0FF] border-transparent"}`}
              placeholder="Enter your email"
            />
            {(emailError || emailInvalid) && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E27C7C]" size={20} />}
          </div>
          {emailError && <p className="text-[#E27C7C] text-[13px]">Email is required</p>}
          {emailInvalid && <p className="text-[#E27C7C] text-[13px]">Invalid email format</p>}
        </div>

        <div className="space-y-3">
          <Button onClick={handleResetLink} className="h-[56px] w-full bg-[#3282B8] hover:bg-[#2B719E] text-white font-medium text-lg rounded-xl">
            Send reset link
          </Button>
          <button onClick={() => { setView("login"); setEmailError(false); setEmailInvalid(false); }} className="h-[56px] w-full border border-[#3282B8] text-[#3282B8] font-medium text-lg rounded-xl hover:bg-[#F0F7FF]">
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}