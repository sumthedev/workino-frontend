"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Moon, 
  Sun, 
  LogOut, 
  Users, 
  Briefcase, 
  Building2,
  Loader2,
  User
} from 'lucide-react'
import api from '@/api/auth'

interface UserStats {
  workspaces: number
  projects: number
  teamMembers: number
}

interface UserProfile {
  name: string
  email: string
  avatar?: string
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [stats, setStats] = useState<UserStats>({
    workspaces: 0,
    projects: 0,
    teamMembers: 0
  })
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'User',
    email: 'user@example.com'
  })
  const router = useRouter()

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
    
    fetchUserStats()
    fetchUserProfile()
  }, [])

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      setUserProfile({
        name: response.data.user?.name || 'User',
        email: response.data.user?.email || 'user@example.com',
        avatar: response.data.user?.avatar
      })
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const fetchUserStats = async () => {
    try {
      setStatsLoading(true)
      const token = localStorage.getItem("token")

      // Fetch workspaces
      const workspaceResponse = await api.get("/workspace/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Fetch projects
      const projectResponse = await api.get("/project/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Fetch team members (assuming we can get this from teams)
      let totalTeamMembers = 0
      try {
        const teamResponse = await api.get("/team/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        totalTeamMembers = teamResponse.data.teams?.reduce((total: number, team: any) => {
          return total + (team.members?.length || 0)
        }, 0) || 0
      } catch (teamError) {
        // Teams might require project ID, so we'll handle this gracefully
        console.log('Could not fetch team data')
      }

      setStats({
        workspaces: workspaceResponse.data.workspace?.length || 0,
        projects: projectResponse.data.projects?.length || 0,
        teamMembers: totalTeamMembers
      })

    } catch (error: any) {
      toast.error("Failed to load statistics")
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLogoutLoading(true)
      
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Optional: Call logout API endpoint if available
      try {
        const token = localStorage.getItem("token")
        await api.post("/auth/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (logoutError) {
        // Logout API call failed, but we'll still proceed with local logout
        console.log('Logout API call failed, proceeding with local logout')
      }

      toast.success("Logged out successfully")
      router.push('/login')
      
    } catch (error) {
      toast.error("Error during logout")
      console.error('Logout error:', error)
    } finally {
      setLogoutLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and view statistics</p>
          </div>
        </div>

        {/* User Profile Card */}
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
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt="Avatar" 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                <p className="text-muted-foreground">{userProfile.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.workspaces
                )}
              </div>
              <p className="text-xs text-muted-foreground">Total workspaces</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.projects
                )}
              </div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.teamMembers
                )}
              </div>
              <p className="text-xs text-muted-foreground">Total team members</p>
            </CardContent>
          </Card>
        </div>

        {/* Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your application experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
                <div>
                  <Label htmlFor="dark-mode" className="text-sm font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>

            <Separator />

            {/* Theme Status */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Current Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Your current theme preference
                </p>
              </div>
              <Badge variant={darkMode ? "default" : "secondary"}>
                {darkMode ? "Dark" : "Light"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Account Actions</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogout}
              disabled={logoutLoading}
              variant="destructive"
              className="w-full sm:w-auto"
            >
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