import React from "react";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeAwareToast } from "@/components/theme/ThemeAwareToast";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Header } from "@/components/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Binary Options Trading Agent",
  description: "AI-powered automated trading system",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <AuthProvider>
          <ThemeProvider defaultTheme="system" enableSystem>
            <Header />

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
        </AuthProvider>
      </body>
    </html>
  );
}
