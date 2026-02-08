import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import InvitationPage from "@/pages/InvitationPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardLayout from "@/pages/admin/DashboardLayout";
import DashboardHome from "@/pages/admin/DashboardHome";
import EditInvitation from "@/pages/admin/EditInvitation";
import RSVPList from "@/pages/admin/RSVPList";
import MessageList from "@/pages/admin/MessageList";
import CreateInvitation from "@/pages/admin/CreateInvitation";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-primary font-serif text-xl">Memuat...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Invitation Page */}
          <Route path="/undangan/:invitationId" element={<InvitationPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="buat" element={<CreateInvitation />} />
            <Route path="edit/:invitationId" element={<EditInvitation />} />
            <Route path="rsvp/:invitationId" element={<RSVPList />} />
            <Route path="ucapan/:invitationId" element={<MessageList />} />
          </Route>
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
