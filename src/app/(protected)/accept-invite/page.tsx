import AcceptInvite from '@/components/organisms/AcceptInvitation/AcceptInvitation'

export default function Page({ searchParams }: { 
  searchParams: { token?: string } 
}) {
  const token = searchParams.token || ''

   console.log(token);
   
  return (
    <div className="h-screen bg-background flex items-center justify-center p-4">
      <AcceptInvite inviteToken={token}/>
    </div>
  )
}