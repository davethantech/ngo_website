import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { Toaster } from 'sonner';
import { supabase } from './lib/supabase';

// Pages
import { Home } from './pages/Home';
import { InitiativesPage } from './pages/InitiativesPage';
import { InitiativeDetail } from './pages/InitiativeDetail';
import { BlogPage } from './pages/BlogPage';
import { BlogPost } from './pages/BlogPost';
import { CareersPage } from './pages/CareersPage';
import { FAQPage } from './pages/FAQPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { LoginPage } from './pages/LoginPage';
import { AdminRoot } from './components/admin/AdminRoot';
import { Dashboard } from './components/admin/Dashboard';
import { Blog } from './components/admin/Blog';
import { Initiatives } from './components/admin/Initiatives';
import { Metrics } from './components/admin/Metrics';
import { FAQ } from './components/admin/FAQ';
import { Careers } from './components/admin/Careers';
import { Inbox } from './components/admin/Inbox';
import { Settings } from './components/admin/Settings';

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
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}
