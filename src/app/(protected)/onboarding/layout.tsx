"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { DASHBOARD } from "@/lib/constant/Route";


export default function OnBoardingLayout({ children }: { children: ReactNode }) {
  const { isOnBoarded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isOnBoarded) {
      router.replace(DASHBOARD);
    }
  }, [isOnBoarded, router]);

  if (isOnBoarded) return null;

  return <div>{children}</div>;
}
