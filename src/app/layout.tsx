import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Poppins } from 'next/font/google';
import ClientOnlyWrapper from "@/components/ClientOnlyWrapper";

const poppins = Poppins({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

// Export your metadata here
export const metadata: Metadata = {
  title: "Fuzion: Where Video Sharing Meets Social Interaction",
  description: "Fuzion blends the best of YouTube and Twitter, letting you share videos, spark conversations, and connect with a vibrant community—all in one place."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="lg:mx-auto lg:max-w-7xl pt-16">
        <ClientOnlyWrapper>
          <Header />
          <div className="my-16">
            {children}
          </div>
          <Footer />
        </ClientOnlyWrapper>
      </body>
    </html>
  );
}
