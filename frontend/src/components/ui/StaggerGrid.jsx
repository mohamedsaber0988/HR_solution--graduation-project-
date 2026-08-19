import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../lib/motion';
import { cn } from '../../lib/cn';

export const StaggerGrid = ({ children, className }) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    className={cn(className)}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className }) => (
  <motion.div
    variants={staggerItem}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className={cn(className)}
  >
    {children}
  </motion.div>
);
