"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  LogOut,
  Building2,
  Loader2,
  User,
  FileText,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
} from "lucide-react"
import api from "@/api/auth"
import { useAuth } from "@/hooks/useAuth"
import type { WorkspaceData } from "@/lib/constant/type"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<WorkspaceData[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchWorkspace()
    }
  }, [user])

  const handleLogout = async () => {
    try {
      setLogoutLoading(true)
      localStorage.removeItem("token")
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Error during logout")
      console.error("Logout error:", error)
    } finally {
      setLogoutLoading(false)
    }
  }

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
      } else {
        setWorkspaces([])
      }
    } catch (err: any) {
      toast.error("Error fetching workspace")
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

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      setDeleteLoading(workspaceId)
      const token = localStorage.getItem("token")

      await api.delete(`/workspace/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId))
      toast.success("Workspace deleted successfully")
    } catch (err: any) {
      console.error("Delete workspace error:", err)
      if (err.response?.status === 403) {
        toast.error("You are not authorized to delete this workspace")
      } else if (err.response?.status === 404) {
        toast.error("Workspace not found")
      } else {
        toast.error("Failed to delete workspace")
      }
    } finally {
      setDeleteLoading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Accepted
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and view statistics</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile</span>
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{user.fullName}</h3>
                <p className="text-muted-foreground flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.isVerified ? "default" : "secondary"}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                  {user.isOnboarding && <Badge variant="outline">Onboarding</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.pages?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Pages created by you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent Invitations</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.sentInvitations?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Team invitations sent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Owned Workspaces</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.workspaces?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Workspaces you own</p>
            </CardContent>
          </Card>
        </div>

        {/* Invitations Section */}
        {user?.sentInvitations && user.sentInvitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Sent Invitations</span>
              </CardTitle>
              <CardDescription>Track your team invitations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.sentInvitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-muted">{invitation.email.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-medium">{invitation.email}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Team: {invitation.team.name}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Invited {new Date(invitation.invitedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(invitation.status)}
                      {getStatusBadge(invitation.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Your Workspaces</span>
            </CardTitle>
            <CardDescription>Manage your workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : workspaces.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No workspaces found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{workspace.name}</h3>
                        {workspace.owner.id === user.id && <Badge variant="default">Owner</Badge>}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Created {new Date(workspace.createdAt).toLocaleDateString()}</span>
                        </div>
                      
                      </div>
                    </div>

                    {workspace.owner.id === user.id && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            {deleteLoading === workspace.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{workspace.name}"? This action cannot be undone and will
                              permanently delete all projects, pages, and data associated with this workspace.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteWorkspace(workspace.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Workspace
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Account Actions</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} disabled={logoutLoading} variant="destructive" className="w-full sm:w-auto">
              {logoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
