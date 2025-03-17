"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";

export default function SignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      await signOut({ redirect: false });
      toast.success("Successfully signed out!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="rounded-lg border border-border/40 bg-card p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="rounded-full bg-primary/10 p-3">
            <LogOut className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign out of your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to sign out?
            </p>
          </div>
          <div className="flex w-full space-x-4">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border/40 bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
