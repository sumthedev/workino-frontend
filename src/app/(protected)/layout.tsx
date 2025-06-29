"use client";
import { Loading } from "@/components/molecules/Loading/Loading";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD } from "@/lib/constant/Route";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const redirectPath = useMemo(() => {
    if (!loading === true) return DASHBOARD;
    return null;
  }, [loading]);

  useEffect(() => {
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [redirectPath, router]);

  if (loading) return <Loading />;
  if (!user) return null;

  return <div className="w-full min-h-screen">{children}</div>;
};

export default ProtectedLayout;
