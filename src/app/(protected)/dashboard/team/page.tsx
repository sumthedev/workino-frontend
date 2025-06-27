"use client"
import api from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Project, Team, WorkspaceData } from '@/lib/constant/type'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function TeamManagementPage() {
    const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([])
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [teamsLoading, setTeamsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [teams, setTeams] = useState<Team[]>([])
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
                toast.error("No workspaces found")
                return
            }

            setWorkspaces(workspaceList)
            setError(null)
        } catch (err: any) {
            toast.error("Error loading workspace")
            if (err.response?.status === 404) {
                toast.error("No workspaces found")
            } else {
                toast.error("Failed to load workspace")
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await api.get(`/project/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const projectsData = response.data?.projects || []
            setProjects(projectsData)
        } catch (error) {
            toast.error("Failed to load projects")
            setProjects([])
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
                }))
            )
        } catch (err: any) {
            toast.error(err.response?.data?.msg || "Failed to load teams")
            setTeams([])
        } finally {
            setTeamsLoading(false)
        }
    }

    const handleProjectSelect = (project: Project) => {
        setSelectedProject(project)
        fetchTeams(project.id)
    }

    const handleInviteRedirect = () => {
        router.push('/invite')
    }

    useEffect(() => {
        fetchWorkspace()
        fetchProjects()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Team Management</h1>
                    <p className="">Manage your teams and invite new members</p>
                </div>

                {/* Project Selection */}
                <div className=" rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Select Project</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => handleProjectSelect(project)}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    selectedProject?.id === project.id
                                        ? 'border-gray-200 '
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <h3 className="font-medium">{project.name}</h3>
  
                            </div>
                        ))}
                    </div>
                </div>

                {/* Teams Section */}
                {selectedProject && (
                    <div className=" rounded-lg shadow-md p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                Teams for {selectedProject.name}
                            </h2>
                            {teamsLoading && (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            )}
                        </div>

                        {teams.length === 0 && !teamsLoading ? (
                            <div className="text-center py-12">
                                <div className=" mb-4">
                                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.12l-.045.03A5 5 0 0110 20h7zM9 9a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium mb-2">No teams found</h3>
                                <p className="">Get started by inviting team members to this project.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teams.map((team) => (
                                    <div key={team.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium">{team.name}</h3>
      
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-sm ">
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                                <span>{team.membersCount} members</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <span>{team.tasksCount} tasks</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="fixed bottom-6 right-6">
                    <Button
                        onClick={handleInviteRedirect}
                       >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Invite Team Members</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TeamManagementPage