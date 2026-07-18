// Dashboard Types
export interface DashboardData {
  project: any;
  analytics: any;
  members: any[];
  owner: any;
  joinRequests: any[];
  activities: any[];
  chat: {
    messages: any[];
    isLoading: boolean;
  };
}

export interface DashboardStats {
  totalMembers: number;
  totalTasks: number;
  pendingRequests: number;
  completionRate: number;
}

export interface Member {
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    skills?: string[];
  };
  tasksCompleted?: number;
}

export interface JoinRequest {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  message: string | null;
  skills: string[];
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  reviewedBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface Activity {
  id: string;
  action: string;
  details: any;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
}

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  parentId: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  parent?: ChatMessage | null;
}
