import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import type { User } from 'firebase/auth';

// User roles for RBAC
export enum UserRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  CREW = 'crew',
}

// Permissions mapping
export enum Permission {
  VIEW_SALES = 'view_sales',
  CREATE_SALES = 'create_sales',
  DELETE_SALES = 'delete_sales',
  VIEW_INVENTORY = 'view_inventory',
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_CUSTOMERS = 'view_customers',
  MANAGE_CUSTOMERS = 'manage_customers',
  VIEW_FINANCIALS = 'view_financials',
  MANAGE_FINANCIALS = 'manage_financials',
  VIEW_PROJECTS = 'view_projects',
  MANAGE_PROJECTS = 'manage_projects',
  USE_AI = 'use_ai',
  VIEW_AI_INSIGHTS = 'view_ai_insights',
  MANAGE_USERS = 'manage_users',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_ANALYTICS = 'view_analytics',
}

// Role permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.OWNER]: Object.values(Permission),
  [UserRole.MANAGER]: [
    Permission.VIEW_SALES,
    Permission.CREATE_SALES,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_FINANCIALS,
    Permission.VIEW_PROJECTS,
    Permission.MANAGE_PROJECTS,
    Permission.USE_AI,
    Permission.VIEW_AI_INSIGHTS,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.CREW]: [
    Permission.VIEW_SALES,
    Permission.CREATE_SALES,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_CUSTOMERS,
    Permission.MANAGE_CUSTOMERS,
    Permission.VIEW_PROJECTS,
    Permission.USE_AI,
  ],
};

interface AuthUser extends User {
  role: UserRole;
  businessId?: string;
  businessName?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    businessName: string,
    role?: UserRole,
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  isManager: boolean;
  isCrew: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setState({
            user: {
              ...user,
              role: userData.role || UserRole.OWNER,
              businessId: userData.businessId,
              businessName: userData.businessName,
            } as AuthUser,
            loading: false,
            error: null,
          });
        } else {
          // Handle case where user exists in Auth but not Firestore
           setState({ user: { ...user, role: UserRole.OWNER } as AuthUser, loading: false, error: "User data not found in database." });
        }
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAuthAction = async (action: () => Promise<any>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await action();
      return {};
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred.';
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  const signIn = (email: string, password: string) => {
    return handleAuthAction(() => signInWithEmailAndPassword(auth, email, password));
  };

  const signUp = (
    email: string,
    password: string,
    businessName: string,
    role: UserRole = UserRole.OWNER,
  ) => {
    return handleAuthAction(async () => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const businessId = `biz_${user.uid.slice(0, 8)}`;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        role,
        businessName,
        businessId,
        createdAt: new Date().toISOString(),
      });
       // Also create a business settings record
      await setDoc(doc(db, 'business_settings', businessId), {
        business_name: businessName,
        monthly_goal: 10000,
        currency: 'RM',
        owner_uid: user.uid,
      });
    });
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const resetPassword = (email: string) => {
    return handleAuthAction(() => sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
    }));
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!state.user) return false;
    const rolePermissions = ROLE_PERMISSIONS[state.user.role] || [];
    return rolePermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(hasPermission);
  };

  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  const contextValue: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    hasPermission,
    hasAnyPermission,
    hasRole,
    isAuthenticated: !!state.user,
    isOwner: hasRole(UserRole.OWNER),
    isManager: hasRole(UserRole.MANAGER),
    isCrew: hasRole(UserRole.CREW),
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallback = <div className="text-center text-dark-300 font-mono">Access denied</div>,
}) => {
  const { user, loading, hasPermission, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-brand-electric border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return fallback;
  }

  if (requiredRoles.length > 0 && !requiredRoles.some(hasRole)) {
    return fallback;
  }

  if (requiredPermissions.length > 0 && !requiredPermissions.every(hasPermission)) {
    return fallback;
  }

  return <>{children}</>;
};
