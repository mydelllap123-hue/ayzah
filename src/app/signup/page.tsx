"use client";

import React, { useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { setIsLoginOpen } = useStore();
  const router = useRouter();

  useEffect(() => {
    setIsLoginOpen(true);
    router.replace("/");
  }, [setIsLoginOpen, router]);

  return (
    <div className="min-h-screen bg-pickle-50 flex items-center justify-center">
      <p className="text-brown-600 font-bold animate-pulse text-xl">Redirecting to Sign Up...</p>
    </div>
  );
}
