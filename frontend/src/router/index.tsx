import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  ProtectedRoute,
  VerifiedEmailRoute,
  AdminRoute,
  PublicOnlyRoute,
  LoginPage,
  RegisterPage,
  VerifyEmailPage,
  DashboardPage,
  MapPage,
  ReportsPage,
  NewReportPage,
  AnalyticsPage,
  FloodPage,
  EmergencyPage,
  NotificationsPage,
  ProfilePage,
  SettingsPage,
  GuidesPage,
  GuideDetailPage,
  FaqPage,
  AdminDashboardPage,
  AdminUsersPage,
  AdminDisastersPage,
  AdminSystemPage,
  AdminGuidesPage,
  AdminReportsPage,
  AdminWarningsPage,
  AdminCampsPage,
  AdminNeedsPage,
  OperationsPage,
  AlertsPage,
} from './routes';
import AuthLayout from '../components/layout/AuthLayout';
import AppShell from '../components/layout/AppShell';
// import GlassAppShell from '../components/layout/GlassAppShell';
import { useAuthStore } from '../store/authStore';

// SIDMS Relief pages (ported from Disaster-Management-master)
import NeedsRegistry from '../pages/relief/NeedsRegistry';
import TransparencyWall from '../pages/relief/TransparencyWall';
import CampPortal from '../pages/relief/CampPortal';
import CampDashboard from '../pages/relief/CampDashboard';
import ReliefAdminPage from '../pages/relief/ReliefAdminPage';
import ReliefAnalyticsDashboard from '../pages/relief/ReliefAnalyticsDashboard';

// SIDMS Guidance sub-app (verbatim from DM)
import GuidanceLayout from '../pages/guidance/GuidanceLayout';
import DisasterChatbot from '../pages/guidance/DisasterChatbot';
import NewsScraper from '../pages/guidance/NewsScraper';
import OfflineGuides from '../pages/guidance/OfflineGuides';

// SIDMS Expert dashboard (verbatim from DM — uses ArcGIS / external APIs)
import ExpertDashboard from '../pages/expert/ExpertDashboard';
import RiverBasinExplorer from '../pages/expert/RiverBasinExplorer';
import PredictionsPage from '../pages/expert/PredictionsPage';
import AlertsManager from '../pages/expert/AlertsManager';
import IncidentTracker from '../pages/expert/IncidentTracker';
import MissingPersons from '../components/MissingPersons';

// Missing Persons (from Production)
import MissingPersons from '../components/MissingPersons';

/* ─── Root redirect component ─────────────────────────────────── */
function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

/* ═══════════════════════════════════════════════════════════════════
   Router
   ═══════════════════════════════════════════════════════════════════ */
export const router = createBrowserRouter([
  /* Root */
  { path: '/', element: <RootRedirect /> },

  /* Public-only (redirects to /dashboard if already logged in) */
  {
    element: <AuthLayout />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },

  /* Email Verification (requires auth but NOT verified email) */
  {
    element: <VerifiedEmailRoute />,
    children: [
      { path: '/verify-email', element: <VerifyEmailPage /> },
    ],
  },

  /* Routes wrapped in AppShell (theme aware) layout */
  {
    element: <AppShell />,
    children: [
      /* Protected (requires authentication) */
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/map', element: <MapPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/reports/new', element: <NewReportPage /> },
          { path: '/analytics', element: <AnalyticsPage /> },
          { path: '/analytics/:spatialUnitId', element: <AnalyticsPage /> },
          { path: '/flood', element: <FloodPage /> },
          { path: '/emergency', element: <EmergencyPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/alerts', element: <AlertsPage /> },
          { path: '/operations', element: <OperationsPage /> },

          // ── SIDMS Relief Camp Manager (requires auth) ──
          { path: '/relief/manager', element: <CampDashboard /> },
          { path: '/relief/analytics', element: <ReliefAnalyticsDashboard /> },
          // ── SIDMS Expert dashboard (requires auth) ──
          { path: '/expert', element: <ExpertDashboard /> },
          { path: '/expert/rivers', element: <RiverBasinExplorer /> },
          { path: '/expert/predictions', element: <PredictionsPage /> },
          { path: '/expert/alerts', element: <AlertsManager /> },
          { path: '/expert/incidents', element: <IncidentTracker /> },
        ],
      },

      /* Public SIDMS relief pages (accessible without login) */
      { path: '/relief', element: <NeedsRegistry /> },
      { path: '/relief/transparency', element: <TransparencyWall /> },
      { path: '/relief/camp/:campId', element: <CampPortal /> },
<<<<<<< HEAD
      { path: '/missing-persons', element: <MissingPersons /> },
=======
      { path: '/missing', element: <MissingPersons /> },
>>>>>>> bca7b13bfb84251a4de4ad6c1ffe2cea177e0b96

      /* Public Guidance sub-app (chatbot, news, guides) */
      {
        path: '/guidance',
        element: <GuidanceLayout />,
        children: [
          { index: true, element: <DisasterChatbot /> },
          { path: 'chat', element: <DisasterChatbot /> },
          { path: 'news', element: <NewsScraper /> },
          { path: 'guides', element: <OfflineGuides /> },
        ],
      },

      /* Public CS pages (accessible to everyone, inside layout) */
      { path: '/guides', element: <GuidesPage /> },
      { path: '/guides/:slug', element: <GuideDetailPage /> },
      { path: '/faq', element: <FaqPage /> },

      /* Admin (requires admin role) */
      {
        element: <AdminRoute />,
        children: [
          { path: '/admin',           element: <AdminDashboardPage /> },
          { path: '/admin/users',     element: <AdminUsersPage /> },
          { path: '/admin/disasters', element: <AdminDisastersPage /> },
          { path: '/admin/system',    element: <AdminSystemPage /> },
          { path: '/admin/guides',    element: <AdminGuidesPage /> },
          // ── previously on-disk but unregistered ──
          { path: '/admin/reports',   element: <AdminReportsPage /> },
          { path: '/admin/warnings',  element: <AdminWarningsPage /> },
          // ── Step 8: new DM-origin admin pages ──
          { path: '/admin/camps',     element: <AdminCampsPage /> },
          { path: '/admin/needs',     element: <AdminNeedsPage /> },
          // ── SIDMS Relief Admin (admin only) ──
          { path: '/relief/admin',    element: <ReliefAdminPage /> },
        ],
      },
    ],
  },
]);
