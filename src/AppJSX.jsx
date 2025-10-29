import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './jsx-context/AuthContext';
import Login from './jsx-components/auth/Login';
import AdminDashboard from './jsx-components/pages/dashboard/AdminDashboard';
import DoctorDashboard from './jsx-components/pages/dashboard/DoctorDashboard';
import NurseDashboard from './jsx-components/pages/dashboard/NurseDashboard';
import ReceptionistDashboard from './jsx-components/pages/dashboard/ReceptionistDashboard';
import PharmacistDashboard from './jsx-components/pages/dashboard/PharmacistDashboard';
import PatientList from './jsx-components/pages/patient/PatientList';
import AppointmentList from './jsx-components/pages/appointment/AppointmentList';
import StaffList from './jsx-components/pages/staff/StaffList';
import PrescriptionList from './jsx-components/pages/prescription/PrescriptionList';
import PharmacyList from './jsx-components/pages/pharmacy/PharmacyList';
import LaboratoryList from './jsx-components/pages/laboratory/LaboratoryList';
import RadiologyList from './jsx-components/pages/radiology/RadiologyList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.user_metadata?.role || user?.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role || user?.role;

  switch (userRole) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'DOCTOR':
      return <DoctorDashboard />;
    case 'NURSE':
      return <NurseDashboard />;
    case 'RECEPTIONIST':
      return <ReceptionistDashboard />;
    case 'PHARMACIST':
      return <PharmacistDashboard />;
    case 'LAB_TECH':
      return <DoctorDashboard />;
    case 'RADIOLOGIST':
      return <DoctorDashboard />;
    case 'FINANCE':
      return <AdminDashboard />;
    case 'HR':
      return <AdminDashboard />;
    case 'AUDITOR':
      return <AdminDashboard />;
    default:
      return <AdminDashboard />;
  }
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
            <PatientList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']}>
            <AppointmentList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'HR']}>
            <StaffList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PHARMACIST']}>
            <PrescriptionList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pharmacy"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
            <PharmacyList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/laboratory"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'LAB_TECH', 'DOCTOR']}>
            <LaboratoryList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/radiology"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'RADIOLOGIST', 'DOCTOR']}>
            <RadiologyList />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function AppJSX() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default AppJSX;
