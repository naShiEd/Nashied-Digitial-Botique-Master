import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Work from "./pages/Work";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ProjectInquiry from "./pages/ProjectInquiry";
import ProjectDetail from "./pages/ProjectDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Finance from "./pages/Finance";
import Purchases from "./pages/Purchases";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import ServicesDashboard from "./pages/ServicesDashboard";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import ProjectInternal from "./pages/ProjectInternal";
import NotFound from "./pages/NotFound";

import ClientPortal from "./pages/ClientPortal";
import { AuthProvider } from "./contexts/AuthContext";
import { FloatingInquiry } from "./components/FloatingInquiry";

import { PublicLayout } from "./components/PublicLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <FloatingInquiry />
        <BrowserRouter>
          <Routes>
            {/* Dashboard and Auth Routes (No Smooth Scroll) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/tasks" element={<Tasks />} />
            <Route path="/dashboard/clients" element={<Clients />} />
            <Route path="/dashboard/projects" element={<Projects />} />
            <Route path="/dashboard/projects/:id" element={<ProjectInternal />} />
            <Route path="/dashboard/finance" element={<Finance />} />
            <Route path="/dashboard/purchases" element={<Purchases />} />
            <Route path="/dashboard/payroll" element={<Payroll />} />
            <Route path="/dashboard/reports" element={<Reports />} />
            <Route path="/dashboard/services" element={<ServicesDashboard />} />
            <Route path="/dashboard/documents" element={<Documents />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/portal/:type/:id" element={<ClientPortal />} />

            {/* Public Routes with Premium Smooth Scroll & Progress */}
            <Route element={<PublicLayout><Index /></PublicLayout>} path="/" />
            <Route element={<PublicLayout><Work /></PublicLayout>} path="/work" />
            <Route element={<PublicLayout><ProjectDetail /></PublicLayout>} path="/work/:slug" />
            <Route element={<PublicLayout><Services /></PublicLayout>} path="/services" />
            <Route element={<PublicLayout><About /></PublicLayout>} path="/about" />
            <Route element={<PublicLayout><Contact /></PublicLayout>} path="/contact" />
            <Route element={<PublicLayout><ProjectInquiry /></PublicLayout>} path="/project-inquiry" />
            <Route element={<PublicLayout><Blog /></PublicLayout>} path="/blog" />
            <Route element={<PublicLayout><BlogPost /></PublicLayout>} path="/blog/:id" />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
