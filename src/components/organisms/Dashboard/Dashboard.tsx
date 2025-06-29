"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { LOGIN, WORKSPACE } from "@/lib/constant/Route"
import {
  Building2,
  Users,
  Plus,
  FolderOpen,
  FileText,
  Calendar,
  User,
  RefreshCw,
  ArrowRight
} from "lucide-react"
import api from "@/api/auth"
import { toast } from "sonner"
import type { Page, Project, Team, WorkspaceData } from "@/lib/constant/type"
import { useAuth } from "@/hooks/useAuth"

function Dashboard() {
  const router = useRouter()
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [pagesLoading, setPagesLoading] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [teamsLoading, setTeamsLoading] = useState(false)
  const {isOnBoarded, user} = useAuth()

  console.log(isOnBoarded);
  console.log(user?.onboarding, "hh");
  
  

  const stripHtmlTags = (html: string) => {
    if (!html) return "No content"
    const stripped = html.replace(/<[^>]*>/g, "")
    const decoded = stripped
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")

    return decoded.trim() || "No content"
  }

  const fetchWorkspace = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      const response = await api.get("/workspace/all", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const allWorkspaces = response.data.workspace
      if (allWorkspaces && allWorkspaces.length > 0) {
        const firstWorkspace = allWorkspaces[0]
        setCurrentWorkspace(firstWorkspace)
      } else {
        setCurrentWorkspace(null)
        setError("no_workspaces")
      }
    } catch (err: any) {
      console.error("Error fetching workspace:", err)
      if (err.response?.status === 401) {
        handleLogout()
      } else if (err.response?.status === 404) {
        setError("no_workspaces")
      } else {
        setError("fetch_error")
        toast.error("Failed to load workspace")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true)
      const token = localStorage.getItem("token")
      const response = await api.get(`/project/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const projectsData = response.data?.projects || []
      setProjects(projectsData)
      if (projectsData.length > 0) {
        await fetchTeams(projectsData[0].id)
      }
    } catch {
      toast.error("Failed to load projects")
      setProjects([])
    } finally {
      setProjectsLoading(false)
    }
  }

  const fetchPages = async () => {
    try {
      setPagesLoading(true)
      const token = localStorage.getItem("token")

      const res = await api.get("/pages/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setPages(res.data)
    } catch  {
      toast.error("Error fetching pages")
    } finally {
      setPagesLoading(false)
    }
  }

  const fetchTeams = async (projectId: string) => {
    try {
      setTeamsLoading(true)
      const token = localStorage.getItem("token")
      const response = await api.get("/team/all", {
        params: { projectId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTeams(
        response.data.teams.map((team: any) => ({
          ...team,
          membersCount: team.members?.length || 1,
          tasksCount: 0,
        })),
      )
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to load teams")
      setTeams([])
    } finally {
      setTeamsLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkspace()
  }, [])

  useEffect(() => {
    if (currentWorkspace) {
      fetchProjects()
      fetchPages()
    }
  }, [currentWorkspace])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    router.push(LOGIN)
  }

  const handleWorkspaceSelect = () => {
    router.push(WORKSPACE)
  }

  const handleRetry = () => {
    fetchWorkspace()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 mb-7 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (error === "no_workspaces") {
    return (
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-6 text-center space-y-8">
            <div className="pt-8 border-t">
              <div className="relative">
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-foreground">Welcome to Your Dashboard</h1>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                  No workspaces yet. Create one to organize projects, collaborate, and manage work efficiently
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="space-y-3">
                <h3 className="font-semibold">Project Management</h3>
                <p className="text-sm text-muted-foreground">
                  Organize and track all your projects 
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  Invite team members and collaborate 
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Goal Tracking</h3>
                <p className="text-sm text-muted-foreground">Set goals and achieve your objectives</p>
              </div>
            </div>
            <div className="space-y-4">
              <Button onClick={handleWorkspaceSelect} size="lg" className="px-8 py-3 text-lg">
                Create Your First Workspace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Get started in less than a minute and unlock the full potential of your team
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">Workspaces</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">Team Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error === "fetch_error") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Building2 className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Unable to Load Dashboard</h2>
              <p className="text-muted-foreground">
                We are having trouble loading your dashboard. Please check your connection and try again.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={handleRetry} variant="outline" className="w-full bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleWorkspaceSelect} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create New Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  if (currentWorkspace) {
    return (
      <div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mb-6">Welcome back! Here is whats happening in your workspace.</p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workspace</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentWorkspace.name}</div>
                <p className="text-xs text-muted-foreground">Your current workspace</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentWorkspace.members?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Active members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Total projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pages</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pages.length}</div>
                <p className="text-xs text-muted-foreground">Total pages</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest projects</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => fetchTeams(project.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {project.usageMode.toLowerCase()}
                        </Badge>
                        <Badge variant="secondary">{project.teams?.length || 0} teams</Badge>
                      </div>
                    </div>
                  ))}
                  {projects.length > 5 && (
                    <Button variant="ghost" className="w-full">
                      View all {projects.length} projects
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">Get started by creating your first project</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          {teams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Teams</CardTitle>
                <CardDescription>Teams in your selected project</CardDescription>
              </CardHeader>
              <CardContent>
                {teamsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{team.name}</h3>
                            <p className="text-sm text-muted-foreground">{team.members?.length || 0} members</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{team.members?.length || 0} members</Badge>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Pages</CardTitle>
                <CardDescription>Your latest pages and documents</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Page
              </Button>
            </CardHeader>
            <CardContent>
              {pagesLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : pages.length > 0 ? (
                <div className="space-y-4">
                  {pages.slice(0, 5).map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{page.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {stripHtmlTags(page.content).substring(0, 100) +
                              (stripHtmlTags(page.content).length > 100 ? "..." : "")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(page.updatedAt)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <User className="h-3 w-3 mr-1" />
                          Author: {page.authorId}
                        </p>
                      </div>
                    </div>
                  ))}
                  {pages.length > 5 && (
                    <Button variant="ghost" className="w-full">
                      View all {pages.length} pages
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pages yet</h3>
                  <p className="text-muted-foreground mb-4">Start documenting by creating your first page</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Page
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <div>
            <Button onClick={handleWorkspaceSelect}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Workspace
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Dashboard
