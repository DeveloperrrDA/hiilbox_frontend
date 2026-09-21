"use client";

import React from "react";
import NextTopLoader from "nextjs-toploader";
import "@/utils/i18n";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomizerContextProvider } from "@/app/context/CustomizerContext";
import { Toaster } from "@/components/ui/toaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextTopLoader color="#5d87ff" showSpinner={false} />
      <CustomizerContextProvider>{children}</CustomizerContextProvider>
      <Toaster />
    </ThemeProvider>
  );
}
