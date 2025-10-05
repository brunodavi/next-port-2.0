'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedContentProps {
  children: React.ReactNode;
}

// Variantes de animação para o container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay entre cada filho
      delayChildren: 0.2 // Delay inicial
    }
  }
};

// Variantes de animação para os itens
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
};

export function AnimatedHeading({ children, className }: { children: React.ReactNode; className: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.h2
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.h2>
  );
}

export function AnimatedContent({ children }: AnimatedContentProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="prose prose-lg dark:prose-invert mx-auto max-w-none"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div variants={itemVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
}
