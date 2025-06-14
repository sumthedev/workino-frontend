"use client";
import { useAuth } from "@/hooks/useAuth";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return <div>Loading...</div>;
  }

  console.log(user, "here i am");

  return (
    <div className='w-full h-[100vh]'>
      {children}
    </div>
  );
};

export default AuthLayout;
