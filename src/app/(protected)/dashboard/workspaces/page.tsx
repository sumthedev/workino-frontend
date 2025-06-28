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
import { Building2, Plus, ArrowRight, Loader2, RefreshCw } from "lucide-react"

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
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-12 text-center space-y-8">
            <div className="relative">
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-foreground">Welcome to Your Workspace Hub</h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
              No workspaces yet. Create one to start collaborating and organizing projects.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="space-y-2">
                <h3 className="font-semibold">Team Collaboration</h3>
                <p className="text-sm text-muted-foreground">Invite team members and work together</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Project Management</h3>
                <p className="text-sm text-muted-foreground">Manage all your projects in one place</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Workspace Setup</h3>
                <p className="text-sm text-muted-foreground">Keep your work organized with workspaces</p>
              </div>
            </div>
            <div className="space-y-4">
              <Button onClick={handleCreateWorkspace} className="px-8 py-3 text-md">         
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
                We are having trouble loading your workspaces. Please check your connection and try again.
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
