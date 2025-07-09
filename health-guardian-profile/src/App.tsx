import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DetailsProvider } from "./contexts/DetailsContext";
import React, { useEffect, useState } from "react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HealthProfile from "./pages/HealthProfile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Emergency from "./pages/Emergency";
import FaceScan from "./pages/FaceScan";

const queryClient = new QueryClient();

// --- Protected Route ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastVisitedPath", location.pathname);
  }, [location]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// --- Public Route ---
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const lastVisitedPath = localStorage.getItem("lastVisitedPath") || "/";
    return <Navigate to={lastVisitedPath} replace />;
  }

  return <>{children}</>;
};

// --- NavigationHandler ---
const NavigationHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/", "/login", "/register", "/Docs", "/forgot-password", "/reset-password", "/FaceScan"];
    const isPublic = publicPaths.some(path => location.pathname.startsWith(path)) || location.pathname.startsWith("/emergency/");
    const lastVisitedPath = localStorage.getItem("lastVisitedPath") || "/";

    if (!isAuthenticated && !isPublic && !publicPaths.includes(location.pathname)) {
      localStorage.setItem("lastVisitedPath", location.pathname);
      navigate("/login", { replace: true });
    } else if (isAuthenticated && publicPaths.includes(location.pathname) && location.pathname !== "/") {
      navigate(lastVisitedPath, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);

  return <>{children}</>;
};

// --- AppRoutes ---
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
    <Route path="/emergency/:userId" element={<Emergency />} />
    <Route path="/FaceScan" element={<FaceScan />} />

    <Route path="/dashboard" element={
      <ProtectedRoute>
        <DetailsProvider>
          <Dashboard />
        </DetailsProvider>
      </ProtectedRoute>
    } />

    <Route path="/profile" element={
      <ProtectedRoute>
        <DetailsProvider>
          <HealthProfile />
        </DetailsProvider>
      </ProtectedRoute>
    } />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

// --- AppWithAuth (waits for session check) ---
const AppWithAuth = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationHandler>
          <AppRoutes />
        </NavigationHandler>
      </BrowserRouter>
    </TooltipProvider>
  );
};

// --- Root App Component ---
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
