"use client";

import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "@/context/StoreContext";
import { SettingsProvider } from "@/context/SettingsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <StoreProvider>
          {children}
        </StoreProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}
