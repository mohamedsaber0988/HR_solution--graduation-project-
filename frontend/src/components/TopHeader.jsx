import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, User } from 'lucide-react';

const TopHeader = ({ setMobileOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pro-header-bar"
    >
      <div className="flex flex-1 items-center gap-4">
        <motion.button
          onClick={() => setMobileOpen(true)}
          className="-ml-2 rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
          whileTap={{ scale: 0.92 }}
        >
          <Menu size={24} />
        </motion.button>

        <div className="group relative hidden w-full max-w-md sm:block">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
              searchFocused ? 'text-blue-500' : 'text-slate-400'
            }`}
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search employees or tasks..."
            className="pro-input-icon w-full py-2.5"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => navigate('/hr/alerts')}
          className="relative rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="View Notifications"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </span>
        </motion.button>

        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        <motion.button
          onClick={() => navigate('/hr/profile')}
          className="flex items-center justify-center rounded-full p-1 ring-2 ring-transparent transition-all hover:ring-blue-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go to Profile"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
            <User size={20} />
          </div>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default TopHeader;
