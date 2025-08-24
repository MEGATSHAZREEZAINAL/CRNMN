import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import type { AppNotification } from '../types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

interface NotificationContextType extends NotificationState {
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  clearRead: () => void;
  getNotificationsByType: (type: AppNotification['type']) => AppNotification[];
  getUnreadNotifications: () => AppNotification[];
  markAllAsRead: () => void;
  refreshNotifications: () => void;
  removeOldNotifications: (daysOld?: number) => void;
}

type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: AppNotification[] }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DISMISS'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEAR_READ' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'REMOVE_OLD'; payload: number };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      const unreadCount = action.payload.filter(n => !n.read).length;
      return { ...state, notifications: action.payload, unreadCount, loading: false };
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications].slice(0, 100); // Keep last 100
      return { 
        ...state, 
        notifications: newNotifications,
        unreadCount: state.unreadCount + 1
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0
      };
    case 'DISMISS':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        unreadCount: state.notifications.find(n => n.id === action.payload)?.read ? state.unreadCount : Math.max(0, state.unreadCount - 1)
      };
    case 'CLEAR_ALL':
      return { ...state, notifications: [], unreadCount: 0 };
    case 'CLEAR_READ':
      return {
        ...state,
        notifications: state.notifications.filter(notification => !notification.read),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'REMOVE_OLD':
      const cutoffDate = Date.now() - (action.payload * 24 * 60 * 60 * 1000);
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.timestamp > cutoffDate),
      };
    default:
      return state;
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load notifications from localStorage on init
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('appNotifications');
      if (savedNotifications) {
        const notifications = JSON.parse(savedNotifications);
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('appNotifications', JSON.stringify(state.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }, [state.notifications]);

  const addNotification = useCallback((notificationData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const notification: AppNotification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'DISMISS', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const clearRead = useCallback(() => {
    dispatch({ type: 'CLEAR_READ' });
  }, []);

  const getNotificationsByType = useCallback(
    (type: AppNotification['type']): AppNotification[] => {
      return state.notifications.filter(notification => notification.type === type);
    },
    [state.notifications]
  );

  const getUnreadNotifications = useCallback((): AppNotification[] => {
    return state.notifications.filter(notification => !notification.read);
  }, [state.notifications]);

  const refreshNotifications = useCallback(() => {
    // In a real implementation, this would fetch notifications from a service
    // For now, we'll just re-save the current notifications to localStorage
    try {
      localStorage.setItem('appNotifications', JSON.stringify(state.notifications));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh notifications' });
    }
  }, [state.notifications]);

  const removeOldNotifications = useCallback((daysOld: number = 7) => {
    dispatch({ type: 'REMOVE_OLD', payload: daysOld });
  }, []);

  // Periodically remove old notifications (older than 7 days)
  useEffect(() => {
    const interval = setInterval(() => {
      removeOldNotifications(7);
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [removeOldNotifications]);

  const value = useMemo(
    () => ({
      ...state,
      addNotification,
      markAsRead,
      dismiss,
      clearAll,
      clearRead,
      getNotificationsByType,
      getUnreadNotifications,
      markAllAsRead,
      refreshNotifications,
      removeOldNotifications,
    }),
    [
      state,
      addNotification,
      markAsRead,
      dismiss,
      clearAll,
      clearRead,
      getNotificationsByType,
      getUnreadNotifications,
      markAllAsRead,
      refreshNotifications,
      removeOldNotifications,
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Custom hook for toasts
export const useToast = () => {
  const { addNotification } = useNotifications();
  
  const showToast = useCallback((message: string, type: AppNotification['type'] = 'info', title?: string) => {
    addNotification({
      type,
      title: title || type.charAt(0).toUpperCase() + type.slice(1),
      message,
    });
  }, [addNotification]);

  return { showToast };
};