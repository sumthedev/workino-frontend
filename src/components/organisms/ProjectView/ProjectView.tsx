"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TaskBoard } from "../TaskBoard/TaskBoard"
import { ArrowLeft, Plus, Users, User, Calendar, CheckCircle2 } from "lucide-react"
import api from "@/api/auth"

interface ProjectViewProps {
  project: any
  workspace: any
  usageMode: "ALONE" | "TEAM"
  onBack: () => void

}

interface Team {
  id: string
  name: string
  projectId: string
  createdAt: string
  tasksCount: number
  membersCount: number
}


export function ProjectView({ project, workspace, usageMode, onBack }: ProjectViewProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [newTeamName, setNewTeamName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    setIsCreating(true);


    try {
      const payload = {
        name: newTeamName,
        projectId: project.id,
      };


      const token = localStorage.getItem("token");
      const response = await api.post("/team/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const createdTeam = response.data.team;

      const teamWithCounts = {
        ...createdTeam,
        membersCount: createdTeam.members?.length || 1,
        tasksCount: 0,
      };

      setTeams((prev) => [...prev, teamWithCounts]);
      setNewTeamName("");
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Failed to create team:", error);
    } finally {
      setIsCreating(false);
    }
  };

useEffect(() => {
  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/team/all", {
        params: { projectId: project.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeams(
        response.data.teams.map((team: any) => ({
          ...team,
          membersCount: team.members?.length || 1,
          tasksCount: 0, // You can replace this if needed
        }))
      );
    } catch (error) {
      console.error("Failed to fetch team:", error);
    }
  };

  if (project?.id) {
    fetchTeam();
  }
}, [project.id]);


  if (selectedTeam) {
    return (
      <TaskBoard
        team={selectedTeam}
        project={project}
        workspace={workspace}
        usageMode={usageMode}
        onBack={() => setSelectedTeam(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {workspace.name} • {teams.length} team{teams.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={usageMode === "ALONE" ? "secondary" : "default"}>
                {usageMode === "ALONE" ? "Solo Project" : "Team Project"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{usageMode === "ALONE" ? "Workspaces" : "Teams"}</h2>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button
               disabled={!newTeamName.trim() || isCreating || teams.length >= 3}>
                <Plus className="w-4 h-4 mr-2" />
                {usageMode === "ALONE" ? "New Workspace" : "New Team"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New {usageMode === "ALONE" ? "Workspace" : "Team"}</DialogTitle>
                <DialogDescription>
                  {usageMode === "ALONE"
                    ? "Create a project to organize your tasks"
                    : "Create a team to collaborate on tasks"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">{usageMode === "ALONE" ? "Workspace" : "Team"} Name</Label>
                  <Input
                    id="team-name"
                    placeholder={usageMode === "ALONE" ? "My Tasks" : "Enter team name"}
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTeam} disabled={!newTeamName.trim() || isCreating}>
                    {isCreating ? "Creating..." : `Create ${usageMode === "ALONE" ? "Project" : "Team"}`}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {teams.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              {usageMode === "ALONE" ? (
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              ) : (
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              )}
              <h3 className="text-lg font-medium mb-2">No {usageMode === "ALONE" ? "workspaces" : "teams"} yet</h3>
              <p className="text-muted-foreground mb-4">
                {usageMode === "ALONE"
                  ? "Create your first workspace to start managing tasks"
                  : "Create your first team to start collaborating"}
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First {usageMode === "ALONE" ? "Workspace" : "Team"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTeam(team)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {team.name}
                    <div className="flex items-center space-x-2">
                      {usageMode === "TEAM" && (
                        <Badge variant="outline">
                          <Users className="w-3 h-3 mr-1" />
                          {team.membersCount}
                        </Badge>
                      )}
                      <Badge variant="secondary">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {team.tasksCount}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Click to manage tasks</span>
                    <span>→</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
