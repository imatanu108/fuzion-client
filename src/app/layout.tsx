import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Poppins } from 'next/font/google';
import ClientOnlyWrapper from "@/components/ClientOnlyWrapper";
import Sidebar from "@/components/sidebar/Sidebar";

// Export your metadata here
export const metadata: Metadata = {
  title: "Fuzion",
  description: "Fuzion blends the best of YouTube and Twitter, letting you share videos, spark conversations, and connect with a vibrant community—all in one place."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="lg:mx-[6%] min-h-screen lg:border-x-2 border-[#4151598e]">
        <ClientOnlyWrapper>
          <div className="lg:grid lg:grid-cols-12">
            <div className="lg:col-span-3 hidden min-h-screen lg:block bg-slate-50 dark:bg-[#0e1f2a] lg:border-r-2 border-[#4151598e]">
              <Sidebar/>
            </div>
            <div className="lg:col-span-9 relative">
              <Header />
              <div className="pt-[16%] md:pt-[7%] pb-[30%] md:pb-[20%]">{children}</div>
              <Footer />
            </div>
          </div>
        </ClientOnlyWrapper>
      </body>
    </html>
  );
}
