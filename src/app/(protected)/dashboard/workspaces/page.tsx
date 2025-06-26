"use client"
import api from "@/api/auth"
import { WorkspaceCard } from "@/components/molecules/WorkspaceCard/WorkspaceCard"
import React, { useState, useEffect } from "react"
import { ProjectDashboard } from "@/components/organisms/ProjectDashboard/ProjectDashboard"
import { WorkspaceData } from "@/lib/constant/type"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();


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
        toast.error("No workspaces found")
        return
      }

      setWorkspaces(workspaceList)
      setError(null)
    } catch (err: any) {
       toast.error("Error load workspace")
      if (err.response?.status === 404) {
      toast.error("No workspaces found")
      } else {
       toast.error("Failed to load workspace")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleWorkspace = () => {
    router.push("/workspace")
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
      <div className="justify-center flex gap-4 flex-col items-center h-64">
        <div className="text-red-500">No Worksapce Found</div>
        <div>
          <Button onClick={handleWorkspace}>
            Create Workspace
          </Button>
        </div>

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
