import Link from "next/link";

export default function NavItem({ icon, label, isActive, href }: { icon: React.ReactNode, label: string, isActive: boolean, href: string }) {
  return (
    <Link href={href}>
      <div className={`flex items-center rounded-lg cursor-pointer transition-all duration-200 h-12 px-3 
        ${isActive ? "bg-[#3498db] text-white shadow-md" : "text-gray-400 hover:bg-[#E7F0FF] hover:text-[#3282B8]"}`}>
        <div className="shrink-0 w-6 flex justify-center">{icon}</div>
        <span className="ml-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
          {label}
        </span>
      </div>
    </Link>
  );
}