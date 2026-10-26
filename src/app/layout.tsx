
import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";
import "@/utils/i18n";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "../components/ui/toaster";
import { CustomizerContextProvider } from "@/app/context/CustomizerContext";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HiilBox | Somali Crowdfunding Platform",
  description:
    "HiilBox is a trusted crowdfunding platform helping communities raise funds and support meaningful causes.",
  icons: {
    icon: "/images/front-pages/background/white-icon-logo.svg",
    shortcut: "/images/front-pages/background/white-icon-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={inter.className}
          suppressHydrationWarning
        >
          <NextTopLoader
            color="#5d87ff"
            showSpinner={false}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CustomizerContextProvider>
              {children}
            </CustomizerContextProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
