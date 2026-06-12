import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Croqtile Playground",
  description: "Write, compile, and run Croqtile code in the browser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
