import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

import { LandingPage } from './pages/LandingPage';
import { WhitepaperPage } from './pages/WhitepaperPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardPage } from './pages/app/DashboardPage';
import { AssetsPage } from './pages/app/AssetsPage';
import { AssetFormPage } from './pages/app/AssetFormPage';
import { ReportsPage } from './pages/app/ReportsPage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from './pages/admin/AdminUserDetailPage';
import { AdminOrganizationsPage } from './pages/admin/AdminOrganizationsPage';
import { AdminOrganizationDetailPage } from './pages/admin/AdminOrganizationDetailPage';
import { AdminAssetsPage } from './pages/admin/AdminAssetsPage';
import { AdminAssetDetailPage } from './pages/admin/AdminAssetDetailPage';
import { AdminNewsletterPage } from './pages/admin/AdminNewsletterPage';
import { AdminSecurityPage } from './pages/admin/AdminSecurityPage';
import { AdminBlockchainPage } from './pages/admin/AdminBlockchainPage';
import { AdminAuditLogPage } from './pages/admin/AdminAuditLogPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/whitepaper" element={<WhitepaperPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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
            <Route path="assets" element={<AssetsPage />} />
            <Route path="assets/new" element={<AssetFormPage />} />
            <Route path="assets/:id" element={<AssetFormPage />} />
            <Route path="reports" element={<ReportsPage />} />
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
        </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
