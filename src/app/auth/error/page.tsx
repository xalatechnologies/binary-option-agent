"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An error occurred during authentication.";
  if (error === "Verification") {
    errorMessage = "The sign-in link is no longer valid. Please request a new one.";
  } else if (error === "AccessDenied") {
    errorMessage = "You do not have permission to access this resource.";
  } else if (error === "Configuration") {
    errorMessage = "There is a problem with the server configuration.";
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="rounded-lg border border-border/40 bg-card p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Authentication Error
            </h1>
            <p className="text-sm text-muted-foreground">
              {errorMessage}
            </p>
          </div>
          <Link
            href="/auth/signin"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
