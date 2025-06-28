"use client"

import AcceptInvite from '@/components/organisms/AcceptInvitation/AcceptInvitation'
import { useSearchParams } from 'next/navigation'

 function Page() {
  const searchParams = useSearchParams();
    const token = searchParams.get('token') || ''

  return (
    <div className="h-screen bg-background flex items-center justify-center p-4">
       <AcceptInvite inviteToken={token}/>
      </div>
  )
}

export default Page

