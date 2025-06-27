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
import type { Project, WorkspaceData } from "@/lib/constant/type"
import api from "@/api/auth"
import { toast } from "sonner"

interface TeamMember {
  id: string
  email: string
  role: "MEMBER" | "ADMIN"
  status: "pending" | "sent"
}

interface Team {
  id: string
  name: string
  membersCount: number
  tasksCount: number
}

interface InviteTeamMembersProps {
  selectedWorkspaceId: string
  selectedProjectId: string
  selectedTeamId: string
  setSelectedWorkspaceId: (id: string) => void
  setSelectedProjectId: (id: string) => void
  setSelectedTeamId: (id: string) => void
  workspaces: WorkspaceData[]
  projects: Project[]
  teams: Team[]
  loading: boolean
  isLoadingTeams: boolean
  error: string | null
}

export default function InviteTeamMembers({
  selectedWorkspaceId,
  selectedProjectId,
  selectedTeamId,
  setSelectedWorkspaceId,
  setSelectedProjectId,
  setSelectedTeamId,
  workspaces,
  projects,
  teams,
  loading,
  isLoadingTeams,
  error,
}: InviteTeamMembersProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"MEMBER" | "ADMIN">("MEMBER")
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"setup" | "invite" | "complete">("setup")
  const [isAddingMember, setIsAddingMember] = useState(false)

  const addMember = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address")
      return
    }

    setIsAddingMember(true)
    try {
      const payload = {
        email: email,
        role: role,
        teamId: selectedTeamId,
      }
      const token = localStorage.getItem("token")
      const res = await api.post("/invite", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setMembers([
        ...members,
        {
          id: Math.random().toString(36).substr(2, 9),
          email,
          role,
          status: "pending",
        },
      ])
      setEmail("")
      setRole("MEMBER")
      toast.success("Member added successfully")
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to add member")
    } finally {
      setIsAddingMember(false)
    }
  }

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  const sendInvitesToTeam = async () => {
    if (!selectedTeamId) return
    setIsLoading(true)
    try {
      for (let i = 0; i < members.length; i++) {
        await new Promise((r) => setTimeout(r, 500))
        setMembers((prev) => prev.map((m) => (m.id === members[i].id ? { ...m, status: "sent" } : m)))
      }
      setStep("complete")
      toast.success("Team created successfully")
    } catch (err: any) {
      toast.error(err.response?.data?.msg)
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

  const selectedTeam = teams.find((t) => t.id === selectedTeamId)

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading workspaces...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === "complete") {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Invitations Sent Successfully!</CardTitle>
          <CardDescription>Invitations have been sent to all members for team "{selectedTeam?.name}".</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Invitations Sent:</h4>
            <div className="space-y-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span>{m.email}</span>
                  <Badge variant="secondary">{m.role}</Badge>
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
          {step === "setup" ? "Select Team & Add Members" : "Invite Team Members"}
        </CardTitle>
        <CardDescription>
          {step === "setup"
            ? "Choose a workspace, project, and team, then invite members."
            : "Add team members by email and assign their roles."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "setup" && (
          <>
            <div>
              <Label>Select Workspace</Label>
              <Select value={selectedWorkspaceId} onValueChange={setSelectedWorkspaceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId} disabled={!selectedWorkspaceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Team</Label>
              <Select
                value={selectedTeamId}
                onValueChange={setSelectedTeamId}
                disabled={!selectedProjectId || isLoadingTeams}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingTeams ? "Loading teams..." : "Select Team"} />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.membersCount} members)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="w-32">
              <Label>Role</Label>
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
              <Button onClick={addMember} size="icon" disabled={isAddingMember || !email.trim() || !selectedTeamId}>
                {isAddingMember ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
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
          {step === "setup" && members.length > 0 && selectedTeamId && (
            <Button onClick={() => setStep("invite")} className="flex-1">
              Continue
            </Button>
          )}
          {step === "invite" && (
            <>
              <Button variant="outline" onClick={() => setStep("setup")} disabled={isLoading}>
                Back
              </Button>
              <Button onClick={sendInvitesToTeam} disabled={isLoading || members.length === 0} className="flex-1">
                {isLoading ? "Sending..." : `Send ${members.length} Invite(s)`}
              </Button>
            </>
          )}
          {step === "setup" && (!selectedTeamId || members.length === 0) && (
            <Button variant="outline" onClick={() => (window.location.href = "/dashboard")} className="flex-1">
              Skip for Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
