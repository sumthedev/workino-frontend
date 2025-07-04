"use client"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { ProjectView } from "../ProjectView/ProjectView"
import { Plus, FolderPlus, Users, User, Settings, Loader2 } from "lucide-react"
import api from "@/api/auth"
import { toast } from "sonner"

interface ProjectDashboardProps {
  workspace: any
  usageMode: "ALONE" | "TEAM"
}

interface Project {
  id: string
  name: string
  workspaceId: string
  createdAt?: string
  teamsCount?: number
  tasksCount?: number
}

export function ProjectDashboard({ workspace, usageMode }: ProjectDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newProjectName, setNewProjectName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await api.get(`/project/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const projectsData = response.data?.projects || [];
      const filteredProjects = projectsData.filter((project: any) => project.usageMode === usageMode);
      setProjects(filteredProjects);

    } catch {
      toast.error("Failed to load projects")
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (workspace?.id) {
      fetchProjects();
    }
  }, [workspace?.id])

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Please enter a project name")
      return
    }

    if (projects.length >= 1) {
      toast.error("You can only create one project per workspace")
      return
    }

    setIsCreating(true)
    try {
      const payload = {
        name: newProjectName,
        workspaceId: workspace.id,
        usageMode: usageMode
      }

      const token = localStorage.getItem("token")
        await api.post("/project/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      await fetchProjects()

      setNewProjectName("")
      setShowCreateDialog(false)
      toast.success("Project created successfully")
    } catch (err: any) {
      const errorMessage = err.response?.data?.msg || "Failed to create project"
      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  if (selectedProject) {
    return (
      <ProjectView
        project={selectedProject}
        workspace={workspace}
        usageMode={usageMode}
        onBack={() => setSelectedProject(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{workspace?.name || "Workspace"}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={usageMode === "ALONE" ? "secondary" : "default"}>
                  {usageMode === "ALONE" ? (
                    <>
                      <User className="w-3 h-3 mr-1" />
                      Solo Workspace
                    </>
                  ) : (
                    <>
                      <Users className="w-3 h-3 mr-1" />
                      Team Workspace
                    </>
                  )}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {projects.length} project{projects.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Projects</h2>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button disabled={projects.length >= 1 || isLoading}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
                {projects.length >= 1 && (
                  <span className="ml-2 text-xs">(Limit: 1)</span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to organize your {usageMode === "ALONE" ? "tasks" : "team's work"}.
                  {projects.length >= 1 && (
                    <span className="block mt-2 text-orange-600">
                      Note: You can only have one project per workspace.
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim() || isCreating || projects.length >= 1}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <Card className="text-center py-12">
            <CardContent>
              <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium mb-2">Loading projects...</h3>
              <p className="text-muted-foreground">
                Please wait while we fetch your projects.
              </p>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to start organizing your {usageMode === "ALONE" ? "tasks" : "team's work"}.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedProject(project)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Click to open</span>
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