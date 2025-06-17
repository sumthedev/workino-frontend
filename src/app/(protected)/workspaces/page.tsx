"use client"
import api from "@/api/auth"
import { WorkspaceCard } from "@/components/molecules/WorkspaceCard/WorkspaceCard"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProjectDashboard } from "@/components/organisms/ProjectDashboard/ProjectDashboard"


interface WorkspaceData {
  id: string
  name: string
  usageMode: "ALONE" | "TEAM"
  createdAt: string
  updatedAt: string
  members: Array<{
    id: string
    role: string
    accepted: boolean
    workspaceId: string
    userId: string
    invitedAt: string
  }>
  owner: {
    id: string
    fullName: string
    email: string
  }
}

function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchWorkspace = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
   
      const response = await api.get("/workspace/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const workspaceList = response.data.workspace
      if (!Array.isArray(workspaceList) || workspaceList.length === 0) {
        setError("No workspaces found")
        return
      }

      setWorkspaces(workspaceList)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching workspace:", err)
       if (err.response?.status === 404) {
        setError("No workspace found")
      } else {
        setError("Failed to load workspaces")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkspace()
  }, [])

  if (selectedWorkspace) {
    return (
      <ProjectDashboard
        workspace={selectedWorkspace}
        usageMode={selectedWorkspace.usageMode}
      />
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-4 grid gap-4">
      {workspaces.map((ws) => (
        <div key={ws.id} onClick={() => setSelectedWorkspace(ws)}>
          <WorkspaceCard workspace={ws} />
        </div>
      ))}
    </div>
  )
}

export default WorkspacePage
