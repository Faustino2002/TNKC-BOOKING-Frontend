import { Metadata } from "next";
import HomeLayoutView from "@/components/pages/homelayout";

export const metadata: Metadata = {
  title: "TNKC HOUSE | Dashboard",
  description: "Management Portal",
};

export default function HomeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeLayoutView>
      {children}
    </HomeLayoutView>
  );
}