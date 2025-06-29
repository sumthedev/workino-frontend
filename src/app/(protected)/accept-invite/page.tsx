"use client"

import AcceptInvite from '@/components/organisms/AcceptInvitation/AcceptInvitation'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || ''

  return (
    <div className="h-screen bg-background flex items-center justify-center p-4">
      <AcceptInvite inviteToken={token}/>
    </div>
  )
}

function Page() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  )
}

export default Page