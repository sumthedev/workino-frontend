import AcceptInvitation from "@/components/organisms/AcceptInvitation/AcceptInvitation";
import InviteTeamMembers from "@/components/organisms/AcceptInvitation/InviteTeam/InviteTeam";


export default function TeamOnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Build Your Team</h1>
          <p className="text-muted-foreground">
            Collaborate better by inviting your team members to join your workspace
          </p>
        </div>
        <InviteTeamMembers/>
        {/* <AcceptInvitation token={""}/> */}
      </div>
    </div>
  )
}
