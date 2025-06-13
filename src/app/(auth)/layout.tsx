"use client"
import { DASHBOARD, LOGIN, ONBOARDING } from '@/lib/constant/Route';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {


    return (
        <div className='w-full h-[100vh]'>
            {children}
        </div>
    )
}

export default AuthLayout