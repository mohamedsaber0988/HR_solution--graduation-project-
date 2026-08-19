import { motion } from 'framer-motion';
import clsx from 'clsx';

const StatCard = ({ title, value, change, trend, icon: Icon, color, index = 0 }) => {
  const isPositive = trend === 'up';

  const colorStyles = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100/80 text-blue-600 ring-1 ring-blue-100',
    green: 'bg-gradient-to-br from-emerald-50 to-emerald-100/80 text-emerald-600 ring-1 ring-emerald-100',
    purple: 'bg-gradient-to-br from-violet-50 to-violet-100/80 text-violet-600 ring-1 ring-violet-100',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100/80 text-orange-600 ring-1 ring-orange-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="pro-card-interactive group cursor-default"
    >
      <div className="mb-4 flex items-start justify-between">
        <motion.div
          className={clsx('rounded-xl p-3 shadow-sm', colorStyles[color] || colorStyles.blue)}
          whileHover={{ rotate: [0, -6, 6, 0], transition: { duration: 0.4 } }}
        >
          <Icon size={22} />
        </motion.div>
        {change != null && (
          <div
            className={clsx(
              'rounded-full px-2.5 py-1 text-xs font-bold',
              isPositive ? 'pro-badge-success' : 'pro-badge-danger'
            )}
          >
            {isPositive ? '+' : ''}
            {change}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</div>
      </div>

      <div className="mt-4 h-0.5 w-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
};

export default StatCard;
