import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { teamService } from '../services/teamService';
import type {
  TeamMember,
  TeamTask,
  TeamNotification,
  TeamChat,
  TeamPerformance,
} from '../types/team';

interface TeamState {
  members: TeamMember[];
  tasks: TeamTask[];
  notifications: TeamNotification[];
  chatMessages: TeamChat[];
  performance: TeamPerformance[];
  loading: boolean;
  error: string | null;
}

interface TeamContextType extends TeamState {
  // Member operations
  inviteMember: (email: string, role: string) => Promise<void>;
  updateMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  
  // Task operations
  createTask: (task: Omit<TeamTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<TeamTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Notification operations
  markNotificationAsRead: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  
  // Chat operations
  sendChatMessage: (message: string) => Promise<void>;
  loadChatMessages: () => Promise<void>;
  
  // Performance operations
  loadPerformanceData: () => Promise<void>;
  
  // Refresh operations
  refreshMembers: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Utility functions
  getMemberById: (id: string) => TeamMember | undefined;
  getTaskById: (id: string) => TeamTask | undefined;
  getUnreadNotificationsCount: () => number;
  getActiveTasks: () => TeamTask[];
}

type TeamAction =
  | { type: 'SET_MEMBERS'; payload: TeamMember[] }
  | { type: 'SET_TASKS'; payload: TeamTask[] }
  | { type: 'SET_NOTIFICATIONS'; payload: TeamNotification[] }
  | { type: 'SET_CHAT_MESSAGES'; payload: TeamChat[] }
  | { type: 'SET_PERFORMANCE'; payload: TeamPerformance[] }
  | { type: 'ADD_MEMBER'; payload: TeamMember }
  | { type: 'UPDATE_MEMBER'; payload: { id: string; updates: Partial<TeamMember> } }
  | { type: 'REMOVE_MEMBER'; payload: string }
  | { type: 'ADD_TASK'; payload: TeamTask }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<TeamTask> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: TeamNotification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<TeamNotification> } }
  | { type: 'ADD_CHAT_MESSAGE'; payload: TeamChat }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: TeamState = {
  members: [],
  tasks: [],
  notifications: [],
  chatMessages: [],
  performance: [],
  loading: false,
  error: null,
};

const teamReducer = (state: TeamState, action: TeamAction): TeamState => {
  switch (action.type) {
    case 'SET_MEMBERS':
      return { ...state, members: action.payload, loading: false };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload, loading: false };
    case 'SET_CHAT_MESSAGES':
      return { ...state, chatMessages: action.payload, loading: false };
    case 'SET_PERFORMANCE':
      return { ...state, performance: action.payload, loading: false };
    case 'ADD_MEMBER':
      return { ...state, members: [action.payload, ...state.members] };
    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map(member =>
          member.id === action.payload.id ? { ...member, ...action.payload.updates } : member
        ),
      };
    case 'REMOVE_MEMBER':
      return {
        ...state,
        members: state.members.filter(member => member.id !== action.payload),
      };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id ? { ...notification, ...action.payload.updates } : notification
        ),
      };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

interface TeamProviderProps {
  children: React.ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(teamReducer, initialState);

  // Member operations
  const refreshMembers = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const members = await teamService.getTeamMembers();
      dispatch({ type: 'SET_MEMBERS', payload: members });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch team members' });
    }
  }, []);

  const inviteMember = useCallback(async (email: string, role: string) => {
    try {
      const result = await teamService.inviteTeamMember(email, role);
      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      } else {
        // Refresh members after successful invitation
        await refreshMembers();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to invite team member' });
    }
  }, [refreshMembers]);

  const updateMember = useCallback(async (id: string, updates: Partial<TeamMember>) => {
    try {
      const result = await teamService.updateTeamMember(id, updates);
      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      } else {
        dispatch({ type: 'UPDATE_MEMBER', payload: { id, updates } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update team member' });
    }
  }, []);

  const removeMember = useCallback(async (id: string) => {
    try {
      const result = await teamService.removeTeamMember(id);
      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      } else {
        dispatch({ type: 'REMOVE_MEMBER', payload: id });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove team member' });
    }
  }, []);

  // Task operations
  const refreshTasks = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tasks = await teamService.getTeamTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch team tasks' });
    }
  }, []);

  const createTask = useCallback(async (taskData: Omit<TeamTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await teamService.createTeamTask(taskData);
      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      } else {
        // Refresh tasks after successful creation
        await refreshTasks();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create team task' });
    }
  }, [refreshTasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<TeamTask>) => {
    try {
      const result = await teamService.updateTeamTask(id, updates);
      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      } else {
        dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update team task' });
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      // Placeholder for actual implementation
      console.log('Deleting task:', id);
      // In a real implementation, you would call the API
      // const result = await teamService.deleteTeamTask(id);
      // if (result.error) {
      //   dispatch({ type: 'SET_ERROR', payload: result.error });
      // } else {
      //   dispatch({ type: 'DELETE_TASK', payload: id });
      // }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete team task' });
    }
  }, []);

  // Notification operations
  const refreshNotifications = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const notifications = await teamService.getNotifications();
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notifications' });
    }
  }, []);

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      const result = await teamService.markNotificationAsRead(id);
      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      } else {
        dispatch({ type: 'UPDATE_NOTIFICATION', payload: { id, updates: { read: true } } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark notification as read' });
    }
  }, []);

  const clearNotifications = useCallback(async () => {
    try {
      // Mark all notifications as read
      const unreadNotifications = state.notifications.filter(n => !n.read);
      await Promise.all(unreadNotifications.map(n => teamService.markNotificationAsRead(n.id)));
      
      // Update local state
      const updatedNotifications = state.notifications.map(n => ({ ...n, read: true }));
      dispatch({ type: 'SET_NOTIFICATIONS', payload: updatedNotifications });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear notifications' });
    }
  }, [state.notifications]);

  // Chat operations
  const loadChatMessages = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const messages = await teamService.getChatMessages();
      dispatch({ type: 'SET_CHAT_MESSAGES', payload: messages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load chat messages' });
    }
  }, []);

  const sendChatMessage = useCallback(async (message: string) => {
    try {
      const result = await teamService.sendChatMessage(message);
      if (result.error) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
      } else {
        // Refresh messages after successful send
        await loadChatMessages();
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send chat message' });
    }
  }, [loadChatMessages]);

  // Performance operations
  const loadPerformanceData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const performance = await teamService.getTeamPerformance();
      dispatch({ type: 'SET_PERFORMANCE', payload: performance });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load performance data' });
    }
  }, []);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await Promise.all([
        refreshMembers(),
        refreshTasks(),
        refreshNotifications(),
        loadChatMessages(),
        loadPerformanceData(),
      ]);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh all data' });
    }
  }, [refreshMembers, refreshTasks, refreshNotifications, loadChatMessages, loadPerformanceData]);

  // Utility functions
  const getMemberById = useCallback(
    (id: string) => state.members.find(member => member.id === id),
    [state.members]
  );

  const getTaskById = useCallback(
    (id: string) => state.tasks.find(task => task.id === id),
    [state.tasks]
  );

  const getUnreadNotificationsCount = useCallback(
    () => state.notifications.filter(n => !n.read).length,
    [state.notifications]
  );

  const getActiveTasks = useCallback(
    () => state.tasks.filter(task => task.status !== 'completed'),
    [state.tasks]
  );

  const value = useMemo(
    () => ({
      ...state,
      inviteMember,
      updateMember,
      removeMember,
      createTask,
      updateTask,
      deleteTask,
      markNotificationAsRead,
      clearNotifications,
      sendChatMessage,
      loadChatMessages,
      loadPerformanceData,
      refreshMembers,
      refreshTasks,
      refreshNotifications,
      refreshAll,
      getMemberById,
      getTaskById,
      getUnreadNotificationsCount,
      getActiveTasks,
    }),
    [
      state,
      inviteMember,
      updateMember,
      removeMember,
      createTask,
      updateTask,
      deleteTask,
      markNotificationAsRead,
      clearNotifications,
      sendChatMessage,
      loadChatMessages,
      loadPerformanceData,
      refreshMembers,
      refreshTasks,
      refreshNotifications,
      refreshAll,
      getMemberById,
      getTaskById,
      getUnreadNotificationsCount,
      getActiveTasks,
    ]
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export const useTeam = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};