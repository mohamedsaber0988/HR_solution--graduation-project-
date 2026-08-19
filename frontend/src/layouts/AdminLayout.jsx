import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import AppSidebar from '../components/AppSidebar';
import {
  Home,
  Clock,
  CheckSquare,
  Calendar,
  User,
  Bell,
  QrCode,
  Users,
  Settings,
  Wallet,
} from 'lucide-react';
import { api } from '../api/api';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/admin/home';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await api.get('/user');
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/admin/home', icon: Home },
    { name: 'QR Code', path: '/admin/qr', icon: QrCode },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Departments', path: '/admin/departments', icon: CheckSquare },
    { name: 'Attendance Settings', path: '/admin/attendance-settings', icon: Settings },
    { name: 'Attendance', path: '/admin/attendance', icon: Clock },
    { name: 'Leaves', path: '/admin/leaves', icon: Calendar },
    { name: 'Payslips', path: '/admin/Payslips', icon: Wallet },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen font-sans">
      <AppSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        navLinks={navLinks}
        onLogout={handleLogout}
        layoutId="admin-nav-indicator"
      />

      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pro-header-bar"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800">Admin Console</h1>
              <p className="hidden text-xs text-slate-400 sm:block">System management</p>
            </div>
          </div>

          {isHomePage && (
            <NavLink
              to="/admin/alerts"
              className="relative rounded-xl p-2.5 text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600"
              title="Alerts"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </NavLink>
          )}
        </motion.header>

        <main className="pro-content scrollbar-thin flex-1 overflow-y-auto p-6 lg:p-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
