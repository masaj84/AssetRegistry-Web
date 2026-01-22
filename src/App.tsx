import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/app/DashboardPage';
import { AssetsPage } from './pages/app/AssetsPage';
import { AssetFormPage } from './pages/app/AssetFormPage';
import { ReportsPage } from './pages/app/ReportsPage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
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

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
