
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Landing from "./pages/Landing";
import BuyDashboard from "./pages/BuyDashboard";
import BuyChat from "./pages/BuyChat";
import SellListings from "./pages/SellListings";
import SellChat from "./pages/SellChat";
import DraftListing from "./pages/DraftListing";
import MyListings from "./pages/MyListings";
import Dashboard from "./pages/Dashboard";
import Info from "./pages/Info";
import NotFound from "./pages/NotFound";
import LoginForm from "./pages/Login";
import SignupForm from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/buy/dashboard" element={<BuyDashboard />} />
            <Route path="/buy/chat" element={<BuyChat />} />
            <Route path="/sell/listings" element={<SellListings />} />
            <Route path="/sell/chat" element={<SellChat />} />
            <Route path="/sell/draft" element={<DraftListing />} />
            <Route path="/listings" element={<MyListings />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/info" element={<Info />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
