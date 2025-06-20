"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TeamInvitation } from "../TeamInvitaion/TeamInvitation"
import { ProjectDashboard } from "../ProjectDashboard/ProjectDashboard"
import { Building2 } from "lucide-react"
import api from "@/api/auth"
import { toast } from "sonner"

interface WorkspaceSetupProps {
  usageMode: "ALONE" | "TEAM"
}

export function WorkspaceSetup({ usageMode }: WorkspaceSetupProps) {
  const [workspaceName, setWorkspaceName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [workspace, setWorkspace] = useState<any>(null)
  const [step, setStep] = useState<"create" | "invite" | "dashboard">("create")

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) return

    try {
      setIsCreating(true)
      const payload = {
        name: workspaceName,
        usageMode
      }

      const token = localStorage.getItem("token");

      const response = await api.post("/workspace/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWorkspace(response.data.workspace);
      toast.success("Workspace created sccussfully");

      setStep(usageMode === "TEAM" ? "invite" : "dashboard");

      setStep(usageMode === "TEAM" ? "invite" : "dashboard")
    } catch (err : any) {
      toast(err.response?.data?.msg || "Failed to create Workspace");

    }

  }

  if (step === "dashboard" && workspace) {
    return <ProjectDashboard workspace={workspace} usageMode={usageMode} />
  }

  if (step === "invite" && workspace && usageMode === "TEAM") {
    return (
      <TeamInvitation
        workspace={workspace}
        onComplete={() => setStep("dashboard")}
        onSkip={() => setStep("dashboard")}
      />
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Create Your Workspace</CardTitle>
            <CardDescription>
              {usageMode === "ALONE"
                ? "Set up your personal workspace to get started"
                : "Create a team workspace and invite your colleagues"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                placeholder={usageMode === "ALONE" ? "My Personal Workspace" : "Team Workspace"}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Mode:</strong> {usageMode === "ALONE" ? "Solo Work" : "Team Collaboration"}
              </p>
              {usageMode === "ALONE" && (
                <p className="text-xs text-muted-foreground mt-1">You can always upgrade to team mode later</p>
              )}
            </div>

            <Button onClick={handleCreateWorkspace} disabled={!workspaceName.trim() || isCreating} className="w-full">
              {isCreating ? "Creating..." : "Create Workspace"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
