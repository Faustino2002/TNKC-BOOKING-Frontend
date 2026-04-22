"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { useRouter } from "next/navigation"; 

export function AuthContent() {
  const router = useRouter(); 
  const [view, setView] = useState<"login" | "forgot">("login");
  const [showSuccess, setShowSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ username: false, password: false });
  const [loginError, setLoginError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [emailError, setEmailError] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const handleLogin = () => {
    const uError = username.trim() === "";
    const pError = password.trim() === "";
    
    setFieldErrors({ username: uError, password: pError });
    
    if (uError || pError) { 
      setLoginError(false); 
      return; 
    }

    if (username === "admin" && password === "1234") {
      // ADMIN FLOW
      setLoginError(false);
      setFailedAttempts(0);

      // --- ADDED: PERSIST ADMIN DATA ---
      localStorage.setItem("userFullName", "Klare Marasigan");
      localStorage.setItem("userRole", "Frontdesk");
      
      router.push("/home/dashboard"); 
      
    } else if (username === "user" && password === "user123") {
      // USER FLOW
      setLoginError(false);
      setFailedAttempts(0);

      // --- ADDED: PERSIST USER DATA ---
      localStorage.setItem("userFullName", "Randolph Faustino");
      localStorage.setItem("userRole", "Guest");

      router.push("/home/user-dashboard"); 
      
    } else {
      setLoginError(true);
      setFailedAttempts((prev) => prev + 1);
    }
  };

  // ... (Rest of your handleResetLink and JSX remains exactly the same)
  const handleResetLink = () => {
    const emailTrimmed = email.trim();
    if (emailTrimmed === "") { setEmailError(true); setEmailInvalid(false); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) { setEmailInvalid(true); setEmailError(false); return; }
    setEmailError(false); setEmailInvalid(false); setShowSuccess(true);
  };

  const isLockedOut = failedAttempts >= 3;

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] p-12 max-w-[620px] w-full text-center shadow-2xl">
            <div className="flex justify-center mb-8">
              <div className="h-24 w-24 rounded-full border-[3px] border-[#22C55E] flex items-center justify-center">
                <Check className="text-[#22C55E]" size={48} strokeWidth={2.5} />
              </div>
            </div>
            <h2 className="text-[34px] font-bold text-black mb-4">Reset Link Sent Successfully</h2>
            <Button onClick={() => { setShowSuccess(false); setView("login"); setEmail(""); }} className="h-14 w-full bg-[#3282B8] text-white rounded-xl">
              Back to login
            </Button>
          </div>
        </div>
      )}

      {isLockedOut && view === "login" && (
        <div className="w-full flex items-start gap-3 p-4 bg-[#FEECEC] border border-[#FAD2D2] rounded-xl mb-8">
           <p className="text-[#D32F2F] text-[14px] font-bold">Too many failed login attempts</p>
        </div>
      )}

      {view === "login" ? (
        <LoginForm 
          username={username} setUsername={setUsername} password={password} setPassword={setPassword}
          showPassword={showPassword} setShowPassword={setShowPassword} fieldErrors={fieldErrors}
          loginError={loginError} isLockedOut={isLockedOut} handleLogin={handleLogin} setView={setView}
        />
      ) : (
        <ForgotPasswordForm 
          email={email} setEmail={setEmail} emailError={emailError} emailInvalid={emailInvalid}
          setEmailError={setEmailError} setEmailInvalid={setEmailInvalid} handleResetLink={handleResetLink} setView={setView}
        />
      )}
    </>
  );
}