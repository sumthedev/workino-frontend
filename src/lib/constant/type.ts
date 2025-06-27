export interface Onboarding {
  id: string;
  usageType: 'PERSONAL' | 'PROFESSIONAL' | 'OTHER';
  usageMode: 'ALONE' | 'TEAM';
}

export interface Invitation {
  id: string
  email: string
  role?: "ADMIN" | "MEMBER"
  status: "ACCEPTED" | "PENDING" | "REJECTED" | "SENT"
  invitedAt: string | number | Date
  expiresAt?: string | number | Date
  token?: string
  team: {
    id: string
    name: string
  }
}
export interface User {
  id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  agreeTerms: boolean;
  isOnboarding: boolean;
  onboarding?: Onboarding;
  workspaces: WorkspaceData[];
  pages: Page[];
  sentInvitations: Invitation[];
  
}

export interface ProjectDashboardProps {
  workspace: any
  usageMode: "ALONE" | "TEAM"
}

export interface Project {
  teams: any;
  usageMode: any;
  id: string
  name: string
  workspaceId: string
  createdAt?: string
  teamsCount?: number
  tasksCount?: number
}

export interface WorkspaceData {
  _count: any;
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

export interface Team {
  members: any;
  id: string
  name: string
  projectId: string
  createdAt: string
  tasksCount: number
  membersCount: number
}


export interface Page {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
}