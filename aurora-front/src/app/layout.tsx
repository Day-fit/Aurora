import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header/header";
import React from "react";

export const metadata: Metadata = {
  title: "AuroraResume",
  description: "AuroraResume is a powerful online resume builder that helps you create professional resumes quickly and easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <>
              <Header/>
              <div className="pointer-events-none absolute -left-24 -top-10 w-80 h-80 rounded-full bg-linear-to-tr from-aurora-blue-dark/40 to-aurora-green-dark/30 blur-3xl opacity-30 transform rotate-12 animate-pulse" />
              <div className="pointer-events-none absolute -right-24 -bottom-10 w-96 h-96 rounded-full bg-linear-to-br from-aurora-green-dark/30 to-aurora-blue-dark/20 blur-3xl opacity-25 transform -rotate-6" />
              {children}
          </>
      </body>
    </html>
  );
}
