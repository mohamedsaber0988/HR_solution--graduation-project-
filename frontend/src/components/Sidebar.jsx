import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  Users,
  Calendar,
  ChartLine,
  LogOut,
  FolderDown,
  Wallet,
  User,
} from 'lucide-react';
import { staggerContainer, staggerItem } from '../lib/motion';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

    const menuItems = [
    { icon: ChartLine, label: 'Dashboard', path: '/hr/home' },
    { icon: Calendar, label: 'My Leaves', path: '/hr/my-leaves' },
    { icon: Calendar, label: 'Manage Leaves', path: '/hr/leaves' },
    { icon: Users, label: 'Recruitment', path: '/hr/recruitment' },
    { icon: FolderDown, label: 'Reports', path: '/hr/reports' },
    { icon: Calendar, label: 'Attendance', path: '/hr/attendance' },
    { icon: Wallet, label: 'Payslips', path: '/hr/Payslips' },
    { icon: User, label: 'Profile', path: '/hr/profile' },
  ];

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
        initial={false}
        animate={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.25 }}
        onClick={() => setMobileOpen(false)}
      />

      <motion.aside
        className={clsx(
          'app-sidebar transform transition-transform duration-300 ease-out md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        initial={false}
      >
        <div className="flex flex-col items-center justify-center border-b border-white/10 py-2 gap-1">
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <img src="/logo.png" alt="Managly Logo" className="w-32 h-32 object-contain" />
          </motion.div>
          <p className="text-[18px] font-semibold uppercase tracking-widest text-blue-300/80">HR Suite</p>
        </div>

        <motion.nav
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="scrollbar-thin flex-1 space-y-1 overflow-x-visible overflow-y-auto px-3 py-5"
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                variants={staggerItem}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={isActive ? 'nav-item-pro-active' : 'nav-item-pro overflow-visible'}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.span
                    layoutId="hr-nav-indicator"
                    className="nav-active-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="nav-item-content">
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-blue-200'} />
                  <span className="truncate">{item.label}</span>
                </span>
              </motion.button>
            );
          })}
        </motion.nav>

        <div className="flex flex-col gap-2 border-t border-white/10 p-4">
          <button
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              navigate('/login');
            }}
            className="nav-item-pro text-red-200/90 hover:bg-red-500/10 hover:text-red-100"
          >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
          </button>
          <p className="px-4 text-xs text-blue-400/60">v1.0.0</p>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
