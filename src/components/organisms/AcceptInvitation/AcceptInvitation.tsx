"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Users, Mail } from "lucide-react"


interface InvitationData {
  id: string
  email: string
  role: string
  teamName: string
  inviterName: string
  status: string
}

export default function AcceptInvitation({ token }: { token: string }) {
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
 

  useEffect(() => {
    // Simulate fetching invitation data
    const fetchInvitation = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock invitation data
        const mockInvitation: InvitationData = {
          id: Math.random().toString(36).substr(2, 9),
          email: "user@example.com",
          role: "MEMBER",
          teamName: "Development Team",
          inviterName: "John Doe",
          status: "PENDING",
        }

        setInvitation(mockInvitation)
      } catch (error) {
        console.log(error);
        
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvitation()
  }, [token])

  const acceptInvitation = async () => {
    setIsAccepting(true)

    try {
      // Simulate accepting invitation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsAccepted(true)
    } catch (error) {
         console.log(error);
    } finally {
      setIsAccepting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (!invitation) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
          <CardDescription>This invitation link is invalid or has expired.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isAccepted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle>Welcome to {invitation.teamName}!</CardTitle>
          <CardDescription>You have successfully joined the team as a {invitation.role.toLowerCase()}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Team Invitation</CardTitle>
        <CardDescription>You've been invited to join a team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{invitation.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">{invitation.teamName}</span>
            <Badge variant={invitation.role === "ADMIN" ? "default" : "secondary"}>{invitation.role}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Invited by {invitation.inviterName}</p>
        </div>

        <Button onClick={acceptInvitation} disabled={isAccepting} className="w-full">
          {isAccepting ? "Accepting..." : "Accept Invitation"}
        </Button>
      </CardContent>
    </Card>
  )
}
