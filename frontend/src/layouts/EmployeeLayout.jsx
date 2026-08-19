import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import AppSidebar from '../components/AppSidebar';
import { Home, Clock, CheckSquare, Calendar, User, Wallet, Bell } from 'lucide-react';
import { api } from '../api/api';

const EmployeeLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/employee/home';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.get('/user');
        setUser(userData);
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

  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const navLinks = [
    { name: 'Home', path: '/employee/home', icon: Home },
    { name: 'Attendance', path: '/employee/attendance', icon: Clock },
    { name: 'Tasks', path: '/employee/tasks', icon: CheckSquare },
    { name: 'Leaves', path: '/employee/leaves', icon: Calendar },
    { name: 'Payslips', path: '/employee/payslips', icon: Wallet },
    { name: 'Profile', path: '/employee/profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen font-sans">
      <AppSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        navLinks={navLinks}
        onLogout={handleLogout}
        layoutId="employee-nav-indicator"
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
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800">
                {user ? `Welcome, ${(user.name || user.first_name || user.user?.name || user.user?.first_name || 'Employee').split(' ')[0]}` : 'Employee'}
              </h1>
              <p className="hidden text-xs text-slate-400 sm:block">{currentDate}</p>
            </div>
          </div>

          {isHomePage && (
            <NavLink
              to="/employee/alerts"
              className="relative rounded-xl p-2.5 text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600"
              title="Alerts"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </NavLink>
          )}
        </motion.header>

        <main className="pro-content scrollbar-thin flex-1 overflow-y-auto p-4 lg:p-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
