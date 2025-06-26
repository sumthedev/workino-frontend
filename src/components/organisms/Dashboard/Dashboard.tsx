"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LOGIN, WORKSPACE } from "@/lib/constant/Route"
import { Building2, Users, Activity, Plus } from "lucide-react"
import api from "@/api/auth"
import { toast } from "sonner"
import { WorkspaceData } from "@/lib/constant/type"
import DashboardLayout from "@/app/(protected)/dashboard/layout"

function Dashboard() {
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const fetchWorkspace = async () => {
    try {
      setLoading(true)
    
      const token = localStorage.getItem("token")
      const response = await api.get("/workspace/all", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const allWorkspaces = response.data.workspace
      if (allWorkspaces && allWorkspaces.length > 0) {
        setWorkspaces(allWorkspaces)
        const firstWorkspace = allWorkspaces[0]
        setCurrentWorkspace(firstWorkspace)
        
        setUser(firstWorkspace.owner)
      } else {
        setWorkspaces([])
        setCurrentWorkspace(null)
        toast.error("No workspace found")
      }
      
      setError(null)
    } catch (err: any) {
      toast.error("Error fetching workspace:", err)
      if (err.response?.status === 401) {
        handleLogout()
      } else if (err.response?.status === 404) {
        toast.error("No workspace found")
      } else {
        toast.error("Failed to load workspace")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkspace()
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    router.push(LOGIN)
  }

  const handleWorkspaceSelect = () => {
    router.push(WORKSPACE)
  }

  if (loading) {
    return (
      <div>
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mb-6">Welcome back! Here's what's happening in your workspace.</p>
      </div>

      {error ? (
      <div>no workspace</div>
      ) : currentWorkspace ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <CardTitle className="text-sm font-medium">Usage Mode</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{currentWorkspace.usageMode}</div>
                <p className="text-xs text-muted-foreground">Current plan</p>
              </CardContent>
            </Card>
          </div>

          {/* Team Members List */}
          {currentWorkspace.members && currentWorkspace.members.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People in your workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentWorkspace.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">sumo</p>
                          <p className="text-sm text-muted-foreground">sumo</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize">{member.role}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.accepted ? "Active" : "Pending"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Workspaces */}
          {workspaces.length > 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">All Workspaces</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workspaces.map((workspace) => (
                  <Card key={workspace.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{workspace.name}</CardTitle>
                      <CardDescription>
                        Owner: {workspace.owner.fullName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Members: {workspace.members?.length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Mode: {workspace.usageMode}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(workspace.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <Button onClick={handleWorkspaceSelect}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Workspace
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Dashboard