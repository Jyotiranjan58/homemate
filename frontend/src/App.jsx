import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import UserAuthModal from './components/UserAuthModal';
import ProviderAuth from './components/ProviderAuth';
import AdminDashboard from './components/AdminDashboard';
import Services from './components/Services';
import ProviderDashboard from './components/ProviderDashboard';
import UserBookings from './components/UserBookings';
import Profile from './components/Profile';
import Footer from './components/Footer';

// New Static Pages
import About from './components/About';
import Terms from './components/Terms';
import Privacy from './components/Privacy';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to close mobile menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <Router>
      {/* Added flex layout to push footer to the bottom */}
      <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        
        <nav className="premium-nav">
          <Link to="/" className="nav-brand" onClick={closeMenu}>Homemate</Link>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </button>

          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
            {!isAuthenticated && (
              <Link to="/partner" onClick={closeMenu} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>
                Become a Professional
              </Link>
            )}

            {isAuthenticated ? (
              <>
                {user?.role?.toLowerCase() === 'user' && (
                  <Link to="/my-bookings" onClick={closeMenu} style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600' }}>
                    My Bookings
                  </Link>
                )}

                <Link to="/profile" onClick={closeMenu} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '600' }}>
                  Settings
                </Link>

                <span className="nav-badge">
                  {user?.name}
                  <span style={{ color: 'var(--text-muted)', marginLeft: '4px', fontWeight: '400' }}>({user?.role})</span>
                </span>
                <button onClick={() => { logout(); closeMenu(); }} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#fee2e2', color: 'var(--accent-red)', border: 'none', borderRadius: '100px', fontWeight: '600' }}>
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => { setIsUserModalOpen(true); closeMenu(); }} style={{ padding: '0.6rem 1.5rem', cursor: 'pointer', backgroundColor: 'var(--text-main)', color: 'white', border: 'none', borderRadius: '100px', fontWeight: '600', boxShadow: 'var(--shadow-sm)' }}>
                Customer Login
              </button>
            )}
          </div>
        </nav>

        {/* Auth Modal (Hidden by default) */}
        <UserAuthModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />

        {/* === PAGE ROUTES === */}
        <main style={{ flexGrow: 1 }}>
          <Routes>
            {/* Public Routes (Anyone can see these) */}
            <Route path="/" element={
              isAuthenticated && user?.role === 'provider'
                ? <ProviderDashboard />
                : <Services />
            } />

            <Route path="/partner" element={<ProviderAuth />} />

            {/* --- NEW STATIC PAGES --- */}
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Protected Route: Only Customers */}
            <Route path="/my-bookings" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserBookings />
              </ProtectedRoute>
            } />

            {/* Protected Route: Customers & Providers */}
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['user', 'provider']}>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Protected Route: Only Admins */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <Footer />

      </div>
    </Router>
  );
}

export default App;
