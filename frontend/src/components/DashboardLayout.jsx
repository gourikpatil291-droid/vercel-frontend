import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Users, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Forms', path: '/forms', icon: FileText, roles: ['SE', 'Manager', 'HO'] },
    { name: 'Manager Portal', path: '/manager', icon: Users, roles: ['Manager', 'HO'] },
    { name: 'HO Dashboard', path: '/ho', icon: LayoutDashboard, roles: ['HO'] },
  ];

  return (
    <div className="flex h-screen bg-background text-text-main font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-input-border flex flex-col shadow-sm no-print">
        <div className="h-16 flex items-center px-6 border-b border-input-border">
          <h1 className="text-xl font-bold text-text-main tracking-wide">Service Portal</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-4 mb-6">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-2">Menu</p>
            <nav className="space-y-1">
              {navItems.filter(item => item.roles.includes(user?.role)).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-500/10 text-primary-500' : 'text-text-muted hover:bg-surfaceHover hover:text-text-main'}`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-500' : 'text-text-muted'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-input-border">
          <div className="flex items-center mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-text-main">{user?.name}</p>
              <p className="text-xs text-text-muted">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <Outlet />
      </main>
    </div>
  );
}
