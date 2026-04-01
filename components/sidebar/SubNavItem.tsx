import Link from "next/link";
import React from "react";

interface SubNavItemProps {
  label: string;
  href: string;
  isActive: boolean;
}

export default function SubNavItem({ label, href, isActive }: SubNavItemProps) {
  return (
    <Link
      href={href}
      className={`block py-2 text-[11px] transition-colors ${
        isActive 
          ? "text-[#3282B8] font-bold" 
          : "text-gray-400 hover:text-black"
      }`}
    >
      {label}
    </Link>
  );
}