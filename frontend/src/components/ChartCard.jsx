import { motion } from 'framer-motion';

const ChartCard = ({ title, children, action, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    className="pro-card h-full"
  >
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-lg font-bold tracking-tight text-slate-800">{title}</h3>
      {action && <div>{action}</div>}
    </div>
    <div className="w-full">{children}</div>
  </motion.div>
);

export default ChartCard;
