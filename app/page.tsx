"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Added 'Eye' to imports
import { AlertCircle, EyeOff, Eye, Check } from "lucide-react";

export default function LoginPage() {
  // 1. View & Success States
  const [view, setView] = useState<"login" | "forgot">("login");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 2. Input States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  
  // NEW: State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);
  
  // 3. Login Error & Lockout
  const [fieldErrors, setFieldErrors] = useState({ username: false, password: false });
  const [loginError, setLoginError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  // 4. Forgot Password Error States
  const [emailError, setEmailError] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);

  // Helper for your backend developer
  const logDataForBackend = (action: string) => {
    console.log("Submission Data:", {
      event: action,
      timestamp: new Date().toISOString(),
      payload: { username, password, email }
    });
  };

  const handleLogin = () => {
    const uError = username.trim() === "";
    const pError = password.trim() === "";
    setFieldErrors({ username: uError, password: pError });

    if (uError || pError) {
      setLoginError(false);
      return;
    }

    logDataForBackend("LOGIN_ATTEMPT");

    if (username !== "admin" || password !== "1234") {
      setLoginError(true);
      setFailedAttempts((prev) => prev + 1);
    } else {
      setLoginError(false);
      setFailedAttempts(0);
      alert("Login Success!");
    }
  };

  const handleResetLink = () => {
    const emailTrimmed = email.trim();
    
    if (emailTrimmed === "") {
      setEmailError(true);
      setEmailInvalid(false);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setEmailInvalid(true);
      setEmailError(false);
      return;
    }

    setEmailError(false);
    setEmailInvalid(false);
    logDataForBackend("FORGOT_PASSWORD_REQUEST");
    setShowSuccess(true);
  };

  const isLockedOut = failedAttempts >= 3;

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-white overflow-hidden font-sans relative">
      
      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] p-12 max-w-[620px] w-full text-center shadow-2xl">
            <div className="flex justify-center mb-8">
              <div className="h-24 w-24 rounded-full border-[3px] border-[#22C55E] flex items-center justify-center">
                <Check className="text-[#22C55E]" size={48} strokeWidth={2.5} />
              </div>
            </div>
            <h2 className="text-[34px] font-bold text-black mb-4 leading-tight">Reset Link Sent Successfully</h2>
            <p className="text-[#1a1a1a] text-[15px] leading-relaxed mb-10 px-4">
              A reset password link has been sent to you via email. You can follow that link and create a new password. If the email does not arrive, contact your tech support
            </p>
            <Button 
              onClick={() => {
                setShowSuccess(false);
                setView("login");
                setEmail("");
              }}
              className="h-14 w-full bg-[#3282B8] hover:bg-[#2B719E] text-white font-medium text-lg rounded-xl"
            >
              Back to login
            </Button>
          </div>
        </div>
      )}

      {/* LEFT SIDE: FORM CONTENT */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-20 bg-white">
        
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] h-[800px] w-[800px] opacity-15 blur-[120px]">
            <Image src="/blu.png" alt="" fill className="object-contain" />
          </div>
          <div className="absolute bottom-[-10%] left-[-10%] h-[700px] w-[700px] opacity-10 blur-[120px]">
            <Image src="/blu.png" alt="" fill className="object-contain" />
          </div>
        </div>

        <div className="z-10 w-full max-w-[420px]">
          
          {isLockedOut && view === "login" && (
            <div className="w-full flex items-start gap-3 p-4 bg-[#FEECEC] border border-[#FAD2D2] rounded-xl mb-8 animate-in fade-in slide-in-from-top-2">
              <div className="mt-1 flex items-center justify-center h-5 w-5 min-w-[20px] rounded-full border border-[#D32F2F]">
                <span className="text-[#D32F2F] text-[12px] font-bold">!</span>
              </div>
              <div className="flex flex-col">
                <p className="text-[#D32F2F] text-[14px] font-bold leading-tight">Too many failed login attempts</p>
                <p className="text-[#D32F2F] text-[12px] opacity-80 mt-0.5 font-medium">Unavailable due too many login attempts. Try again later.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center mb-10">
            <div className="relative h-16 w-64 mb-6">
              <Image src="/tnkclogo.png" alt="TNKC HOUSE Logo" fill className="object-contain" priority />
            </div>

            {view === "login" ? (
              <div className="w-full">
                <h1 className="text-[48px] font-bold tracking-tight text-black text-center mb-12">Welcome Back</h1>
                
                <div className="space-y-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label className="text-[#5B89B6] font-medium text-[16px]">Username</Label>
                    <div className="relative">
                      <Input
                        disabled={isLockedOut}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`h-[56px] border px-4 rounded-xl text-lg ${
                          fieldErrors.username ? "bg-[#FEECEC] border-[#E27C7C]" : "bg-[#E7F0FF] border-transparent"
                        }`}
                        placeholder="Username"
                      />
                      {fieldErrors.username && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E27C7C]" size={20} />}
                    </div>
                    {fieldErrors.username && <p className="text-[#E27C7C] text-[13px]">Username is required</p>}
                  </div>

                  {/* Password with Toggle Visibility */}
                  <div className="space-y-2">
                    <Label className="text-[#5B89B6] font-medium text-[16px]">Password</Label>
                    <div className="relative">
                      <Input
                        // Toggle between 'password' and 'text' types
                        type={showPassword ? "text" : "password"}
                        disabled={isLockedOut}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`h-[56px] border px-4 pr-12 rounded-xl text-lg ${
                          fieldErrors.password ? "bg-[#FEECEC] border-[#E27C7C]" : "bg-[#E7F0FF] border-transparent"
                        }`}
                        placeholder="Password"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {fieldErrors.password && <AlertCircle className="text-[#E27C7C]" size={20} />}
                        
                        {/* Only show toggle button if there's no required-field error icon */}
                        {!fieldErrors.password && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[#A0B3D1] hover:text-[#3282B8] transition-colors focus:outline-none"
                          >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      {fieldErrors.password ? <p className="text-[#E27C7C] text-[13px]">Password is required</p> : <div></div>}
                      <button onClick={() => setView("forgot")} className="text-[13px] font-medium text-[#3282B8] hover:underline">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {loginError && !isLockedOut && (
                    <div className="flex items-start gap-3 p-4 bg-[#FEECEC] border border-[#FAD2D2] rounded-xl">
                      <AlertCircle className="text-[#E27C7C] mt-0.5" size={20} />
                      <div>
                        <p className="text-[#D32F2F] text-[14px] font-bold">Invalid username or password</p>
                        <p className="text-[#D32F2F] text-[12px] opacity-80">Please check your credentials and try again.</p>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleLogin} 
                    disabled={isLockedOut}
                    className="h-[56px] w-full bg-[#3282B8] hover:bg-[#2B719E] text-white font-bold text-lg rounded-xl transition-all"
                  >
                    Login
                  </Button>
                </div>
              </div>
            ) : (
              /* FORGOT PASS VIEW */
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
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(false);
                          setEmailInvalid(false);
                        }}
                        className={`h-[56px] border px-4 rounded-xl text-lg ${
                          (emailError || emailInvalid) ? "bg-[#FEECEC] border-[#E27C7C]" : "bg-[#E7F0FF] border-transparent"
                        }`}
                        placeholder="Enter your email"
                      />
                      {(emailError || emailInvalid) && (
                        <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E27C7C]" size={20} />
                      )}
                    </div>
                    {emailError && <p className="text-[#E27C7C] text-[13px]">Email is required</p>}
                    {emailInvalid && <p className="text-[#E27C7C] text-[13px]">Invalid email format</p>}
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleResetLink}
                      className="h-[56px] w-full bg-[#3282B8] hover:bg-[#2B719E] text-white font-medium text-lg rounded-xl"
                    >
                      Send reset link
                    </Button>
                    <button 
                      onClick={() => { setView("login"); setEmailError(false); setEmailInvalid(false); }} 
                      className="h-[56px] w-full border border-[#3282B8] text-[#3282B8] font-medium text-lg rounded-xl hover:bg-[#F0F7FF] transition-colors"
                    >
                      Back to login
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE PIC */}
      <div className="hidden lg:block relative flex-1">
        <Image src="/LoginPic.jpg" alt="Modern Building" fill className="object-cover" priority />
      </div>
    </div>
  );
}