import { Outlet } from 'react-router-dom';
import { Sidebar, NavItem } from '../common/Sidebar';
import { TopBar } from '../common/TopBar';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  Activity,
  DollarSign,
  UserCog,
  ClipboardList,
} from 'lucide-react';
import { UserRole } from '../../types';

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST, UserRole.PHARMACIST, UserRole.LAB_TECH, UserRole.RADIOLOGIST, UserRole.FINANCE, UserRole.HR, UserRole.PATIENT, UserRole.AUDITOR],
  },
  {
    label: 'Patients',
    path: '/dashboard/patients',
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST],
  },
  {
    label: 'Appointments',
    path: '/dashboard/appointments',
    icon: Calendar,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.PATIENT],
  },
  {
    label: 'Prescriptions',
    path: '/dashboard/prescriptions',
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.PHARMACIST],
  },
  {
    label: 'Pharmacy',
    path: '/dashboard/pharmacy',
    icon: Pill,
    roles: [UserRole.ADMIN, UserRole.PHARMACIST],
  },
  {
    label: 'Laboratory',
    path: '/dashboard/laboratory',
    icon: FlaskConical,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.LAB_TECH],
  },
  {
    label: 'Radiology',
    path: '/dashboard/radiology',
    icon: Activity,
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RADIOLOGIST],
  },
  {
    label: 'Billing',
    path: '/dashboard/billing',
    icon: DollarSign,
    roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.FINANCE],
  },
  {
    label: 'Staff',
    path: '/dashboard/staff',
    icon: UserCog,
    roles: [UserRole.ADMIN, UserRole.HR],
  },
  {
    label: 'Reports',
    path: '/dashboard/reports',
    icon: ClipboardList,
    roles: [UserRole.ADMIN, UserRole.FINANCE, UserRole.AUDITOR],
  },
];

export function DashboardLayout() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-hospital-purple/5">
      <Sidebar items={navItems} currentRole={user.role} />
      <TopBar />
      <main className="ml-64 pt-16">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
