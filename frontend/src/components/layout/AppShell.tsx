import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  FileText,
  BarChart2,
  Waves,
  AlertTriangle,
  BookOpen,
  User,
  Shield,
  Bell,
  Search as SearchIcon,
  Menu,
  Activity,
  LogOut,
  X,
  Server,
  HeartHandshake,
  MessageSquare,
  Tent,
  Globe,
} from 'lucide-react';
import { useUnreadCount } from '../../hooks/useNotifications';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import InstallPwaPrompt from '../common/InstallPwaPrompt';
import SosButton from '../emergency/SosButton';

const navigation = [
  { name: 'Home',       href: '/dashboard',   icon: LayoutDashboard },
  { name: 'Map',        href: '/map',          icon: Map },
  { name: 'Reports',    href: '/reports',      icon: FileText },
  { name: 'Analytics',  href: '/analytics',    icon: BarChart2 },
  { name: 'Flood',      href: '/flood',        icon: Waves },
  { name: 'Emergency',  href: '/emergency',    icon: AlertTriangle },
  { name: 'Guides',     href: '/guides',       icon: BookOpen },
  { name: 'Profile',    href: '/profile',      icon: User },
  { name: 'Relief Needs', href: '/relief',     icon: HeartHandshake },
  { name: 'AI Guidance', href: '/guidance', icon: MessageSquare },
];

const mobileNav = [
  { name: 'Home',    href: '/dashboard',      icon: LayoutDashboard },
  { name: 'Map',     href: '/map',            icon: Map },
  { name: 'Report',  href: '/reports',        icon: FileText },
  { name: 'Alerts',  href: '/notifications',  icon: Bell },
  { name: 'Profile', href: '/profile',        icon: User },
];

export default function AppShell() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: unreadData } = useUnreadCount();
  const { user, isAdmin, logout } = useAuthStore();
  const location = useLocation();

  const isUserAdmin = isAdmin();
  const userRoles = user?.roles || [];
  const canSeeOperations = isUserAdmin || userRoles.some(r => 
    ['responder', 'govt_official', 'volunteer', 'FIRST_RESPONDER', 'GOVT_OFFICIAL', 'VOLUNTEER', 'AGENCY_PARTNER'].includes(r)
  );
  const isCampManager = isUserAdmin || userRoles.some(r => ['responder', 'RESPONDER'].includes(r));

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Global Overview';
    if (path === '/map') return 'Interactive Risk Map';
    const item = [
      ...navigation,
      { name: 'Admin',             href: '/admin' },
      { name: 'Operations',        href: '/operations' },
      { name: 'Core System',       href: '/admin/system' },
      { name: 'Disasters & Community', href: '/admin/disasters' },
      { name: 'Warnings',          href: '/admin/warnings' },
      { name: 'Reports',           href: '/admin/reports' },
      { name: 'Relief Camps',      href: '/admin/camps' },
      { name: 'Needs & Pledges',   href: '/admin/needs' },
    ].find(n => path === n.href || (n.href !== '/admin' && path.startsWith(n.href)));
    return item?.name || 'SIDMS';
  };

  return (
    <div className="flex bg-slate-900 text-slate-100 min-h-screen font-sans">

      {/* ── Sidebar (Desktop) ───────────────────────────────────────── */}
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-[220px]' : 'w-[64px]'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 shrink-0 overflow-hidden border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
            <Waves className="text-white" size={18} />
          </div>
          <span className={`ml-3 font-black text-lg tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-200 whitespace-nowrap overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
            SIDMS
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center h-10 rounded-lg transition-all duration-200 group/nav ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100 border border-transparent'
                }`
              }
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <item.icon size={18} className="group-hover/nav:scale-110 transition-transform" />
              </div>
              <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                {item.name}
              </span>
            </NavLink>
          ))}

          {(isUserAdmin || canSeeOperations) && (
            <div className="pt-4 mt-4 border-t border-slate-800">
              <p className={`text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 px-2 transition-all duration-200 whitespace-nowrap overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                Management
              </p>
              {isUserAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center h-10 rounded-lg transition-all duration-200 group/nav ${
                      isActive
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-red-400 border border-transparent'
                    }`
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Shield size={18} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    System Admin
                  </span>
                </NavLink>
              )}

              {isUserAdmin && (
                <NavLink
                  to="/admin/disasters"
                  className={({ isActive }) =>
                    `flex items-center h-10 rounded-lg transition-all duration-200 group/nav mt-1 ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-amber-400 border border-transparent'
                    }`
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    Disasters & Community
                  </span>
                </NavLink>
              )}

              {/* ── Step 8: DM-origin camp + needs admin pages ── */}
              {isUserAdmin && (
                <NavLink
                  to="/admin/camps"
                  className={({ isActive }) =>
                    `flex items-center h-10 rounded-lg transition-all duration-200 group/nav mt-1 ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-cyan-400 border border-transparent'
                    }`
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Tent size={18} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    Relief Camps
                  </span>
                </NavLink>
              )}

              {isUserAdmin && (
                <NavLink
                  to="/admin/needs"
                  className={({ isActive }) =>
                    `flex items-center h-10 rounded-lg transition-all duration-200 group/nav mt-1 ${
                      isActive
                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-violet-400 border border-transparent'
                    }`
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <HeartHandshake size={18} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    Needs &amp; Pledges
                  </span>
                </NavLink>
              )}

              {isUserAdmin && (
                <NavLink
                  to="/admin/system"
                  className={({ isActive }) =>
                    `flex items-center h-10 rounded-lg transition-all duration-200 group/nav mt-1 ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-emerald-400 border border-transparent'
                    }`
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Server size={18} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    Core System
                  </span>
                </NavLink>
              )}

              {canSeeOperations && (
                <NavLink
                  to="/operations"
                  className={({ isActive }) =>
                    `flex items-center h-10 rounded-lg transition-all duration-200 group/nav ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-amber-400 border border-transparent'
                    }`
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Activity size={18} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    Operations Hub
                  </span>
                </NavLink>
              )}

              {isCampManager && (
                <NavLink
                  to="/relief/manager"
                  className={({ isActive }) =>
                    `flex items-center h-10 rounded-lg transition-all duration-200 group/nav mt-1 ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-cyan-400 border border-transparent'
                    }`
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Tent size={18} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    Camp Manager
                  </span>
                </NavLink>
              )}

              {isUserAdmin && (
                <NavLink
                  to="/expert"
                  className={({ isActive }) =>
                    `flex items-center h-10 rounded-lg transition-all duration-200 group/nav mt-1 ${
                      isActive
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-purple-400 border border-transparent'
                    }`
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Globe size={18} />
                  </div>
                  <span className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    Expert Systems
                  </span>
                </NavLink>
              )}
            </div>
          )}
        </nav>

        {/* PWA Install prompt (only when expanded) */}
        <div className={`px-2 border-t border-slate-800 transition-all duration-200 overflow-hidden ${isExpanded ? 'max-h-20 py-2 opacity-100' : 'max-h-0 opacity-0'}`}>
          <InstallPwaPrompt />
        </div>

        {/* User block */}
        <div className="p-2 border-t border-slate-800">
          <div className="flex items-center h-10 rounded-lg bg-slate-800/50 overflow-hidden">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-[10px] font-black text-white uppercase">
                {user?.displayName?.substring(0, 2) || 'US'}
              </div>
            </div>
            <div className={`ml-1 transition-all duration-200 overflow-hidden ${isExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
              <p className="text-xs font-bold text-slate-200 truncate w-28">{user?.displayName}</p>
              <p className="text-[10px] text-slate-500 truncate w-28">{user?.roles?.[0] || 'Member'}</p>
            </div>
            {isExpanded && (
              <button
                onClick={() => logout()}
                className="ml-auto mr-2 text-slate-500 hover:text-red-400 transition"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isExpanded ? 'md:ml-[220px]' : 'md:ml-[64px]'}`}>

        {/* TopBar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-base font-bold text-slate-100 tracking-tight">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition">
              <SearchIcon size={18} />
            </button>
            <NavLink
              to="/notifications"
              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition relative"
            >
              <Bell size={18} />
              {unreadData?.unreadCount && unreadData.unreadCount > 0 ? (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[9px] font-black text-white flex items-center justify-center rounded-full">
                  {unreadData.unreadCount > 9 ? '9+' : unreadData.unreadCount}
                </span>
              ) : null}
            </NavLink>
            <div className="hidden md:block h-5 w-px bg-slate-800 mx-1" />
            <NavLink to="/profile" className="hidden md:flex items-center gap-2 group">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-300 group-hover:text-blue-400 transition uppercase tracking-wider">{user?.displayName}</p>
                <p className="text-[9px] text-slate-500">Verified Account</p>
              </div>
            </NavLink>
          </div>
        </header>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm pt-16">
            <nav className="p-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive ? 'bg-blue-500/10 text-blue-400' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span className="font-semibold">{item.name}</span>
                </NavLink>
              ))}
              {canSeeOperations && (
                <NavLink
                  to="/operations"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <Activity size={18} />
                  <span className="font-semibold">Operations Hub</span>
                </NavLink>
              )}
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* ── Bottom Nav (Mobile) ──────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 px-2 py-2 pb-6 flex justify-around items-center">
        {mobileNav.map((item) => (
          <NavLink key={item.name} to={item.href} className="flex-1">
            {({ isActive }) => (
              <div className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition ${
                isActive ? 'text-blue-400' : 'text-slate-500'
              }`}>
                <item.icon size={20} className={isActive ? 'scale-110' : ''} />
                <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
      {/* SOS Button */}
      <SosButton />
    </div>
  );
}
