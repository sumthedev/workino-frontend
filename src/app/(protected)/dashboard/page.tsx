
"use client"
import { ModeToggle } from '@/components/molecules/ModeToggle/ModeToggle'
import { Button } from '@/components/ui/button'
import { LOGIN } from '@/lib/constant/Route'
import { useRouter } from 'next/navigation'
import React from 'react'


function page() {
  const router = useRouter()
 
  const handleLogout = () => {
     if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }

    router.push(LOGIN)
  }

  return (
    <div>
      Dashboard 
      <ModeToggle />
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}

export default page
