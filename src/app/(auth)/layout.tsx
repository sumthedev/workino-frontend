"use client";
import { Loading } from "@/components/molecules/Loading/Loading";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD, LOGIN, ONBOARDING } from "@/lib/constant/Route";
import { useRouter, usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading, isOnBoarded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== LOGIN) {
        router.replace(LOGIN);
      } else if (user && !isOnBoarded && pathname !== ONBOARDING) {
        router.replace(ONBOARDING);
      } else if (user && isOnBoarded && pathname !== DASHBOARD) {
        router.replace(DASHBOARD);
      }
    }
  }, [loading, user, isOnBoarded, pathname, router]);

  if (loading) return <Loading />;

  return <div className='w-full h-[100vh]'>{children}</div>;
};

export default AuthLayout;
