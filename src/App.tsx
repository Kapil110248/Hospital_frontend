import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';

const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const DashboardLayout = lazy(() => import('./components/layouts/DashboardLayout').then(module => ({ default: module.DashboardLayout })));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const DoctorDashboard = lazy(() => import('./pages/dashboard/DoctorDashboard').then(module => ({ default: module.DoctorDashboard })));
const NurseDashboard = lazy(() => import('./pages/dashboard/NurseDashboard').then(module => ({ default: module.NurseDashboard })));
const ReceptionistDashboard = lazy(() => import('./pages/dashboard/ReceptionistDashboard').then(module => ({ default: module.ReceptionistDashboard })));
const PharmacistDashboard = lazy(() => import('./pages/dashboard/PharmacistDashboard').then(module => ({ default: module.PharmacistDashboard })));
const LabTechDashboard = lazy(() => import('./pages/dashboard/LabTechDashboard').then(module => ({ default: module.LabTechDashboard })));
const RadiologistDashboard = lazy(() => import('./pages/dashboard/RadiologistDashboard').then(module => ({ default: module.RadiologistDashboard })));
const FinanceDashboard = lazy(() => import('./pages/dashboard/FinanceDashboard').then(module => ({ default: module.FinanceDashboard })));
const HRDashboard = lazy(() => import('./pages/dashboard/HRDashboard').then(module => ({ default: module.HRDashboard })));
const PatientPortal = lazy(() => import('./pages/dashboard/PatientPortal').then(module => ({ default: module.PatientPortal })));
const AuditorDashboard = lazy(() => import('./pages/dashboard/AuditorDashboard').then(module => ({ default: module.AuditorDashboard })));

const Patients = lazy(() => import('./pages/Patients').then(module => ({ default: module.Patients })));
const Appointments = lazy(() => import('./pages/Appointments').then(module => ({ default: module.Appointments })));
const Prescriptions = lazy(() => import('./pages/Prescriptions').then(module => ({ default: module.Prescriptions })));
const Pharmacy = lazy(() => import('./pages/Pharmacy').then(module => ({ default: module.Pharmacy })));
const Laboratory = lazy(() => import('./pages/Laboratory').then(module => ({ default: module.Laboratory })));
const Radiology = lazy(() => import('./pages/Radiology').then(module => ({ default: module.Radiology })));
const Billing = lazy(() => import('./pages/Billing').then(module => ({ default: module.Billing })));
const Staff = lazy(() => import('./pages/Staff').then(module => ({ default: module.Staff })));
const Reports = lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hospital-purple/20 via-white to-teal-500/20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-hospital-purple mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return null;

  const dashboardMap: Record<UserRole, React.ComponentType> = {
    [UserRole.ADMIN]: AdminDashboard,
    [UserRole.DOCTOR]: DoctorDashboard,
    [UserRole.NURSE]: NurseDashboard,
    [UserRole.RECEPTIONIST]: ReceptionistDashboard,
    [UserRole.PHARMACIST]: PharmacistDashboard,
    [UserRole.LAB_TECH]: LabTechDashboard,
    [UserRole.RADIOLOGIST]: RadiologistDashboard,
    [UserRole.FINANCE]: FinanceDashboard,
    [UserRole.HR]: HRDashboard,
    [UserRole.PATIENT]: PatientPortal,
    [UserRole.AUDITOR]: AuditorDashboard,
  };

  const DashboardComponent = dashboardMap[user.role];

  if (!DashboardComponent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to HMS</h2>
        <p className="text-gray-600">Dashboard for {user.role} is under development</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardComponent />
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardRouter />} />
              <Route path="patients" element={<Patients />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="pharmacy" element={<Pharmacy />} />
              <Route path="laboratory" element={<Laboratory />} />
              <Route path="radiology" element={<Radiology />} />
              <Route path="billing" element={<Billing />} />
              <Route path="staff" element={<Staff />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
