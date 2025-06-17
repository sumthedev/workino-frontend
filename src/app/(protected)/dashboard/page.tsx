"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LOGIN, WORKSPACE } from "@/lib/constant/Route"
import { Building2, Users, Activity, Plus } from "lucide-react"
import { DashboardSidebar } from "@/components/organisms/DashboardSidebar/DashboardSidebar"
import { WorkspaceCard } from "@/components/molecules/WorkspaceCard/WorkspaceCard"
import api from "@/api/auth"


interface WorkspaceData {
  id: string
  name: string
  usageMode: string
  createdAt: string
  updatedAt: string
  members: Array<{
    id: string
    role: string
    accepted: boolean
    user: {
      id: string
      name: string
      email: string
    }
  }>
  owner: {
    id: string
    name: string
    email: string
  }
}

function DashboardPage() {
  const router = useRouter()
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const fetchWorkspace = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        router.push(LOGIN)
        return
      }

      const response = await api.get("/workspace/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setWorkspace(response.data.workspace)
      const currentUser = response.data.workspace.owner
      console.log(response.data.workspace);
      
      setUser(currentUser)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching workspace:", err)
      if (err.response?.status === 401) {
        handleLogout()
      } else if (err.response?.status === 404) {
        setError("No workspace found")
      } else {
        setError("Failed to load workspace")
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
      <DashboardSidebar user={user}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </DashboardSidebar>
    )
  }

  return (
    <DashboardSidebar user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening in your workspace.</p>
        </div>

        {error ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">No Workspace Found</CardTitle>
              <CardDescription className="text-center">You don't have access to any workspace yet.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={handleWorkspaceSelect} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
            </CardContent>
          </Card>
        ) : workspace ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Workspace</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workspace.name}</div>
                  <p className="text-xs text-muted-foreground">Your current workspace</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workspace.members.length}</div>
                  <p className="text-xs text-muted-foreground">Active members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usage Mode</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{workspace.usageMode}</div>
                  <p className="text-xs text-muted-foreground">Current plan</p>
                </CardContent>
              </Card>
            </div>
            <div>

              <Button onClick={handleWorkspaceSelect }>Create WorkSpace</Button>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardSidebar>
  )
}

export default DashboardPage
