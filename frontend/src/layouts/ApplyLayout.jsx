import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { BriefcaseBusiness } from 'lucide-react';

const ApplyLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <motion.div
            onClick={() => navigate('/')}
            className="group flex cursor-pointer items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-2 shadow-md shadow-indigo-500/25 transition-transform group-hover:rotate-3">
              <BriefcaseBusiness className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none text-slate-900">Managly</h1>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Careers Portal</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <Link
              to="/Portal/OpenPosition"
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                location.pathname.startsWith('/Portal/OpenPosition')
                  ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Careers
            </Link>

            <Link
              to="/login"
              className="pro-btn-primary ml-2 !rounded-xl !py-2 !shadow-md"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </motion.nav>

      <main className="pro-content flex-grow">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <footer className="mt-auto border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <div className="flex items-center gap-2 opacity-70">
            <BriefcaseBusiness size={18} className="text-indigo-600" />
            <span className="text-sm font-bold text-slate-800">Managly HR Ecosystem</span>
          </div>
          <p className="text-xs font-medium text-slate-400">
            © {new Date().getFullYear()} · Built for modern teams
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ApplyLayout;
