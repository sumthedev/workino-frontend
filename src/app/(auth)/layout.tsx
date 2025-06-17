"use client";
import { Loading } from "@/components/molecules/Loading/Loading";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD, FORGET_PASSWORD, LOGIN, ONBOARDING, REGISTER } from "@/lib/constant/Route";
import { useRouter, usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";



const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading, isOnBoarded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(LOGIN);
      } else if (user && !isOnBoarded && pathname !== ONBOARDING) {
        router.push(ONBOARDING);
      } else if (user && isOnBoarded && pathname !== DASHBOARD) {
        router.push(DASHBOARD);
      }
    }
  }, [loading, user, isOnBoarded, pathname, router]);

  if (loading) return <Loading />;

  return <div className='w-full h-[100vh]'>{children}</div>;
};

export default AuthLayout;
