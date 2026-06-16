import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevTasks",
  description: "A simple task manager built with Next.js and Prisma",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
