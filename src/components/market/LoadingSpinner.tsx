// components/LoadingSpinner.tsx
import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center py-12"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent" />
    </motion.div>
  );
}