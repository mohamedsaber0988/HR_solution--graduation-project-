import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

const PageHeader = ({ title, subtitle, action, className }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
  >
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
      )}
    </div>
    {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
  </motion.div>
);

export default PageHeader;
