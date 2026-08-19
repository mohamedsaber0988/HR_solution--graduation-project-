import { motion } from 'framer-motion';

const LoadingScreen = ({ message = 'Loading...', compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-3 py-12">
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-blue-200 border-t-blue-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm font-medium text-slate-500">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5">
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/30 to-indigo-500/20 blur-xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-500/10 ring-1 ring-slate-200/80"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="h-7 w-7 rounded-full border-2 border-blue-100 border-t-blue-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
      <motion.p
        className="text-sm font-semibold tracking-wide text-slate-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingScreen;
