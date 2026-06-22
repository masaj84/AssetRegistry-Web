import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { CookieConsent } from './components/legal/CookieConsent';
import { ScrollToHash } from './components/ScrollToHash';

// Layouts (keep synchronous - used as route wrappers)
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Lazy-loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const WhitepaperPage = lazy(() => import('./pages/WhitepaperPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const AuthActionPage = lazy(() => import('./pages/auth/AuthActionPage'));
const AccountActivatedPage = lazy(() => import('./pages/auth/AccountActivatedPage'));
const OAuthCallbackPage = lazy(() => import('./pages/auth/OAuthCallbackPage'));
const VerifyPage = lazy(() => import('./pages/VerifyPage'));
const PublicCarPage = lazy(() => import('./pages/PublicCarPage'));
const IndustryPage = lazy(() => import('./pages/IndustryPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const TechPage = lazy(() => import('./pages/TechPage'));
const KomisPage = lazy(() => import('./pages/KomisPage'));

// App pages
const DashboardPage = lazy(() => import('./pages/app/DashboardPage'));
const AssetsPage = lazy(() => import('./pages/app/AssetsPage'));
const AssetFormPage = lazy(() => import('./pages/app/AssetFormPage'));
const CarsPage = lazy(() => import('./pages/app/CarsPage'));
const CarFormPage = lazy(() => import('./pages/app/CarFormPage'));
const CarDetailPage = lazy(() => import('./pages/app/CarDetailPage'));
const ReportsPage = lazy(() => import('./pages/app/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/app/SettingsPage'));
const CreateOrganizationPage = lazy(() => import('./pages/app/CreateOrganizationPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminUserDetailPage = lazy(() => import('./pages/admin/AdminUserDetailPage'));
const AdminOrganizationsPage = lazy(() => import('./pages/admin/AdminOrganizationsPage'));
const AdminOrganizationDetailPage = lazy(() => import('./pages/admin/AdminOrganizationDetailPage'));
const AdminAssetsPage = lazy(() => import('./pages/admin/AdminAssetsPage'));
const AdminAssetDetailPage = lazy(() => import('./pages/admin/AdminAssetDetailPage'));
const AdminNewsletterPage = lazy(() => import('./pages/admin/AdminNewsletterPage'));
const AdminSecurityPage = lazy(() => import('./pages/admin/AdminSecurityPage'));
const AdminBlockchainPage = lazy(() => import('./pages/admin/AdminBlockchainPage'));
const AdminAuditLogPage = lazy(() => import('./pages/admin/AdminAuditLogPage'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
        <BrowserRouter>
        <ScrollToHash />
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/whitepaper" element={<WhitepaperPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm-email" element={<AuthActionPage />} />
          <Route path="/forgot-password" element={<AuthActionPage />} />
          <Route path="/reset-password" element={<AuthActionPage />} />
          <Route path="/account-activated" element={<AccountActivatedPage />} />
          <Route path="/auth/callback/:provider" element={<OAuthCallbackPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/verify/:hash" element={<VerifyPage />} />
          <Route path="/car/:id" element={<PublicCarPage />} />

          {/* Industry sub-pages (Step 9) */}
          <Route path="/zegarmistrzostwo" element={<IndustryPage industry="watches" />} />
          <Route path="/galerie-sztuki" element={<IndustryPage industry="art" />} />
          <Route path="/instrumenty" element={<IndustryPage industry="instruments" />} />
          <Route path="/inne" element={<IndustryPage industry="other" />} />
          <Route path="/jak-dziala" element={<TechPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/komis" element={<KomisPage />} />
          <Route path="/uzywane" element={<KomisPage />} />

          {/* Protected app routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="onboarding/organization" element={<CreateOrganizationPage />} />
            <Route path="cars" element={<CarsPage />} />
            <Route path="cars/new" element={<CarFormPage />} />
            <Route path="cars/:id" element={<CarDetailPage />} />
            <Route path="cars/:id/edit" element={<CarFormPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="assets/new" element={<AssetFormPage />} />
            <Route path="assets/:id" element={<AssetFormPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/app/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/:id" element={<AdminUserDetailPage />} />
            <Route path="organizations" element={<AdminOrganizationsPage />} />
            <Route path="organizations/:id" element={<AdminOrganizationDetailPage />} />
            <Route path="assets" element={<AdminAssetsPage />} />
            <Route path="assets/:id" element={<AdminAssetDetailPage />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="security" element={<AdminSecurityPage />} />
            <Route path="blockchain" element={<AdminBlockchainPage />} />
            <Route path="audit" element={<AdminAuditLogPage />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        <CookieConsent />
        </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
