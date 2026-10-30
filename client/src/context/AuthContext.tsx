import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  citizen: {
    id: 'user-citizen',
    email: 'citizen@smartcity360.gov',
    full_name: 'Aarav Mehta',
    phone: '+1-555-019-2831',
    role: 'citizen',
    ward: 'Ward 4 - Downtown Central',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  officer: {
    id: 'user-officer',
    email: 'officer@smartcity360.gov',
    full_name: 'Inspector Kevin Roy',
    phone: '+1-555-019-4921',
    role: 'officer',
    department_id: 'dept-roads',
    department_name: 'Roads & Infrastructure',
    ward: 'Ward 4 - Downtown Central',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  admin: {
    id: 'user-admin',
    email: 'admin@smartcity360.gov',
    full_name: 'Director Sarah Jenkins',
    phone: '+1-555-019-8812',
    role: 'admin',
    ward: 'City Metropolitan Command',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('smartcity_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_USERS.citizen; // Default to Citizen for demo
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('smartcity_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smartcity_user');
    }
  }, [user]);

  const switchRole = (newRole: UserRole) => {
    setUser(DEMO_USERS[newRole]);
  };

  const login = (email: string, role: UserRole, name?: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      full_name: name || email.split('@')[0],
      role,
      ward: 'Ward 4 - Downtown Central',
      avatar_url: DEMO_USERS[role].avatar_url,
      department_id: role === 'officer' ? 'dept-roads' : undefined,
      department_name: role === 'officer' ? 'Roads & Infrastructure' : undefined
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const role = user?.role || 'citizen';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        switchRole,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
