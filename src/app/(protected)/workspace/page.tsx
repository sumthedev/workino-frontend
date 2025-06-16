"use client"

import { WorkspaceSetup } from '@/components/organisms/WorkSpace/WorkSpace'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useState } from 'react'
import { Users, User } from "lucide-react"
type UsageMode = "ALONE" | "TEAM" | null


function page() {
  const [usageMode, setUsageMode] = useState<UsageMode>(null)
  const [step, setStep] = useState<"onboarding" | "workspace">("onboarding")

  const handleModeSelection = (mode: "ALONE" | "TEAM") => {
    setUsageMode(mode)
    setStep("workspace")
  }

  if (step === "workspace" && usageMode) {
    return <WorkspaceSetup usageMode={usageMode} />
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Workino</h1>
          <p className="text-muted-foreground">How do you plan to use workino?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={() => handleModeSelection("ALONE")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Work Alone</CardTitle>
              <CardDescription>Perfect for personal projects and individual task management</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Personal workspace</li>
                <li>• Individual task tracking</li>
                <li>• Simple project organization</li>
                <li>• No team collaboration needed</li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={() => handleModeSelection("TEAM")}
          >
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Work with Team</CardTitle>
              <CardDescription>Collaborate with team members on shared projects</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Team workspaces</li>
                <li>• Invite team members</li>
                <li>• Collaborative projects</li>
                <li>• Role-based permissions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default page
