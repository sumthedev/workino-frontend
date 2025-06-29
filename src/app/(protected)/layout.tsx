"use client";
import { Loading } from "@/components/molecules/Loading/Loading";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode, useEffect, useMemo } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { user, loading } = useAuth();
 
  if (loading) return <Loading />;
  if (!user) return null;

  return <div className="w-full min-h-screen">{children}</div>;
};

export default ProtectedLayout;
