import type { Metadata } from "next";
import "./globals.css";
import "@/app/css/globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Hiilbox | Trusted Somali Crowdfunding",
  description: "Secure and transparent Somali crowdfunding for communities, emergencies, education, health, and charitable causes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}