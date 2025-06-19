export interface Onboarding {
  id: string;
  usageType: 'PERSONAL' | 'PROFESSIONAL' | 'OTHER';
  usageMode: 'ALONE' | 'TEAM';
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  agreeTerms: boolean;
  isOnboarding: boolean;
  onboarding?: Onboarding;
}

export interface ProjectDashboardProps {
  workspace: any
  usageMode: "ALONE" | "TEAM"
}

export interface Project {
  id: string
  name: string
  workspaceId: string
  createdAt?: string
  teamsCount?: number
  tasksCount?: number
}

export interface WorkspaceData {
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