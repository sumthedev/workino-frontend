"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Home,
  Building2,
  Users,
  Settings,
  FileText,
  Calendar,
  Bell,
  Search,
  Plus,
  LogOut,
  User,
  ChevronUp,
} from "lucide-react"
import { ModeToggle } from "@/components/molecules/ModeToggle/ModeToggle"
import { LOGIN } from "@/lib/constant/Route"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Workspaces",
    url: "/dashboard/workspaces",
    icon: Building2,
  },
  {
    title: "Pages",
    url: "/pages",
    icon: FileText,
  },
  {
    title: "Team",
    url: "/team",
    icon: Users,
  },
]

const quickActions = [
  {
    title: "New Page",
    icon: Plus,
    action: "create-page",
  },
  {
    title: "Search",
    icon: Search,
    action: "search",
  },
  {
    title: "Notifications",
    icon: Bell,
    action: "notifications",
  },
]

interface DashboardSidebarProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function DashboardSidebar({ children, user }: DashboardSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    router.push(LOGIN)
  }

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-2 px-2 py-1">
                <Building2 className="h-6 w-6" />
                <span className="font-semibold text-lg">Workino</span>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/settings">
                      <Settings />
                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.avatar || `https://avatar.vercel.sh/${user?.email}`} />
                      <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">{user?.name || "User"}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="px-2 py-1">
            <ModeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1">
        <div className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
