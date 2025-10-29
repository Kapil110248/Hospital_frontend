import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, { password: string; role: UserRole; name: string }> = {
  'admin@hospital.com': { password: 'admin123', role: UserRole.ADMIN, name: 'Admin User' },
  'doctor@hospital.com': { password: 'doctor123', role: UserRole.DOCTOR, name: 'Dr. Smith' },
  'nurse@hospital.com': { password: 'nurse123', role: UserRole.NURSE, name: 'Nurse Johnson' },
  'receptionist@hospital.com': { password: 'reception123', role: UserRole.RECEPTIONIST, name: 'Reception Desk' },
  'pharmacist@hospital.com': { password: 'pharma123', role: UserRole.PHARMACIST, name: 'Pharmacist Lee' },
  'lab@hospital.com': { password: 'lab123', role: UserRole.LAB_TECH, name: 'Lab Tech' },
  'radio@hospital.com': { password: 'radio123', role: UserRole.RADIOLOGIST, name: 'Radiologist' },
  'finance@hospital.com': { password: 'finance123', role: UserRole.FINANCE, name: 'Finance Manager' },
  'hr@hospital.com': { password: 'hr123', role: UserRole.HR, name: 'HR Manager' },
  'patient@hospital.com': { password: 'patient123', role: UserRole.PATIENT, name: 'Patient User' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      const savedDemoUser = localStorage.getItem('demo_user');
      if (savedDemoUser) {
        setUser(JSON.parse(savedDemoUser));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (!error && data.session) {
        const userData = data.session.user;
        setUser({
          id: userData.id,
          email: userData.email!,
          role: (userData.user_metadata?.role as UserRole) || UserRole.PATIENT,
          isActive: true,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at!,
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  async function login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const demoUser = DEMO_USERS[normalizedEmail];
    if (demoUser) {
      if (demoUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      const newUser: AuthUser = {
        id: `demo-${Math.random().toString(36).substring(7)}`,
        email: normalizedEmail,
        role: demoUser.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('demo_user', JSON.stringify(newUser));
      localStorage.setItem('auth_token', `demo-token-${newUser.id}`);
      setUser(newUser);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        throw error;
      }

      if (data.user && data.session) {
        const newUser: AuthUser = {
          id: data.user.id,
          email: data.user.email!,
          role: (data.user.user_metadata?.role as UserRole) || UserRole.PATIENT,
          isActive: true,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at!,
        };

        localStorage.setItem('auth_token', data.session.access_token);
        setUser(newUser);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login. Please check your credentials.');
    }
  }

  async function logout() {
    try {
      localStorage.removeItem('demo_user');
      localStorage.removeItem('auth_token');

      const { error } = await supabase.auth.signOut();
      if (error && !error.message.includes('session_not_found')) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  }

  function hasRole(roles: UserRole[]): boolean {
    return user ? roles.includes(user.role) : false;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
