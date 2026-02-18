import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Home, Tent, HeartHandshake, LogOut, BarChart3, Globe, Shield, BookOpen, Activity, Waves, Menu, X, TrendingUp, AlertTriangle } from 'lucide-react';
import NeedsRegistry from './components/NeedsRegistry';
import CampDashboard from './components/CampDashboard';
import Login from './components/Login';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TransparencyWall from './components/TransparencyWall';
import AdminDashboard from './components/AdminDashboard';
import CampPortal from './components/CampPortal';
import GuidanceLayout from './components/guidance/GuidanceLayout';
import DisasterChatbot from './components/guidance/DisasterChatbot';
import NewsScraper from './components/guidance/NewsScraper';
import OfflineGuides from './components/guidance/OfflineGuides';
import ExpertDashboard from './components/expert-dashboard/ExpertDashboard';
import RiverBasinExplorer from './components/expert-dashboard/RiverBasinExplorer';
import PredictionsPage from './components/expert-dashboard/PredictionsPage';
import AlertsManager from './components/expert-dashboard/AlertsManager';
import IncidentTracker from './components/expert-dashboard/IncidentTracker';

function Navigation() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, [window.location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  // All navigation items
  const publicLinks = [
    { to: '/', label: 'Urgent Needs', icon: <Home size={18} />, color: 'text-white' },
    { to: '/transparency', label: 'Public Wall', icon: <Globe size={18} />, color: 'text-white' },
    { to: '/guidance', label: 'Guidance/News', icon: <BookOpen size={18} />, color: 'text-yellow-200' },
  ];

  const adminLinks = [
    { to: '/brain', label: 'Expert Brain', icon: <Activity size={18} />, color: 'text-purple-200' },
    { to: '/rivers', label: 'River Basin Explorer', icon: <Waves size={18} />, color: 'text-cyan-200' },
    { to: '/predictions', label: 'Flood Predictions', icon: <TrendingUp size={18} />, color: 'text-orange-200' },
    { to: '/incidents', label: 'Incident Tracker', icon: <AlertTriangle size={18} />, color: 'text-red-200' },
    { to: '/alerts', label: 'Risk Alerts', icon: <Shield size={18} />, color: 'text-yellow-200' },
    { to: '/admin', label: 'Admin Panel', icon: <Shield size={18} />, color: 'text-white' },
  ];

  const managerLinks = [
    { to: '/manager', label: 'Camp Manager', icon: <Tent size={18} />, color: 'text-white' },
  ];

  const authLinks = [
    { to: '/analytics', label: 'Analytics', icon: <BarChart3 size={18} />, color: 'text-white' },
  ];

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-md relative z-50 border-b border-slate-700">
      <div className="flex justify-between items-center px-2">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 tracking-wide" onClick={closeMenu}>
          <HeartHandshake /> SIDMS <span className="text-blue-400">Relief</span>
        </Link>

        {/* Desktop links (hidden on small screens — hamburger takes over) */}
        <div className="hidden lg:flex gap-6 items-center text-sm font-semibold">
          {publicLinks.map(link => (
            <Link key={link.to} to={link.to} className={`flex items-center gap-1 hover:text-blue-400 ${link.color}`}>
              {link.icon} {link.label}
            </Link>
          ))}

          {!user ? (
            <Link to="/login" className="bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-400">Log In</Link>
          ) : (
            <>
              {user.role === 'admin' && adminLinks.map(link => (
                <Link key={link.to} to={link.to} className={`flex items-center gap-1 hover:text-blue-400 ${link.color}`}>
                  {link.icon} {link.label}
                </Link>
              ))}
              {(user.role === 'camp_manager' || user.role === 'admin') && managerLinks.map(link => (
                <Link key={link.to} to={link.to} className={`flex items-center gap-1 hover:text-blue-400 ${link.color}`}>
                  {link.icon} {link.label}
                </Link>
              ))}
              {authLinks.map(link => (
                <Link key={link.to} to={link.to} className={`flex items-center gap-1 hover:text-blue-400 ${link.color}`}>
                  {link.icon} {link.label}
                </Link>
              ))}
              <div className="border-l border-slate-600 pl-4 flex items-center gap-3">
                <span className="text-slate-300">Hi, {user.fullName.split(' ')[0]}</span>
                <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-200 transition">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop hamburger (always visible) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hidden lg:flex items-center gap-1 ml-4 p-2 rounded-lg hover:bg-slate-700 transition text-sm font-semibold"
        >
          <Menu size={20} /> All Pages
        </button>
      </div>

      {/* Dropdown menu panel */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-900 border-t border-slate-700 shadow-2xl z-50 animate-in slide-in-from-top">
          <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Public Pages */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Public Pages</h3>
              <div className="space-y-1">
                {publicLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition text-slate-200 hover:text-white">
                    <span className="text-blue-400">{link.icon}</span> {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Expert / Admin Pages */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Expert & Admin</h3>
              <div className="space-y-1">
                {adminLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition text-slate-200 hover:text-white">
                    <span className="text-purple-400">{link.icon}</span> {link.label}
                  </Link>
                ))}
                {managerLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition text-slate-200 hover:text-white">
                    <span className="text-emerald-400">{link.icon}</span> {link.label}
                  </Link>
                ))}
                {authLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition text-slate-200 hover:text-white">
                    <span className="text-cyan-400">{link.icon}</span> {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Account</h3>
              <div className="space-y-1">
                {!user ? (
                  <Link to="/login" onClick={closeMenu}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-white font-semibold">
                    Log In
                  </Link>
                ) : (
                  <>
                    <div className="px-3 py-2.5 text-slate-400 text-sm">
                      Signed in as <span className="text-white font-semibold">{user.fullName}</span>
                      <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">{user.role}</span>
                    </div>
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-900/30 transition text-red-400 hover:text-red-300 w-full text-left">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        <Navigation />

        {/* Fullscreen routes (no container constraint) */}
        <Routes>
          <Route path="/brain" element={<ExpertDashboard />} />
          <Route path="/rivers" element={<RiverBasinExplorer />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/alerts" element={<AlertsManager />} />
          <Route path="/incidents" element={<IncidentTracker />} />
          <Route path="*" element={
            <main className="container mx-auto p-4 mt-6">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<NeedsRegistry />} />
                <Route path="/transparency" element={<TransparencyWall />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/manager" element={<CampDashboard />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/camp/:campId" element={<CampPortal />} />

                {/* Guidance sub-app */}
                <Route path="/guidance" element={<GuidanceLayout />}>
                  <Route index element={<DisasterChatbot />} />
                  <Route path="chat" element={<DisasterChatbot />} />
                  <Route path="news" element={<NewsScraper />} />
                  <Route path="guides" element={<OfflineGuides />} />
                </Route>
              </Routes>
            </main>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
