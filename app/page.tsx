import Image from "next/image";
import { AuthContent } from "@/components/pages/auth-content"; 

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-white overflow-hidden font-sans relative">
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-20 bg-white">
        
        {/* Background Blobs (Server Side) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] h-[800px] w-[800px] opacity-15 blur-[120px]">
            <Image src="/blu.png" alt="" fill className="object-contain" />
          </div>
          <div className="absolute bottom-[-10%] left-[-10%] h-[700px] w-[700px] opacity-10 blur-[120px]">
            <Image src="/blu.png" alt="" fill className="object-contain" />
          </div>
        </div>

        <div className="z-10 w-full max-w-[420px]">
          <div className="flex flex-col items-center mb-10">
            <div className="relative h-16 w-64 mb-6">
              <Image src="/tnkclogo.png" alt="Logo" fill className="object-contain" priority />
            </div>
            
            {/* Entry point for Client Logic */}
            <AuthContent />
          </div>
        </div>
      </div>

      {/* Hero Image (Server Side) */}
      <div className="hidden lg:block relative flex-1">
        <Image src="/LoginPic.jpg" alt="Modern Building" fill className="object-cover" priority />
      </div>
    </div>
  );
}