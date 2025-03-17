"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface MockSessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function MockSessionProvider({ children, session }: MockSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
} 