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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portal/:type/:id" element={<ClientPortal />} />
            <Route path="/work" element={<Work />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/project-inquiry" element={<ProjectInquiry />} />
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
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
