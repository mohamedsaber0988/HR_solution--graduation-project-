import { motion } from 'framer-motion';

const AILoading = () => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="relative mb-6 h-24 w-24">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 border-r-blue-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-400 border-l-indigo-400"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ✨
      </motion.div>
    </div>

    <motion.h2
      className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-lg font-bold text-transparent"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      AI is analyzing CVs
    </motion.h2>
    <p className="mt-2 text-sm text-slate-500">Gemini-powered ranking in progress...</p>

    <div className="mt-6 flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-blue-500"
          animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  </div>
);

export default AILoading;
