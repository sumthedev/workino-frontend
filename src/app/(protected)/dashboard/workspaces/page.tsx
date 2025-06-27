"use client"
import api from "@/api/auth"
import { WorkspaceCard } from "@/components/molecules/WorkspaceCard/WorkspaceCard"
import { useState, useEffect } from "react"
import { ProjectDashboard } from "@/components/organisms/ProjectDashboard/ProjectDashboard"
import type { WorkspaceData } from "@/lib/constant/type"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Building2, Plus, Users, Briefcase, ArrowRight, Loader2, RefreshCw } from "lucide-react"

function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchWorkspace = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("token")

      const response = await api.get("/workspace/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const workspaceList = response.data.workspace
      if (!Array.isArray(workspaceList) || workspaceList.length === 0) {
        setWorkspaces([])
        setError("no_workspaces")
        return
      }

      setWorkspaces(workspaceList)
      setError(null)
    } catch (err: any) {
      console.error("Workspace fetch error:", err)
      if (err.response?.status === 404) {
        setError("no_workspaces")
      } else if (err.response?.status === 401) {
        setError("unauthorized")
        toast.error("Session expired. Please login again.")
        router.push("/login")
      } else {
        setError("fetch_error")
        toast.error("Failed to load workspaces")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkspace = () => {
    router.push("/workspace")
  }

  const handleRetry = () => {
    fetchWorkspace()
  }

  useEffect(() => {
    fetchWorkspace()
  }, [])

  if (selectedWorkspace) {
    return <ProjectDashboard workspace={selectedWorkspace} usageMode={selectedWorkspace.usageMode} />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your workspaces...</p>
        </div>
      </div>
    )
  }

  if (error === "no_workspaces") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-12 text-center space-y-8">
            {/* Icon and Illustration */}
            <div className="relative">
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">Welcome to Your Workspace Hub</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                You don't have any workspaces yet. Create your first workspace to start collaborating with your team and
                organizing your projects.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-sm text-muted-foreground">Invite team members and work together seamlessly</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Project Management</h3>
                <p className="text-sm text-muted-foreground">Organize and manage all your projects in one place</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Workspace Organization</h3>
                <p className="text-sm text-muted-foreground">Keep your work organized with dedicated workspaces</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <Button onClick={handleCreateWorkspace} size="lg" className="px-8 py-3 text-lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Workspace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground">Get started in less than a minute</p>
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
              <h2 className="text-xl font-semibold text-foreground">Unable to Load Workspaces</h2>
              <p className="text-muted-foreground">
                We're having trouble loading your workspaces. Please check your connection and try again.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={handleRetry} variant="outline" className="w-full bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleCreateWorkspace} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create New Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Your Workspaces</h1>
        <p className="text-muted-foreground">Select a workspace to view and manage your projects</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((ws) => (
          <div key={ws.id} onClick={() => setSelectedWorkspace(ws)} className="cursor-pointer">
            <WorkspaceCard workspace={ws} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkspacePage
