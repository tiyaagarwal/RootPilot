import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EnterpriseShell } from '../layouts/EnterpriseShell';
import { LoginPage } from '../pages/LoginPage';
import { CommandCenterPage } from '../pages/CommandCenterPage';
import { IncidentsPage } from '../pages/IncidentsPage';
import { RcaPage } from '../pages/RcaPage';
import { ServiceCatalogPage } from '../pages/ServiceCatalogPage';
import { AutonomousOpsPage } from '../pages/AutonomousOpsPage';
import { SettingsPage } from '../pages/SettingsPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // or loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <EnterpriseShell>{children}</EnterpriseShell>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <CommandCenterPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/incidents"
        element={
          <PrivateRoute>
            <IncidentsPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/rca"
        element={
          <PrivateRoute>
            <RcaPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/services"
        element={
          <PrivateRoute>
            <ServiceCatalogPage />
          </PrivateRoute>
        }
      />

      
      <Route
        path="/autonomous"
        element={
          <PrivateRoute>
            <AutonomousOpsPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
