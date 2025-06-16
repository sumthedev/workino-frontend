"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserPlus, Mail, Trash2, Users } from "lucide-react"

interface TeamInvitationProps {
  workspace: any
  onComplete: () => void
  onSkip: () => void
}

interface Invitation {
  id: string
  email: string
  role: "ADMIN" | "MEMBER"
  status: "pending" | "sent"
}

export function TeamInvitation({ workspace, onComplete, onSkip }: TeamInvitationProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER")
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isSending, setIsSending] = useState(false)

  const handleAddInvitation = () => {
    if (!email.trim()) return

    const newInvitation: Invitation = {
      id: Date.now().toString(),
      email: email.trim(),
      role,
      status: "pending",
    }

    setInvitations([...invitations, newInvitation])
    setEmail("")
    setRole("MEMBER")
  }

  const handleRemoveInvitation = (id: string) => {
    setInvitations(invitations.filter((inv) => inv.id !== id))
  }

  const handleSendInvitations = async () => {
    if (invitations.length === 0) return

    setIsSending(true)

    // Simulate API calls
    setTimeout(() => {
      setInvitations(invitations.map((inv) => ({ ...inv, status: "sent" as const })))
      setIsSending(false)
    }, 2000)
  }

  const allInvitationsSent = invitations.every((inv) => inv.status === "sent")

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Invite Team Members</CardTitle>
            <CardDescription>
              Add team members to <strong>{workspace.name}</strong> workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!allInvitationsSent && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddInvitation()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(value: "ADMIN" | "MEMBER") => setRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleAddInvitation} disabled={!email.trim()} className="w-full md:w-auto">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Invitation
                </Button>
              </div>
            )}

            {invitations.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium">Pending Invitations ({invitations.length})</h3>
                  <div className="space-y-2">
                    {invitations.map((invitation) => (
                      <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{invitation.email}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant={invitation.role === "ADMIN" ? "default" : "secondary"}>
                                {invitation.role}
                              </Badge>
                              <Badge variant={invitation.status === "sent" ? "default" : "outline"}>
                                {invitation.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {invitation.status === "pending" && (
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveInvitation(invitation.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              {invitations.length > 0 && !allInvitationsSent && (
                <Button onClick={handleSendInvitations} disabled={isSending} className="flex-1">
                  {isSending
                    ? "Sending..."
                    : `Send ${invitations.length} Invitation${invitations.length > 1 ? "s" : ""}`}
                </Button>
              )}

              <Button variant="outline" onClick={onSkip} className="flex-1">
                {allInvitationsSent ? "Continue to Dashboard" : "Skip for Now"}
              </Button>

              {allInvitationsSent && (
                <Button onClick={onComplete} className="flex-1">
                  Go to Dashboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
