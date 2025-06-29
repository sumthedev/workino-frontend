"use client";
import { Loading } from "@/components/molecules/Loading/Loading";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD } from "@/lib/constant/Route";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(DASHBOARD);
      }
    }

  }, [loading, user,]);

  if (loading) return <Loading />;

  return <div className="w-full h-[100vh]">{children}</div>;
};

export default AuthLayout;
