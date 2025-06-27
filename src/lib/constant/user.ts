export interface Onboarding {
  id: string;
  usageType: string;
  usageMode: string;
}

export interface WorkspaceBase {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count: {
    members: number;
    projects: number;
  };
}

export interface OwnedWorkspace extends WorkspaceBase {}

export interface MemberWorkspace {
  id: string;
  role: string;
  joinedAt: string;
  workspace: WorkspaceBase;
}

export interface Page {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    workspace: {
      id: string;
      name: string;
    };
  };
}

export interface Invitation {
  id: string;
  email: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
  workspace: {
    id: string;
    name: string;
  };
}

export interface UserStats {
  totalWorkspaces: number;
  ownedWorkspaces: number;
  memberWorkspaces: number;
  totalPages: number;
  totalInvitationsSent: number;
  pendingInvitations: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  agreeTerms: boolean;
  isOnboarding: boolean;
  onboarding?: Onboarding;
  ownedWorkspaces: OwnedWorkspace[];
  workspaces: MemberWorkspace[];
  pages: Page[];
  sentInvitations: Invitation[];
  stats: UserStats;
}