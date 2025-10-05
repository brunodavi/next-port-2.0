'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  index: number;
  sectionId: string;
}

export default function AnimatedSection({ children, index, sectionId }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, // Anima apenas uma vez
    margin: "-100px" // Trigger quando estiver 100px antes de aparecer
  });

  return (
    <motion.section
      ref={ref}
      id={sectionId}
      className="min-h-screen w-full flex flex-col items-center justify-center snap-start snap-always px-6 py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay: 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] // Curva de animação suave
      }}
    >
      {children}
    </motion.section>
  );
}
