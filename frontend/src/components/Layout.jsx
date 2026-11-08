import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Map, MessageSquare, AlertTriangle,
  Phone, Settings, Menu, X, Shield, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/map', icon: Map, label: 'Safety Map' },
  { to: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
  { to: '/report', icon: AlertTriangle, label: 'Report Hazard' },
  { to: '/emergency', icon: Phone, label: 'Emergency' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = NAV_ITEMS.find(item =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  );

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-navy-900 border-r border-white/5 
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-swiggy-orange flex items-center justify-center shadow-lg glow-orange">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">SafeRoute</h1>
              <p className="text-xs text-gray-500">Delivery Safety Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Partner Badge */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-swiggy-orange/10 border border-swiggy-orange/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-swiggy-orange flex items-center justify-center text-sm font-bold text-white shrink-0">
            RK
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Rahul Kumar</p>
            <p className="text-xs text-swiggy-orange">● Active · Partner #SW4821</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{label}</span>
              {to === '/emergency' && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">System operational</span>
          </div>
          <p className="text-xs text-gray-600 px-3 mt-1">
            Powered by SafeRoute v1.0 · <span className="text-yellow-600">DEMO</span>
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-navy-900/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-6 py-4 flex items-center gap-4 shrink-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>SafeRoute</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{currentPage?.label || 'Dashboard'}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Backend Connected</span>
            </div>
            <span className="demo-label">DEMO</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

