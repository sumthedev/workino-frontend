"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Mail, Users, Plus, Check } from "lucide-react"


interface TeamMember {
  id: string
  email: string
  role: "MEMBER" | "ADMIN"
  status: "pending" | "sent"
}

export default function InviteTeamMembers() {
  const [teamName, setTeamName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"MEMBER" | "ADMIN">("MEMBER")
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"setup" | "invite" | "complete">("setup")


  const addMember = () => {
    if (!email) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      
      return
    }

    if (members.some((member) => member.email === email)) {
    
      return
    }

    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role,
      status: "pending",
    }

    setMembers([...members, newMember])
    setEmail("")
    setRole("MEMBER")
  }

  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id))
  }

  const createTeamAndSendInvites = async () => {
    if (!teamName.trim()) {
    
      return
    }

    setIsLoading(true)

    try {
      // Simulate team creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate sending invitations
      for (let i = 0; i < members.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setMembers((prev) =>
          prev.map((member) => (member.id === members[i].id ? { ...member, status: "sent" } : member)),
        )
      }

      

      setStep("complete")
    } catch (error) {
     
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addMember()
    }
  }

  if (step === "complete") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Team Created Successfully!</CardTitle>
          <CardDescription>
            Your team "{teamName}" has been created and invitations have been sent to all members.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Invitations Sent:</h4>
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between text-sm">
                  <span>{member.email}</span>
                  <Badge variant="secondary">{member.role}</Badge>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {step === "setup" ? "Create Your Team" : "Invite Team Members"}
        </CardTitle>
        <CardDescription>
          {step === "setup"
            ? "Set up your team and invite members to collaborate"
            : "Add team members by email and assign their roles"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "setup" && (
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              placeholder="Enter your team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="w-32">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: "MEMBER" | "ADMIN") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addMember} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {members.length > 0 && (
            <div className="space-y-2">
              <Label>Team Members ({members.length})</Label>
              <div className="border rounded-lg divide-y">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        {member.status === "sent" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{member.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.status === "sent" ? "Invitation sent" : "Pending invitation"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>{member.role}</Badge>
                      {member.status === "pending" && (
                        <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          {step === "setup" && members.length > 0 && (
            <Button onClick={() => setStep("invite")} className="flex-1">
              Continue
            </Button>
          )}
          {step === "invite" && (
            <>
              <Button variant="outline" onClick={() => setStep("setup")} disabled={isLoading}>
                Back
              </Button>
              <Button
                onClick={createTeamAndSendInvites}
                disabled={isLoading || members.length === 0}
                className="flex-1"
              >
                {isLoading ? "Creating Team..." : `Create Team & Send ${members.length} Invites`}
              </Button>
            </>
          )}
          {step === "setup" && members.length === 0 && (
            <Button onClick={() => (window.location.href = "/dashboard")} variant="outline" className="flex-1">
              Skip for Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
