import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QualityControlPage from "./pages/QualityControlPage";
import QualityControlDashboardPage from "./pages/QualityControlDashboardPage";
import TechnicalInfoPage from "./pages/TechnicalInfoPage";
import SampleEntryPage from "./pages/SampleEntryPage";
import AccessLogPage from "./pages/AccessLogPage";
import HistoryPage from "./pages/HistoryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quality-control" element={<QualityControlPage />} />
            <Route path="/quality-control-dashboard" element={<QualityControlDashboardPage />} />
            <Route path="/technical-info" element={<TechnicalInfoPage />} />
            <Route path="/sample-entry" element={<SampleEntryPage />} />
            <Route path="/access-log" element={<AccessLogPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
