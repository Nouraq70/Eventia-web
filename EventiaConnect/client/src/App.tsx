import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import EventsPage from "@/pages/events-page";
import EventDetailsPage from "@/pages/event-details-page";
import MyTicketsPage from "@/pages/my-tickets-page";
import ProfilePage from "@/pages/profile-page";
import AuthPage from "@/pages/auth-page";
import VideoFeedPage from "@/pages/video-feed-page";
import CheckoutPage from "@/pages/checkout-page";
import { LanguageProvider, useLanguage } from "@/hooks/use-language";
import { ModalProvider } from "@/hooks/use-modals";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Create a client
const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetailsPage} />
      <ProtectedRoute path="/my-tickets" component={MyTicketsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/videos" component={VideoFeedPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ModalProvider>
            <AppContent />
          </ModalProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-to-content">
        {language === 'ar' ? 'انتقل إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>
      <Header />
      <div className="flex-grow" id="main-content">
        <Router />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
