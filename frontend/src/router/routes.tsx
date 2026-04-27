import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/* ─── Route Guards ────────────────────────────────────────────── */

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const user = useAuthStore((s) => s.user);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Check if email is verified - only block if explicitly false (not null/undefined)
  // This allows legacy users to continue using the app
  if (user?.emailVerified === false) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return <Outlet />;
};

export const VerifiedEmailRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const user = useAuthStore((s) => s.user);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // If already verified (true or null/undefined), redirect to dashboard
  if (user?.emailVerified !== false) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export const AdminRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const isAdmin = useAuthStore((s) => s.isAdmin());
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  
  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

/* ─── Page Imports ─────────────────────────────────────────────── */

import LoginPageComponent from '../pages/auth/LoginPage';
import RegisterPageComponent from '../pages/auth/RegisterPage';
import VerifyEmailPageComponent from '../pages/auth/VerifyEmailPage';
import DashboardPageComponent from '../pages/DashboardPage';
import MapPageComponent from '../pages/MapPage';
import ReportsPageComponent from '../pages/reports/ReportsPage';
import NewReportPageComponent from '../pages/reports/NewReportPage';
import AnalyticsPageComponent from '../pages/analytics/AnalyticsPage';
import FloodPageComponent from '../pages/FloodPage';
import EmergencyPageComponent from '../pages/EmergencyPage';
import NotificationsPageComponent from '../pages/NotificationsPage';
import ProfilePageComponent from '../pages/ProfilePage';
import SettingsPageComponent from '../pages/SettingsPage';
import GuidesPageComponent from '../pages/guides/GuidesPage';
import GuideDetailPageComponent from '../pages/guides/GuideDetailPage';
import FaqPageComponent from '../pages/FaqPage';

import AdminDashboardPageComponent from '../pages/admin/AdminDashboardPage';
import AdminUsersPageComponent from '../pages/admin/AdminUsersPage';
import AdminDisastersPageComponent from '../pages/admin/AdminDisastersPage';
import AdminSystemPageComponent from '../pages/admin/AdminSystemPage';
import AdminGuidesPageComponent from '../pages/admin/AdminGuidesPage';
import AdminReportsPageComponent from '../pages/admin/AdminReportsPage';
import AdminWarningsPageComponent from '../pages/admin/AdminWarningsPage';
import AdminCampsPageComponent from '../pages/admin/AdminCampsPage';
import AdminNeedsPageComponent from '../pages/admin/AdminNeedsPage';
import OperationsPageComponent from '../pages/OperationsPage';
import AlertsPageComponent from '../pages/AlertsPage';

export const LoginPage = LoginPageComponent;
export const RegisterPage = RegisterPageComponent;
export const DashboardPage = DashboardPageComponent;
export const MapPage = MapPageComponent;
export const ReportsPage = ReportsPageComponent;
export const NewReportPage = NewReportPageComponent;
export const AnalyticsPage = AnalyticsPageComponent;
export const FloodPage = FloodPageComponent;
export const EmergencyPage = EmergencyPageComponent;
export const NotificationsPage = NotificationsPageComponent;
export const ProfilePage = ProfilePageComponent;
export const SettingsPage = SettingsPageComponent;
export const GuidesPage = GuidesPageComponent;
export const GuideDetailPage = GuideDetailPageComponent;
export const FaqPage = FaqPageComponent;

export const AdminDashboardPage = AdminDashboardPageComponent;
export const AdminUsersPage = AdminUsersPageComponent;
export const AdminDisastersPage = AdminDisastersPageComponent;
export const AdminSystemPage = AdminSystemPageComponent;
export const AdminGuidesPage = AdminGuidesPageComponent;
export const AdminReportsPage = AdminReportsPageComponent;
export const AdminWarningsPage = AdminWarningsPageComponent;
export const AdminCampsPage = AdminCampsPageComponent;
export const AdminNeedsPage = AdminNeedsPageComponent;
export const OperationsPage = OperationsPageComponent;
export const AlertsPage = AlertsPageComponent;
export const VerifyEmailPage = VerifyEmailPageComponent;
