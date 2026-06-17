"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPasswordClient() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [newPassword, confirmPassword]);

  const handleReset = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      setIsSuccess(true);
    }
  };

  const isValidationMet = (validationType: string, passwordToValidate: string) => {
    switch (validationType) {
      case "length": return passwordToValidate.length >= 8;
      case "uppercase": return /[A-Z]/.test(passwordToValidate);
      case "lowercase": return /[a-z]/.test(passwordToValidate);
      case "number": return /[0-9]/.test(passwordToValidate);
      case "special": return /[!@#$%^&*(),.?":{}|<>]/.test(passwordToValidate);
      default: return false;
    }
  };

  const ValidationItem = ({ label, isMet }: { label: string; isMet: boolean }) => (
    <div className="flex items-center gap-2 mb-1.5">
      <div className={`h-2 w-2 rounded-full ${isMet ? "bg-[#22C55E]" : "bg-[#A0B3D1]"}`} />
      <span className={`text-[11px] font-medium ${isMet ? "text-[#22C55E]" : "text-[#1a1a1a] opacity-70"}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans relative">
      
      {/* SUCCESS MODAL */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
          <div className="bg-white rounded-[32px] p-12 max-w-[620px] w-full flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="mb-8">
              <div className="h-24 w-24 rounded-full border-[3px] border-[#22C55E] flex items-center justify-center">
                <div className="h-16 w-16 bg-[#22C55E] rounded-full flex items-center justify-center">
                   <CheckCircle2 size={40} className="text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            
            <h2 className="text-[36px] font-bold text-black mb-4 tracking-tight">Reset Password Successfully</h2>
            <p className="text-[#1a1a1a] text-[16px] mb-10 leading-relaxed max-w-[480px] opacity-80">
              Your password has been changed. Please log in again to continue.
            </p>
            
            <Button 
              onClick={() => window.location.href = "/"}
              className="h-[60px] w-full bg-[#3282B8] hover:bg-[#2B719E] text-white font-bold text-[18px] rounded-2xl transition-all shadow-md active:scale-[0.98]"
            >
              Back to login
            </Button>
          </div>
        </div>
      )}

      {/* LEFT SIDE: FORM */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-8 lg:px-16">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-5%] right-[-5%] h-[500px] w-[500px] opacity-20 blur-[100px]">
            <Image src="/blu.png" alt="" fill className="object-contain" />
          </div>
          <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] opacity-15 blur-[80px]">
            <Image src="/blu.png" alt="" fill className="object-contain" />
          </div>
        </div>

        <div className="z-10 w-full max-w-[380px]">
          <div className="flex flex-col items-center">
            <div className="relative h-12 w-48 mb-8">
              <Image src="/tnkclogo.png" alt="TNKC HOUSE Logo" fill className="object-contain" priority />
            </div>

            <div className="w-full text-center">
              <h1 className="text-[36px] font-bold text-black text-center mb-10">Reset Password</h1>
              
              <div className="space-y-5 text-left">
                <div className="space-y-1.5">
                  <Label className="text-[#5B89B6] text-[13px] font-medium">New Password</Label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setIsInputClicked(true)}
                      className="h-[50px] w-full bg-[#E7F0FF] border-transparent px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3282B8]"
                      placeholder="Enter new password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0B3D1]"
                    >
                      {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[#5B89B6] text-[13px] font-medium">Confirm New Password</Label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setIsInputClicked(true)}
                      className="h-[50px] w-full bg-[#E7F0FF] border-transparent px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3282B8]"
                      placeholder="Enter confirm new password"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0B3D1]"
                    >
                      {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>

                  {!passwordsMatch && (
                    <p className="text-[#E27C7C] text-[11px] font-medium mt-1">
                      Password doesn't match
                    </p>
                  )}

                  {isInputClicked && passwordsMatch && (
                    <div className="pt-3 animate-in fade-in slide-in-from-top-1 duration-300">
                      <ValidationItem label="Must be at least 8 characters long" isMet={isValidationMet("length", newPassword)} />
                      <ValidationItem label="Must include at least one uppercase letter" isMet={isValidationMet("uppercase", newPassword)} />
                      <ValidationItem label="Must include at least one lowercase letter" isMet={isValidationMet("lowercase", newPassword)} />
                      <ValidationItem label="Must include at least one number" isMet={isValidationMet("number", newPassword)} />
                      <ValidationItem label="Must include at least one special character" isMet={isValidationMet("special", newPassword)} />
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleReset}
                  disabled={!passwordsMatch || !isValidationMet("length", newPassword)}
                  className="h-[50px] w-full bg-[#3282B8] hover:bg-[#2B719E] disabled:bg-[#3282B8]/50 text-white font-bold text-[16px] rounded-xl mt-2 transition-colors"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: IMAGE */}
      <div className="hidden lg:block relative flex-1">
        <Image src="/LoginPic.jpg" alt="Building" fill className="object-cover" priority />
      </div>
    </div>
  );
}