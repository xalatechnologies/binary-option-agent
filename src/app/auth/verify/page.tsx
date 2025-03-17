"use client";

import { Mail } from "lucide-react";
import Link from "next/link";

export default function Verify() {
  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="rounded-lg border border-border/40 bg-card p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground">
              A sign-in link has been sent to your email address.
              Please check your inbox and click the link to continue.
            </p>
          </div>
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email?
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
