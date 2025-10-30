import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Users,
  Calendar,
  UserPlus,
  FileText,
  Pill,
  FlaskConical,
  Radio,
  DollarSign,
  UserCog,
  BarChart3,
  LogOut,
} from "../../lib/icons";
import { useAuth } from "../../jsx-context/AuthContext";
import { USER_ROLES } from "../../jsx-utils/constants";

export const Sidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: Activity, roles: "all" },
    {
      path: "/patients",
      label: "Patients",
      icon: Users,
      roles: [
        USER_ROLES.ADMIN,
        USER_ROLES.DOCTOR,
        USER_ROLES.NURSE,
        USER_ROLES.RECEPTIONIST,
      ],
    },
    {
      path: "/appointments",
      label: "Appointments",
      icon: Calendar,
      roles: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.RECEPTIONIST],
    },
    {
      path: "/staff",
      label: "Staff",
      icon: UserCog,
      roles: [USER_ROLES.ADMIN, USER_ROLES.HR],
    },
    {
      path: "/prescriptions",
      label: "Prescriptions",
      icon: FileText,
      roles: [USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.PHARMACIST],
    },
    {
      path: "/pharmacy",
      label: "Pharmacy",
      icon: Pill,
      roles: [USER_ROLES.ADMIN, USER_ROLES.PHARMACIST],
    },
    {
      path: "/laboratory",
      label: "Laboratory",
      icon: FlaskConical,
      roles: [USER_ROLES.ADMIN, USER_ROLES.LAB_TECH, USER_ROLES.DOCTOR],
    },
    {
      path: "/radiology",
      label: "Radiology",
      icon: Radio,
      roles: [USER_ROLES.ADMIN, USER_ROLES.RADIOLOGIST, USER_ROLES.DOCTOR],
    },
    {
      path: "/billing",
      label: "Billing",
      icon: DollarSign,
      roles: [USER_ROLES.ADMIN, USER_ROLES.FINANCE],
    },
    {
      path: "/reports",
      label: "Reports",
      icon: BarChart3,
      roles: [USER_ROLES.ADMIN, USER_ROLES.FINANCE, USER_ROLES.AUDITOR],
    },
  ];

  const hasAccess = (itemRoles) => {
    if (itemRoles === "all") return true;
    if (!user?.user_metadata?.role) return false;
    return itemRoles.includes(user.user_metadata.role);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className="bg-dark text-white vh-100 d-flex flex-column"
      style={{ width: "260px" }}
    >
      <div className="p-4 border-bottom border-secondary">
        <div className="d-flex align-items-center">
          <Activity size={32} className="text-primary me-2" />
          <div>
            <h5 className="mb-0 fw-bold">Hospital</h5>
            <small className="text-muted">Management System</small>
          </div>
        </div>
      </div>

      <Nav className="flex-column flex-grow-1 p-3 overflow-auto">
        {menuItems.map((item) => {
          if (!hasAccess(item.roles)) return null;

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Nav.Item key={item.path}>
              <Link
                to={item.path}
                className={`nav-link text-white d-flex align-items-center py-2 px-3 rounded mb-1 ${
                  isActive ? "bg-primary" : "hover-bg-secondary"
                }`}
                style={{ textDecoration: "none" }}
              >
                <Icon size={20} className="me-2" />
                <span>{item.label}</span>
              </Link>
            </Nav.Item>
          );
        })}
      </Nav>

      <div className="p-3 border-top border-secondary">
        <div className="d-flex align-items-center mb-3 px-3">
          <div
            className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: "40px", height: "40px" }}
          >
            <UserPlus size={20} />
          </div>
          <div className="flex-grow-1">
            <div className="fw-semibold small">{user?.email}</div>
            <div className="text-muted small">
              {user?.user_metadata?.role || "User"}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
        >
          <LogOut size={18} className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
