"use client"
import { useState, useEffect } from "react"
import InviteTeamMembers from "@/components/organisms/AcceptInvitation/InviteTeam/InviteTeam"
import api from "@/api/auth"
import { Project, WorkspaceData } from "@/lib/constant/type"

interface Team {
  id: string
  name: string
  membersCount: number
  tasksCount: number
}

export default function Page() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [teams, setTeams] = useState<Team[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingTeams, setIsLoadingTeams] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkspaces = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await api.get("/workspace/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setWorkspaces(response.data.workspace || [])
    } catch (err: any) {
      console.error("Error fetching workspace:", err)
      setError("Failed to load workspaces")
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async (workspaceId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get("/project/all", {
        params: { workspaceId },
        headers: { Authorization: `Bearer ${token}` },
      })
      setProjects(response.data.projects || [])
    } catch (err) {
      console.error("Error loading projects:", err)
    }
  }

  const fetchTeams = async (projectId: string) => {
    try {
      setIsLoadingTeams(true)
      const token = localStorage.getItem("token")
      const response = await api.get("/team/all", {
        params: { projectId },
        headers: { Authorization: `Bearer ${token}` },
      })

      const teamsList = response.data.teams.map((team: any) => ({
        ...team,
        membersCount: team.members?.length || 1,
        tasksCount: 0,
      }))

      setTeams(teamsList)
    } catch (error) {
      console.error("Failed to fetch team:", error)
    } finally {
      setIsLoadingTeams(false)
    }
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  useEffect(() => {
    if (selectedWorkspaceId) {
      fetchProjects(selectedWorkspaceId)
      setSelectedProjectId("")
      setSelectedTeamId("")
      setProjects([])
      setTeams([])
    }
  }, [selectedWorkspaceId])

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeams(selectedProjectId)
      setSelectedTeamId("")
    }
  }, [selectedProjectId])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Build Your Team</h1>
          <p className="text-muted-foreground">
            Collaborate better by inviting your team members to join your workspace
          </p>
        </div>
        <InviteTeamMembers
          selectedWorkspaceId={selectedWorkspaceId}
          selectedProjectId={selectedProjectId}
          selectedTeamId={selectedTeamId}
          setSelectedWorkspaceId={setSelectedWorkspaceId}
          setSelectedProjectId={setSelectedProjectId}
          setSelectedTeamId={setSelectedTeamId}
          workspaces={workspaces}
          projects={projects}
          teams={teams}
          loading={loading}
          isLoadingTeams={isLoadingTeams}
          error={error}
        />
      </div>
    </div>
  )
}