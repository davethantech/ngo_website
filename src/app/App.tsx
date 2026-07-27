import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { Toaster } from 'sonner';
import { supabase } from './lib/supabase';

// Lazy-loaded pages for code splitting (reduces initial bundle size)
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const InitiativesPage = lazy(() => import('./pages/InitiativesPage').then(m => ({ default: m.InitiativesPage })));
const InitiativeDetail = lazy(() => import('./pages/InitiativeDetail').then(m => ({ default: m.InitiativeDetail })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));
const CareersPage = lazy(() => import('./pages/CareersPage').then(m => ({ default: m.CareersPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage').then(m => ({ default: m.VolunteerPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const BeneficiaryRegistrationPage = lazy(() => import('./pages/BeneficiaryRegistrationPage').then(m => ({ default: m.BeneficiaryRegistrationPage })));

// Lazy-loaded admin components
const AdminRoot = lazy(() => import('./components/admin/AdminRoot').then(m => ({ default: m.AdminRoot })));
const Dashboard = lazy(() => import('./components/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const Blog = lazy(() => import('./components/admin/Blog').then(m => ({ default: m.Blog })));
const Initiatives = lazy(() => import('./components/admin/Initiatives').then(m => ({ default: m.Initiatives })));
const Metrics = lazy(() => import('./components/admin/Metrics').then(m => ({ default: m.Metrics })));
const FAQ = lazy(() => import('./components/admin/FAQ').then(m => ({ default: m.FAQ })));
const Careers = lazy(() => import('./components/admin/Careers').then(m => ({ default: m.Careers })));
const Inbox = lazy(() => import('./components/admin/Inbox').then(m => ({ default: m.Inbox })));
const Settings = lazy(() => import('./components/admin/Settings').then(m => ({ default: m.Settings })));

// Page loader shown while lazy chunks are fetching
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );
}


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Simple Auth Guard Component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={<><Navigation /><Home /><Footer /></>} />
            <Route path="/initiatives" element={<><Navigation /><InitiativesPage /><Footer /></>} />
            <Route path="/initiatives/:id" element={<><Navigation /><InitiativeDetail /><Footer /></>} />
            <Route path="/blog" element={<><Navigation /><BlogPage /><Footer /></>} />
            <Route path="/blog/:id" element={<><Navigation /><BlogPost /><Footer /></>} />
            <Route path="/careers" element={<><Navigation /><CareersPage /><Footer /></>} />
            <Route path="/faq" element={<><Navigation /><FAQPage /><Footer /></>} />
            <Route path="/volunteer" element={<><Navigation /><VolunteerPage /><Footer /></>} />
            <Route path="/register" element={<><Navigation /><BeneficiaryRegistrationPage /><Footer /></>} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <AuthGuard>
                  <AdminRoot />
                </AuthGuard>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="blog" element={<Blog />} />
              <Route path="initiatives" element={<Initiatives />} />
              <Route path="metrics" element={<Metrics />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="careers" element={<Careers />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}
