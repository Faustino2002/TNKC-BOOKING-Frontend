"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, EyeOff, Eye } from "lucide-react";

export function LoginForm({ 
  username, setUsername, password, setPassword, showPassword, setShowPassword, 
  fieldErrors, loginError, isLockedOut, handleLogin, setView 
}: any) {
  return (
    <div className="w-full">
      <h1 className="text-[48px] font-bold tracking-tight text-black text-center mb-12">Welcome Back</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-[#5B89B6] font-medium text-[16px]">Username</Label>
          <div className="relative">
            <Input
              disabled={isLockedOut}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`h-[56px] border px-4 rounded-xl text-lg ${fieldErrors.username ? "bg-[#FEECEC] border-[#E27C7C]" : "bg-[#E7F0FF] border-transparent"}`}
              placeholder="Username"
            />
            {fieldErrors.username && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E27C7C]" size={20} />}
          </div>
          {fieldErrors.username && <p className="text-[#E27C7C] text-[13px]">Username is required</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-[#5B89B6] font-medium text-[16px]">Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              disabled={isLockedOut}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`h-[56px] border px-4 pr-12 rounded-xl text-lg ${fieldErrors.password ? "bg-[#FEECEC] border-[#E27C7C]" : "bg-[#E7F0FF] border-transparent"}`}
              placeholder="Password"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {fieldErrors.password ? (
                <AlertCircle className="text-[#E27C7C]" size={20} />
              ) : (
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0B3D1] hover:text-[#3282B8]">
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center px-1">
            {fieldErrors.password ? <p className="text-[#E27C7C] text-[13px]">Password is required</p> : <div></div>}
            <button onClick={() => setView("forgot")} className="text-[13px] font-medium text-[#3282B8] hover:underline">Forgot password?</button>
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

        <Button onClick={handleLogin} disabled={isLockedOut} className="h-[56px] w-full bg-[#3282B8] hover:bg-[#2B719E] text-white font-bold text-lg rounded-xl">
          Login
        </Button>
      </div>
    </div>
  );
}