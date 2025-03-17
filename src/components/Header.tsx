"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
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
  );
} 