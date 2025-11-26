import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
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
      <body className="bg-bg-dark">
        <Header isLogged={false}/>
        {children}
      </body>
    </html>
  );
}
