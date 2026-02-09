import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { AdminPanel } from './components/admin-panel';
import { Toaster } from 'sonner';

// Pages
import { Home } from './pages/Home';
import { InitiativesPage } from './pages/InitiativesPage';
import { InitiativeDetail } from './pages/InitiativeDetail';
import { BlogPage } from './pages/BlogPage';
import { BlogPost } from './pages/BlogPost';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  // Admin hotkey: Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        setShowAdmin(!showAdmin);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAdmin]);

  if (showAdmin) {
    return (
      <>
        <AdminPanel onClose={() => setShowAdmin(false)} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/initiatives" element={<InitiativesPage />} />
          <Route path="/initiatives/:id" element={<InitiativeDetail />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Routes>
        <Footer />
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}
