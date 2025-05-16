
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import TemplateEditor from "./pages/TemplateEditor";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import LMSCampaigns from "./pages/LMSCampaigns";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Campaigns from "./pages/Campaigns";
import EmployeeCourses from "./pages/EmployeeCourses";
import ProfileSettings from "./pages/ProfileSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/template-editor/:id?" element={<TemplateEditor />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/lms-campaigns" element={<LMSCampaigns />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/employee-courses" element={<EmployeeCourses />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
