"use client";
import { Loading } from '@/components/molecules/Loading/Loading';
import { useAuth } from '@/hooks/useAuth';
import { LOGIN, ONBOARDING } from '@/lib/constant/Route';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo } from 'react';

interface ProtectedLayoutProps {
    children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    const router = useRouter();
    const { user, loading, isOnBoarded } = useAuth()

    const redirectPath = useMemo(() => {
        if (!user) return LOGIN;
        if (!isOnBoarded) return ONBOARDING;

        return null;
    }, [user, isOnBoarded]);

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return null;
    }
    return (
        <div className="w-full min-h-screen">
                {children}
        </div>
    );
};

export default ProtectedLayout;
