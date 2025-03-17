import React from "react";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeAwareToast } from "@/components/theme/ThemeAwareToast";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LogIn, LogOut, Menu } from "lucide-react";

export const metadata: Metadata = {
  title: "Binary Options Trading Agent",
  description: "AI-powered automated trading system",
  icons: {
    icon: "/favicon.ico",
  },
};

async function getSession() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider defaultTheme="system" enableSystem>
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
              <div className="flex items-center gap-2 font-semibold">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span>Trading Agent</span>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center space-x-6 ml-6">
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/trading"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Trading
                </Link>
                <Link
                  href="/settings"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Settings
                </Link>
              </nav>

              {/* Auth Controls */}
              <div className="ml-auto flex items-center space-x-4">
                {session ? (
                  <Link
                    href="/auth/signout"
                    className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container max-w-screen-2xl py-6">
            <TRPCReactProvider>
              {children}
              <ThemeAwareToast />
            </TRPCReactProvider>
          </main>

          {/* Footer */}
          <footer className="border-t border-border/40 bg-card py-6">
            <div className="container max-w-screen-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Trading Agent. All rights reserved.
              </p>
              <nav className="flex items-center space-x-6">
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </nav>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
