import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Croqtile Playground",
  description: "Write, compile, and run Croqtile GPU kernel code in the browser. Includes tutorials and coding challenges.",
  keywords: ["Croqtile", "GPU", "playground", "compiler", "WASM", "WebAssembly", "CUDA"],
  authors: [{ name: "Croqtile Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e1e2e",
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
