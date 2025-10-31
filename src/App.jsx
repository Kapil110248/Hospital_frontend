import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { lazyImport } from "./utils/lazyImport";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

// ✅ Login + Layout
const Login = lazyImport(() => import("./pages/Login"));
const DashboardLayout = lazyImport(() => import("./components/layouts/DashboardLayout"));

// ✅ Dashboards (All default exports — so no second argument!)
const AdminDashboard = lazyImport(() => import("./pages/dashboard/AdminDashboard"));
const DoctorDashboard = lazyImport(() => import("./pages/dashboard/DoctorDashboard"));
const NurseDashboard = lazyImport(() => import("./pages/dashboard/NurseDashboard"));
const ReceptionistDashboard = lazyImport(() => import("./pages/dashboard/ReceptionistDashboard"));
const PharmacistDashboard = lazyImport(() => import("./pages/dashboard/PharmacistDashboard"));
const LabTechDashboard = lazyImport(() => import("./pages/dashboard/LabTechDashboard"));
const RadiologistDashboard = lazyImport(() => import("./pages/dashboard/RadiologistDashboard"));
const FinanceDashboard = lazyImport(() => import("./pages/dashboard/FinanceDashboard"));
const HRDashboard = lazyImport(() => import("./pages/dashboard/HRDashboard"));
const PatientPortal = lazyImport(() => import("./pages/dashboard/PatientPortal"));
const AuditorDashboard = lazyImport(() => import("./pages/dashboard/AuditorDashboard"));

// ✅ Other Pages
const Patients = lazyImport(() => import("./pages/Patients"));
const Appointments = lazyImport(() => import("./pages/Appointments"));
const Prescriptions = lazyImport(() => import("./pages/Prescriptions"));
const Pharmacy = lazyImport(() => import("./pages/Pharmacy"));
const Laboratory = lazyImport(() => import("./pages/Laboratory"));
const Radiology = lazyImport(() => import("./pages/Radiology"));
const Billing = lazyImport(() => import("./pages/Billing"));
const Staff = lazyImport(() => import("./pages/Staff"));
const Reports = lazyImport(() => import("./pages/Reports"));

// ✅ Loader
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

// ✅ Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;

  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

// ✅ Dashboard Router (Dynamic Role-based Loading)
function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const dashboardMap = {
    ADMIN: AdminDashboard,
    DOCTOR: DoctorDashboard,
    NURSE: NurseDashboard,
    RECEPTIONIST: ReceptionistDashboard,
    PHARMACIST: PharmacistDashboard,
    LAB_TECH: LabTechDashboard,
    RADIOLOGIST: RadiologistDashboard,
    FINANCE: FinanceDashboard,
    HR: HRDashboard,
    PATIENT: PatientPortal,
    AUDITOR: AuditorDashboard,
  };

  const Component = dashboardMap[user.role];

  if (!Component) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to HMS</h2>
        <p className="text-gray-600">
          Dashboard for {user.role} is under development
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
}

// ✅ Main App
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Login */}
            <Route
              path="/login"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                </Suspense>
              }
            />

            {/* Protected Dashboard */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <DashboardLayout />
                    </ErrorBoundary>
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <DashboardRouter />
                    </ErrorBoundary>
                  </Suspense>
                }
              />

              {/* Nested routes */}
              <Route
                path="patients"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <Patients />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="appointments"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <Appointments />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="prescriptions"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <Prescriptions />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="pharmacy"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <Pharmacy />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="laboratory"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <Laboratory />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="radiology"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <Radiology />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="billing"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <Billing />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="staff"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <Staff />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
              <Route
                path="reports"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ErrorBoundary>
                      <Reports />
                    </ErrorBoundary>
                  </Suspense>
                }
              />
            </Route>

            {/* Default Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
