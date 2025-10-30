import { Outlet } from "react-router-dom";
// Removed NavItem type import
import { Sidebar } from "../common/Sidebar";
import { TopBar } from "../common/TopBar";
import { useAuth } from "../../context/AuthContext";
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
} from "../../lib/icons";
// Removed: import { UserRole } from '../../types';

// Role enums replaced with string literals for pure JavaScript
const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "ADMIN",
      "DOCTOR",
      "NURSE",
      "RECEPTIONIST",
      "PHARMACIST",
      "LAB_TECH",
      "RADIOLOGIST",
      "FINANCE",
      "HR",
      "PATIENT",
      "AUDITOR",
    ],
  },
  {
    label: "Patients",
    path: "/dashboard/patients",
    icon: Users,
    roles: ["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"],
  },
  {
    label: "Appointments",
    path: "/dashboard/appointments",
    icon: Calendar,
    roles: ["ADMIN", "DOCTOR", "RECEPTIONIST", "PATIENT"],
  },
  {
    label: "Prescriptions",
    path: "/dashboard/prescriptions",
    icon: FileText,
    roles: ["ADMIN", "DOCTOR", "PHARMACIST"],
  },
  {
    label: "Pharmacy",
    path: "/dashboard/pharmacy",
    icon: Pill,
    roles: ["ADMIN", "PHARMACIST"],
  },
  {
    label: "Laboratory",
    path: "/dashboard/laboratory",
    icon: FlaskConical,
    roles: ["ADMIN", "DOCTOR", "LAB_TECH"],
  },
  {
    label: "Radiology",
    path: "/dashboard/radiology",
    icon: Activity,
    roles: ["ADMIN", "DOCTOR", "RADIOLOGIST"],
  },
  {
    label: "Billing",
    path: "/dashboard/billing",
    icon: DollarSign,
    roles: ["ADMIN", "RECEPTIONIST", "FINANCE"],
  },
  {
    label: "Staff",
    path: "/dashboard/staff",
    icon: UserCog,
    roles: ["ADMIN", "HR"],
  },
  {
    label: "Reports",
    path: "/dashboard/reports",
    icon: ClipboardList,
    roles: ["ADMIN", "FINANCE", "AUDITOR"],
  },
];

export function DashboardLayout() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-hospital-purple/5">
      {/* Assuming Sidebar handles role-based filtering based on items and currentRole */}
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
