import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Restrained editorial reveal wrapper that respects prefers-reduced-motion.
 */
export function EditorialReveal({
  children,
  delay = 0,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
