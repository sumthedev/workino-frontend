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
