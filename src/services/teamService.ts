import { api } from './api';
import type {
  TeamMember,
  TeamInvitation,
  TeamTask,
  TeamNotification,
  TeamChat,
  TeamPerformance,
} from '../types/team';

class TeamService {
  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return api.getTeamMembers();
  }

  async inviteTeamMember(email: string, role: string): Promise<{ error?: string }> {
    return api.inviteTeamMember(email, role);
  }

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<{ error?: string }> {
    return api.updateTeamMember(id, updates);
  }

  async removeTeamMember(id: string): Promise<{ error?: string }> {
    return api.removeTeamMember(id);
  }

  // Team Tasks
  async getTeamTasks(): Promise<TeamTask[]> {
    return api.getTeamTasks();
  }

  async createTeamTask(
    task: Omit<TeamTask, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<{ error?: string }> {
    return api.createTeamTask(task);
  }

  async updateTeamTask(id: string, updates: Partial<TeamTask>): Promise<{ error?: string }> {
    return api.updateTeamTask(id, updates);
  }

  // Notifications
  async getNotifications(): Promise<TeamNotification[]> {
    return api.getNotifications();
  }

  async markNotificationAsRead(id: string): Promise<{ error?: string }> {
    return api.markNotificationAsRead(id);
  }

  // Team Chat
  async getChatMessages(): Promise<TeamChat[]> {
    return api.getChatMessages();
  }

  async sendChatMessage(message: string): Promise<{ error?: string }> {
    return api.sendChatMessage(message);
  }

  // Performance Analytics
  async getTeamPerformance(): Promise<TeamPerformance[]> {
    return api.getTeamPerformance();
  }
}

export const teamService = new TeamService();
