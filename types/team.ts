import { UserRole } from '../contexts/AuthContext';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  joinedAt: string;
  lastActive?: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface TeamTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string[];
  assignedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  attachments?: string[];
}

export interface TeamNotification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'team_invitation' | 'mention' | 'deadline_reminder';
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  relatedId?: string; // task id, project id, etc.
  read: boolean;
  createdAt: string;
}

export interface TeamChat {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  replyTo?: string;
  createdAt: string;
  edited?: boolean;
  editedAt?: string;
}

export interface TeamPerformance {
  memberId: string;
  tasksCompleted: number;
  tasksAssigned: number;
  avgCompletionTime: number; // in hours
  onTimeCompletion: number; // percentage
  collaborationScore: number; // based on interactions
  period: 'week' | 'month' | 'quarter';
  periodStart: string;
  periodEnd: string;
}
