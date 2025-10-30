import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
// Removed: import { AuthUser, UserRole } from '../types';

// Defined as a constant object to replace the TypeScript enum UserRole
const UserRoles = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
  PHARMACIST: 'PHARMACIST',
  LAB_TECH: 'LAB_TECH',
  RADIOLOGIST: 'RADIOLOGIST',
  FINANCE: 'FINANCE',
  HR: 'HR',
  PATIENT: 'PATIENT',
  AUDITOR: 'AUDITOR',
};

// Removed AuthContextType interface and its use in createContext
const AuthContext = createContext(undefined);

// The DEMO_USERS map now uses the string constants from UserRoles
const DEMO_USERS = {
  'admin@hospital.com': { password: 'admin123', role: UserRoles.ADMIN, name: 'Admin User' },
  'doctor@hospital.com': { password: 'doctor123', role: UserRoles.DOCTOR, name: 'Dr. Smith' },
  'nurse@hospital.com': { password: 'nurse123', role: UserRoles.NURSE, name: 'Nurse Johnson' },
  'receptionist@hospital.com': { password: 'reception123', role: UserRoles.RECEPTIONIST, name: 'Reception Desk' },
  'pharmacist@hospital.com': { password: 'pharma123', role: UserRoles.PHARMACIST, name: 'Pharmacist Lee' },
  'lab@hospital.com': { password: 'lab123', role: UserRoles.LAB_TECH, name: 'Lab Tech' },
  'radio@hospital.com': { password: 'radio123', role: UserRoles.RADIOLOGIST, name: 'Radiologist' },
  'finance@hospital.com': { password: 'finance123', role: UserRoles.FINANCE, name: 'Finance Manager' },
  'hr@hospital.com': { password: 'hr123', role: UserRoles.HR, name: 'HR Manager' },
  'patient@hospital.com': { password: 'patient123', role: UserRoles.PATIENT, name: 'Patient User' },
};

// Removed { children }: { children: ReactNode }
export function AuthProvider({ children }) {
  // Removed type annotations for useState
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Removed type annotations for useCallback
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
        
        // Implicit AuthUser object in JS
        const newUser = {
          id: userData.id,
          email: userData.email,
          // Removed type casting and used UserRoles constant
          role: userData.user_metadata?.role || UserRoles.PATIENT,
          isActive: true,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        };
        setUser(newUser);
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

  // Removed type annotations for function parameters
  async function login(email, password) {
    const normalizedEmail = email.toLowerCase().trim();

    const demoUser = DEMO_USERS[normalizedEmail];
    if (demoUser) {
      if (demoUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Implicit AuthUser object in JS
      const newUser = {
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
        // Implicit AuthUser object in JS
        const newUser = {
          id: data.user.id,
          email: data.user.email,
          // Removed type casting and used UserRoles constant
          role: data.user.user_metadata?.role || UserRoles.PATIENT,
          isActive: true,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at,
        };

        localStorage.setItem('auth_token', data.session.access_token);
        setUser(newUser);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Use error.message if available, otherwise a generic message
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

  // Removed type annotations for function parameters and return type
  function hasRole(roles) {
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