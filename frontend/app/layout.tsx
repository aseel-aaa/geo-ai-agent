import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEOLens - Generative Engine Optimization Analyzer",
  description:
    "Optimize your website content for AI search engine visibility. Based on Princeton & Georgia Tech research published at ACM SIGKDD 2024.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col relative">
        <div className="geo-bg-mesh" />
        <div className="geo-grid-lines" />
        <div className="relative z-10 flex flex-col flex-1">{children}</div>
      </body>
    </html>
  );
}
