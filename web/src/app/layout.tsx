import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/components/auth-intializer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});
export const metadata: Metadata = {
  title: "XO Game",
  description: "Enjoyable time with XO",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} `}>
      <AuthInitializer />
      <body>{children}</body>
    </html>
  );
}
