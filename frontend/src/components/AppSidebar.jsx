import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LogOut, X } from 'lucide-react';
import { staggerContainer, staggerItem } from '../lib/motion';

/**
 * Shared sidebar shell for Admin, Employee, Supervisor layouts.
 */
const AppSidebar = ({ mobileOpen, setMobileOpen, navLinks, onLogout, layoutId = 'nav-indicator' }) => (
  <>
    <motion.div
      className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
      initial={false}
      animate={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none' }}
      transition={{ duration: 0.25 }}
      onClick={() => setMobileOpen(false)}
    />

    <aside
      className={clsx(
        'app-sidebar transform transition-transform duration-300 ease-out md:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="relative flex flex-col items-center justify-center border-b border-white/10 py-2 gap-1">
        <motion.div
          className="flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
        >
          <img src="/logo.png" alt="Managly Logo" className="w-32 h-32 object-contain" />
        </motion.div>
        <p className="text-[18px] font-semibold uppercase tracking-widest text-blue-300/80">Workspace</p>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1 text-blue-200 transition-colors hover:text-white md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <motion.nav
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="scrollbar-thin flex-1 space-y-1 overflow-x-visible overflow-y-auto px-3 py-5"
      >
        {navLinks.map((link) => (
          <motion.div key={link.path} variants={staggerItem} className="overflow-visible">
            <NavLink
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                isActive ? 'nav-item-pro-active' : 'nav-item-pro overflow-visible'
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId={layoutId}
                      className="nav-active-indicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="nav-item-content">
                    <link.icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{link.name}</span>
                  </span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      <div className="border-t border-white/10 p-4">
        <button onClick={onLogout} className="nav-item-pro w-full text-red-200/90 hover:bg-red-500/10 hover:text-red-100">
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="font-medium">Log Out</span>
        </button>
        <p className="mt-2 px-4 text-xs text-blue-400/60">v1.0.0</p>
      </div>
    </aside>
  </>
);

export default AppSidebar;
