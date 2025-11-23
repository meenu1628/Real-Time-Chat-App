// components/ErrorToast.tsx
"use client";

import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {TriangleAlert } from "lucide-react";

export function ErrorAlert({ message, onClear }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClear("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClear]);

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
      <Alert variant="destructive" className="shadow-lg">
        <TriangleAlert className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
