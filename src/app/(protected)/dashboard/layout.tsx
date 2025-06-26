"use client"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/organisms/DashboardSidebar/DashboardSidebar"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/molecules/ModeToggle/ModeToggle"
import { useAuth } from "@/hooks/useAuth"

interface DashboardLayoutProps {
  children: React.ReactNode;
}


function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()

  return (
    <SidebarProvider>
      <DashboardSidebar/>
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

export default DashboardLayout